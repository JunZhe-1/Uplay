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

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CartController : ControllerBase
    {
        private readonly MyDbContext _context;
		private readonly ILogger<EventController> _logger;

		public CartController(MyDbContext context, ILogger<EventController> logger)
        {
            _context = context;
            _logger = logger;
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
                Voucher_ID = request.Voucher_ID,
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

        [HttpGet("getuser/{id}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCartItemsByUserId(int id)
        {
            try
            {
                var cartItems = await _context.Carts
                    .Where(c => c.UserId == id)
                    .ToListAsync();

                if (cartItems == null || cartItems.Count == 0)
                {
                    return NotFound(new { message = "No cart items found for the given user ID." });
                }

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
                cartItem.Event_ID = request.Event_ID;
                cartItem.Voucher_ID = request.Voucher_ID;
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
            cartItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("removevoucher/{id}")]
        public async Task<IActionResult> RemoveVoucher(int id)
        {
            var userId = GetUserId(); 
            var cartItem = await _context.Carts.FindAsync(id);

            if (cartItem == null || cartItem.UserId != userId)
            {
                return NotFound();
            }

            // Remove the voucher reference
            cartItem.Voucher_ID = null;
            cartItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = GetUserId();
            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            // Perform checkout logic here (e.g., calculate total, apply discounts, etc.)

            // Delete the cart after successful checkout
            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Checkout successful." });
        }
    }
}
