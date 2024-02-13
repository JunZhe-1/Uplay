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

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly MyDbContext _context;
		private readonly ILogger<EventController> _logger;

		public OrderController(MyDbContext context, ILogger<EventController> logger)
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
        public async Task<ActionResult<Cart>> AddOrder(Order request)
        {
            int userId = GetUserId();
            DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");
            var order = new Order()
            {
                Booking_Date = book,
                Booking_Quantity = request.Booking_Quantity,
                Price = request.Price,
                UserId = request.UserId,
				Event_ID = request.Event_ID,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

		[HttpPost("addorder")]
		public async Task<ActionResult<Cart>> AddOrderUser(Order request)
		{
			int userId = GetUserId();
			DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");
			var order = new Order()
			{
				Booking_Date = book,
				Booking_Quantity = request.Booking_Quantity,
				Price = request.Price,
				UserId = userId,
				Event_ID = request.Event_ID,
				CreatedAt = DateTime.Now,
				UpdatedAt = DateTime.Now
			};

			_context.Orders.Add(order);
			await _context.SaveChangesAsync();

			return Ok(order);
		}

		[HttpGet]
        public IActionResult GetAll(String? search)
        {

            IQueryable<Order> result = _context.Orders;

            if (!string.IsNullOrEmpty(search))
            {
                // Convert Order_ID to string before applying Contains
                result = result.Where(x => x.Order_ID.ToString().Contains(search));
            }
            return Ok(result);
        }

        [HttpGet("get/{id}")]
        public IActionResult GetOrderItemsByOrderId(int id)
        {
            try
            {
                Order? cartItems = _context.Orders.Find(id);


                if (cartItems == null)
                {
                    return NotFound(new { message = "No order items found for the given order ID." });
                }

                return Ok(cartItems);
            }
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when get order item by id");
				return StatusCode(500);
			}
		}

        [HttpGet("getorder/{id}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrderItemsByUserId(int id)
        {
            try
            {
                var orderItems = await _context.Orders
                    .Where(c => c.UserId == id)
                    .ToListAsync();

                if (orderItems == null || orderItems.Count == 0)
                {
                    return NotFound(new { message = "No order items found for the given user ID." });
                }

                return Ok(orderItems);
            }
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when get user's order by id");
				return StatusCode(500);
			}
		}

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateOrderItem(int id, Order request)
        {
            try
            {
                var orderItems = await _context.Orders.FindAsync(id);
                DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");

                if (orderItems == null)
                {
                    return NotFound();
                }

				// Update relevant properties based on request
				orderItems.Booking_Date = book;
				orderItems.Booking_Quantity = request.Booking_Quantity;
                orderItems.Price = request.Price;
				orderItems.UserId = request.UserId;
				orderItems.Event_ID = request.Event_ID;
				orderItems.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(orderItems);
            }
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when updating cart");
				return StatusCode(500);
			}
		}

		// [HttpPut("updateorder/{id}")]
		// public async Task<IActionResult> UpdateOrderItemUser(int id, OrderUser request)
		// {
		// 	try
		// 	{
		// 		var orderItems = await _context.Orders.FindAsync(id);
		// 		DateTime book = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(request.Booking_Date, "Singapore Standard Time");

		// 		if (orderItems == null)
		// 		{
		// 			return NotFound();
		// 		}

		// 		// Update relevant properties based on request
		// 		orderItems.Booking_Date = book;
		// 		orderItems.Booking_Quantity = request.Booking_Quantity;
		// 		orderItems.UpdatedAt = DateTime.UtcNow;

		// 		await _context.SaveChangesAsync();

		// 		return Ok(orderItems);
		// 	}
		// 	catch (Exception ex)
		// 	{
		// 		_logger.LogError(ex, "Error when updating order");
		// 		return StatusCode(500);
		// 	}
		// }


		[HttpDelete("removeitem/{id}")]
        public async Task<IActionResult> RemoveOrderItem(int id)
        {
            var orderItem = await _context.Orders.FindAsync(id);

            _context.Orders.Remove(orderItem);

            await _context.SaveChangesAsync();
            return NoContent();
        }
       
	}
}
