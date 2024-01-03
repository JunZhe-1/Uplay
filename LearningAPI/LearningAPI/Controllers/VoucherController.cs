using AutoMapper;
using LearningAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LearningAPI.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class VoucherController : ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly IMapper _mapper;
		private readonly ILogger<VoucherController> _logger;

		public VoucherController(MyDbContext context, IMapper mapper,
		   ILogger<VoucherController> logger)
		{
			_context = context;
			_mapper = mapper;
			_logger = logger;
		}

		[HttpGet]
	//	[ProducesResponseType(typeof(IEnumerable<TutorialDTO>), StatusCodes.Status200OK)]
		public IActionResult GetAll(String? search)
		{
			try
			{
				//IQueryable<Voucher> result = _context.Vouchers.Include(t => t.Voucher_Name);
				IQueryable<Voucher> result = _context.Vouchers;

				if (search != null)
				{
					result = result.Where(x => x.Voucher_Name.Contains(search));
				}
				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when retrieve the vouchers");
				return StatusCode(500);
			}
		}


		[HttpPost("add")]

		public IActionResult AddVoucher(Voucher voucher)
		{
			var now = DateTime.Now;
			if (voucher.End_Date <= now && voucher.Start_Date <= voucher.End_Date)
			{

				try
				{
					//int userId = GetUserId();






					var myVoucher = new Voucher()
					{
						Voucher_Name = voucher.Voucher_Name,
						Discount_In_value = voucher.Discount_In_value,
						Discount_In_percentage = voucher.Discount_In_percentage,
						Start_Date = now,
						End_Date = now,
						member_type = voucher.member_type,
						Create_date = now,
						Discount_type = voucher.Discount_type
					};
					_context.Vouchers.Add(myVoucher);
					_context.SaveChanges();
					return Ok(myVoucher);


				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Error when adding Voucher");
					return StatusCode(500);
				}
			}
			else if (voucher.Start_Date > voucher.End_Date)
			{

				string message = "Logic Error with Start & End date";
				return BadRequest(new { message });
			}
			else
			{
				string message = "Error in adding voucher, please try again!";
				return BadRequest(new { message });
			}


		}


		private int GetUserId()
		{
			
				return Convert.ToInt32(User.Claims
					.Where(c => c.Type == ClaimTypes.NameIdentifier)
					.Select(c => c.Value).SingleOrDefault());
			
	
		}


	}
}
