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
            if (voucher.End_Date >= now && voucher.Start_Date <= voucher.End_Date)
            {

                try
                {
                    //int userId = GetUserId();


					var myVoucher = new Voucher()
					{
						Voucher_Name = voucher.Voucher_Name,
						Discount_In_Value = voucher.Discount_In_Value,
						Discount_In_Percentage = voucher.Discount_In_Percentage,
						Start_Date = voucher.Start_Date,
						End_Date = voucher.End_Date,
						Member_Type = voucher.Member_Type,
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
			else if( voucher.End_Date < now)
			{
				string message = "End Date must set after todat's date";
				return BadRequest(new { message });
			}
			else
			{
				string message = "Error in adding voucher, please try again!";
				return BadRequest(new { message });
			}


        }

		[HttpGet("getOne/{id}")]
		public IActionResult Getindividual(int id)
		{
			try
			{
				Voucher? myvoucher = _context.Vouchers.Find(id);
				if( myvoucher == null)
				{
					return NotFound();
				}
				return Ok(myvoucher);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when get voucher by id");
				return StatusCode(500);
			}
		}

		[HttpPut("update/{id}")]
		public IActionResult UpdateVoucher(int id, Voucher voucher)
		{
			try
			{
				bool check = false;


				var myvoucher = _context.Vouchers.Find(id);

				// if the voucher is not found, enter if statement to return NotFounf()
				if (myvoucher == null)
				{
					return NotFound();
				}


				if(voucher.Voucher_Name != null && voucher.Voucher_Name != myvoucher.Voucher_Name)
				{
					myvoucher.Voucher_Name = voucher.Voucher_Name;
					check = true;
				}

				var now = DateTime.Now;
				if (voucher.End_Date >= now && voucher.Start_Date <= voucher.End_Date)
				{
					if (voucher.Start_Date != myvoucher.Start_Date)
					{
						myvoucher.Start_Date = voucher.Start_Date;
					}
					if (voucher.End_Date != myvoucher.End_Date)
					{
						myvoucher.End_Date = voucher.End_Date;
					}
					check = true;

				}
				else if (voucher.Start_Date > voucher.End_Date)
				{

					string message = "Logic Error with Start & End date";
					return BadRequest(new { message });
				}
				else if (voucher.End_Date < now)
				{
					string message = "End Date must set after todat's date";
					return BadRequest(new { message });
				}
				else
				{
					string message = "Error in adding voucher, please try again!";
					return BadRequest(new { message });
				}
				myvoucher.Discount_type = voucher.Discount_type;
				if(myvoucher.Member_Type != voucher.Member_Type)
				{
					myvoucher.Member_Type = voucher.Member_Type;
					check = true;

				}

				if (voucher.Discount_type == "Value")
				{
					if (voucher.Discount_In_Value != myvoucher.Discount_In_Value && voucher.Discount_In_Value != 0)
					{
						myvoucher.Discount_In_Value = voucher.Discount_In_Value;
						myvoucher.Discount_In_Percentage = 0;					
						check = true;

					}
				}
				else if (voucher.Discount_type == "Percentage")
				{
					if (voucher.Discount_In_Percentage != myvoucher.Discount_In_Percentage && voucher.Discount_In_Percentage != 0)
					{
						myvoucher.Discount_In_Percentage = voucher.Discount_In_Percentage;
						myvoucher.Discount_In_Value = 0;
						check = true;
					}
				}

				if(check == false)
				{
					string message = "Nothing Change!";
					return BadRequest(new { message });
				}
				
				
				myvoucher.Create_date = DateTime.Now;
				_context.SaveChanges();
				return Ok(myvoucher);


			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when update tutorial");
				return StatusCode(500);
			}
		}


		[HttpGet("uservoucher/{id}")]
		public IActionResult GetVoucherUser(int id)
		{
			try
			{
				// search the user
				int userId = GetUserId();
				User? user = _context.Users.Find(userId);
				if (user == null)
				{
					return NotFound();
				}
				// check the type of member
				return NotFound();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when delete tutorial");
				return StatusCode(500);
			}




		}


		[HttpDelete("delete/{id}")]
		public IActionResult DeleteVoucher(int id)
		{
			try
			{
				// get the voucher by using id
				var myvoucher = _context.Vouchers.Find(id);

				// if the voucher is not found, enter if statement to return NotFounf()
				if(myvoucher == null)
				{
					return NotFound();
				}

				// if the voucher is found then remove and save the context
				// return ok after the process.
				_context.Vouchers.Remove(myvoucher);
				_context.SaveChanges();
				return Ok();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when delete tutorial");
				return StatusCode(500);
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