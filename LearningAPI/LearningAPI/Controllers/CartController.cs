using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearningAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using MySqlX.XDevAPI.Relational;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System.Globalization;
using Stripe;
using Stripe.Checkout;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.Extensions.Options;
using Event = LearningAPI.Models.Event;
using System.Reflection;

namespace LearningAPI.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class CartController : ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly ILogger<EventController> _logger;
		private readonly StripeSettings _stripeSettings;

		public CartController(MyDbContext context, ILogger<EventController> logger, IOptions<StripeSettings> stripeSettings)
		{
			_context = context;
			_logger = logger;
			_stripeSettings = stripeSettings.Value;
		}

		private int GetUserId()
		{
			return Convert.ToInt32(User.Claims
				.Where(c => c.Type == ClaimTypes.NameIdentifier)
				.Select(c => c.Value).SingleOrDefault());
		}

		[HttpPost("add")]
		public async Task<ActionResult<Cart>> AddCart(Cart request)
		{
			int userId = GetUserId();
			DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");
			var cart = new Cart()
			{
				Booking_Date = book,
				Booking_Quantity = request.Booking_Quantity,
				UserId = userId,
				Event_ID = request.Event_ID,
				CreatedAt = DateTime.Now,
				UpdatedAt = DateTime.Now
			};

			_context.Carts.Add(cart);
			await _context.SaveChangesAsync();

			return Ok(cart);
		}

		[HttpPost("addcart")]
		public async Task<ActionResult<Cart>> AddCartUser(Cart request)
		{
			int userId = GetUserId();
			DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");
			var cart = new Cart()
			{
				Booking_Date = book,
				Booking_Quantity = request.Booking_Quantity,
				UserId = userId,
				Event_ID = request.Event_ID,
				CreatedAt = DateTime.Now,
				UpdatedAt = DateTime.Now
			};

			_context.Carts.Add(cart);
			await _context.SaveChangesAsync();

			return Ok(cart);
		}

		[HttpGet]
		public IActionResult GetAll(String? search)
		{

			IQueryable<Cart> result = _context.Carts;

			if (!string.IsNullOrEmpty(search))
			{
				// Convert Cart_ID to string before applying Contains
				result = result.Where(x => x.Cart_ID.ToString().Contains(search));
			}
			return Ok(result);
		}

		[HttpGet("get/{id}")]
		public IActionResult GetCartItemsByCartId(int id)
		{
			try
			{
				Cart? cartItems = _context.Carts.Find(id);


				if (cartItems == null)
				{
					return NotFound(new { message = "No cart items found for the given cart ID." });
				}

				return Ok(cartItems);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when get cart item by id");
				return StatusCode(500);
			}
		}

		[HttpGet("getcart/{id}")]
		public async Task<ActionResult<IEnumerable<Cart>>> GetCartItemsByUserId(int id)
		{
			try
			{
				var cartItems = await _context.Carts
					.Where(c => c.UserId == id)
					.ToListAsync();

				return Ok(cartItems);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when get user's cart by id");
				return StatusCode(500);
			}
		}

		[HttpPut("update/{id}")]
		public async Task<IActionResult> UpdateCartItem(int id, Cart request)
		{
			try
			{
				var cartItem = await _context.Carts.FindAsync(id);
				DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");

				if (cartItem == null)
				{
					return NotFound();
				}

				// Update relevant properties based on request
				cartItem.Booking_Date = book;
				cartItem.Booking_Quantity = request.Booking_Quantity;
				cartItem.UserId = request.UserId;
				cartItem.Event_ID = request.Event_ID;
				cartItem.UpdatedAt = DateTime.UtcNow;

				await _context.SaveChangesAsync();

				return Ok(cartItem);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when updating cart");
				return StatusCode(500);
			}
		}

		[HttpPut("updatecart/{id}")]
		public async Task<IActionResult> UpdateCartItemUser(int id, CartUser request)
		{
			try
			{
				var cartItem = await _context.Carts.FindAsync(id);
				DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");

				if (cartItem == null)
				{
					return NotFound();
				}

				// Update relevant properties based on request
				cartItem.Booking_Date = book;
				cartItem.Booking_Quantity = request.Booking_Quantity;
				cartItem.UpdatedAt = DateTime.UtcNow;

				await _context.SaveChangesAsync();

				return Ok(cartItem);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when updating cart");
				return StatusCode(500);
			}
		}


		[HttpDelete("removeitem/{id}")]
		public async Task<IActionResult> RemoveCartItem(int id)
		{
			var cartItem = await _context.Carts.FindAsync(id);

			_context.Carts.Remove(cartItem);

			await _context.SaveChangesAsync();
			return NoContent();
		}

		[HttpPost("checkout")]
		public async Task<IActionResult> Checkout()
		{
			int userId = GetUserId();
			try
			{
				var cartItems = await _context.Carts
					.Where(c => c.UserId == userId)
					.ToListAsync();

				Member? member = _context.Members.Find(userId);

				List<ProductEntity> productList = new List<ProductEntity>();
				// logic to retrieve the data from foreign key in cart table

				// Join the Event table to retrieve Event details for each Cart item
				var joinedItems = from cart in cartItems
								  join myEvent in _context.Events on cart.Event_ID equals myEvent.Event_ID
								  select new { cart, myEvent };

				foreach (var joinedItem in joinedItems)
				{
					var cartItem = joinedItem.cart;
					var myEvent = joinedItem.myEvent;
					var price = 0;
					if (member?.MemberStatus == "NTUC")
					{
						price = myEvent.Event_Fee_NTUC;
					}
					else
					{
						price = myEvent.Event_Fee_Guest;
					}
					productList.Add(new ProductEntity
					{
						ImageFile = myEvent.ImageFile,
						Event_Name = myEvent.Event_Name,
						Booking_Quantity = cartItem.Booking_Quantity,
						Price = price
					});
				}
				UplayUser? user = _context.UplayUsers.Find(userId);

				var successUrl = "http://localhost:3000/success";
				var cancelUrl = "http://localhost:3000/cancel";

				StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

				var options = new SessionCreateOptions
				{
					LineItems = new List<SessionLineItemOptions>(),
					Mode = "payment",
					SuccessUrl = successUrl,
					CancelUrl = cancelUrl,
					CustomerEmail = user?.EmailAddress,
				};

				foreach (var item in productList)
				{
					var sessionListItem = new SessionLineItemOptions
					{
						PriceData = new SessionLineItemPriceDataOptions
						{

							UnitAmount = (long)(item.Price * 100),
							Currency = "sgd",
							ProductData = new SessionLineItemPriceDataProductDataOptions
							{
								Name = item.Event_Name.ToString(),
								// Images = new List<string> { $"https://localhost:7157/uploads/{ item.ImageFile }" } blocked by CORS	
							}
						},
						Quantity = item.Booking_Quantity,
					};
					options.LineItems.Add(sessionListItem);
				}

				var service = new SessionService();
				var session = service.Create(options);


				return Ok(new {RedirectUrl = session.Url });
			}
			catch (Exception ex)
			{
				// Log the error
				_logger.LogError(ex, "Error when checking out");
				return StatusCode(500);
			}
		}
	}
}