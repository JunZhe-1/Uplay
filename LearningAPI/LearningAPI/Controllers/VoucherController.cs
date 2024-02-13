using AutoMapper;
using AutoMapper.Execution;
using LearningAPI.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
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

        [HttpGet("admin")]
        //	[ProducesResponseType(typeof(IEnumerable<TutorialDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAllAdmin(String? search)
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


        [HttpGet]
        //	[ProducesResponseType(typeof(IEnumerable<TutorialDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAll(String? search)
        {
            try
            {
                DateTime now = DateTime.Now;

                //IQueryable<Voucher> result = _context.Vouchers.Include(t => t.Voucher_Name);
                IQueryable<Voucher> result = _context.Vouchers;
                result = result.Where(x => x.End_Date >= now);

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


        //[HttpGet("filter")]
        ////	[ProducesResponseType(typeof(IEnumerable<TutorialDTO>), StatusCodes.Status200OK)]
        //public IActionResult GetFilter(String search)
        //{
        //	DateTime now =  DateTime.Now;
        //	try
        //	{
        //		//IQueryable<Voucher> result = _context.Vouchers.Include(t => t.Voucher_Name);
        //		IQueryable<Voucher> result = _context.Vouchers;
        //		result = result.Where(x => x.End_Date >= now);

        //		if (search != null)
        //		{
        //			if (search == "expiring")
        //			{
        //				DateTime currentDate = DateTime.Now;
        //				DayOfWeek currentDayOfWeek = currentDate.DayOfWeek;

        //				DateTime startOfWeek = currentDate.AddDays(-((int)currentDayOfWeek - (int)DayOfWeek.Sunday));
        //				DateTime endOfWeek = startOfWeek.AddDays(6);

        //				result = result.Where(x => x.End_Date >= startOfWeek && x.End_Date <= endOfWeek);
        //				return Ok(result);
        //			}
        //			else if (search == "lastest")
        //			{
        //				result = result.OrderByDescending(x => x.Create_date);
        //				return Ok(result);

        //			}
        //				else
        //			{
        //				return Ok(result);

        //			}

        //		}
        //		else
        //		{
        //			return Ok(result);

        //		}

        //	}
        //	catch (Exception ex)
        //	{
        //		_logger.LogError(ex, "Error when retrieve the vouchers");
        //		return StatusCode(500);
        //	}
        //}


        [HttpPost("add")]

        public IActionResult AddVoucher(Voucher voucher)
        {


            DateTime start = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(voucher.Start_Date, "Singapore Standard Time");
            DateTime end = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(voucher.End_Date, "Singapore Standard Time");

            DateTime now = DateTime.Now - TimeSpan.FromDays(1);


            if (string.IsNullOrEmpty(voucher.ImageFile))
            {

                string message = "image is required";
                return BadRequest(new { message });
            }
            else
            {
                string fileExtension = Path.GetExtension(voucher.ImageFile);
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

                if (!allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
                {
                    string message = "only image is allowed";
                    return BadRequest(new { message });
                }
            }



            if (voucher.Discount_In_Value == 0)
            {
                string message = "Discount must more than 0";
                return BadRequest(new { message });

            }
            //else if (voucher.Limit_Value == 0)
            //{
            //    string message = "Limit Value must be more than 0";
            //    return BadRequest(new { message });
            //}
            else
            {

                if (end >= now && start <= end)
                {

                    try
                    {
                        //int userId = GetUserId();


                        var myVoucher = new Voucher()
                        {
                            Voucher_Name = voucher.Voucher_Name,
                            Discount_In_Value = voucher.Discount_In_Value,
                            Limit_Value = voucher.Limit_Value,
                            Start_Date = start,
                            End_Date = end,
                            ImageFile = voucher.ImageFile,
                            Voucher_Description = voucher.Voucher_Description,
                            Member_Type = voucher.Member_Type,
                            Create_date = now,
                            Voucher_Status = true
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
                else if (start > end)
                {

                    string message = "End date must be set after the start date";
                    return BadRequest(new { message });
                }
                else if (end < now)
                {
                    string message = "End date must be set after today's date";
                    return BadRequest(new { message });
                }
                else
                {
                    string message = "Error in adding voucher, please try again!";
                    return BadRequest(new { message });
                }


            }
        }




        [HttpGet("getOne/{id}")]
        public IActionResult Getindividual(int id)
        {
            try
            {
                Voucher? myvoucher = _context.Vouchers.Find(id);
                if (myvoucher == null)
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

        [HttpPut("updateStatus/{id}")]
        public IActionResult UpdateVoucherStatus(int id, bool status)
        {
            try
            {

                var myvoucher = _context.Vouchers.Find(id);
                myvoucher.Voucher_Status = (!myvoucher.Voucher_Status);
                _context.SaveChanges();
                return Ok(myvoucher);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when update tutorial");
                return StatusCode(500);
            }

        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateVoucher(int id, Voucher voucher)
        {
            try
            {

                DateTime start = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(voucher.Start_Date, "Singapore Standard Time");
                DateTime end = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(voucher.End_Date, "Singapore Standard Time");

                bool check = false;


                if (voucher.ImageFile == null || voucher.ImageFile.Trim() == "")
                {

                    string message = "Image is required for voucher";
                    return BadRequest(new { message });
                }

                string fileExtension = Path.GetExtension(voucher.ImageFile);
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

                if (!allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
                {
                    string message = "only images are allowed";
                    return BadRequest(new { message });
                }


                if (voucher.Discount_In_Value == 0)
                {
                    string message = "Discount value must be more than $0";
                    return BadRequest(new { message });

                }
                else if (voucher.Limit_Value == 0)

                {
                    string message = "Minimum spending value must be more than $0";
                    return BadRequest(new { message });
                }
                else
                {
                    var myvoucher = _context.Vouchers.Find(id);

                    // if the voucher is not found, enter if statement to return NotFound()
                    if (myvoucher == null)
                    {
                        return NotFound();
                    }



                    if ((voucher.ImageFile != null || voucher.ImageFile != "") && voucher.ImageFile != myvoucher.ImageFile)
                    {
                        myvoucher.ImageFile = voucher.ImageFile;
                        check = true;

                    }


                    if (voucher.Voucher_Name != null && voucher.Voucher_Name != myvoucher.Voucher_Name)
                    {
                        myvoucher.Voucher_Name = voucher.Voucher_Name;
                        check = true;
                    }
                    if (voucher.Voucher_Description != null && voucher.Voucher_Description != myvoucher.Voucher_Description)
                    {
                        myvoucher.Voucher_Description = voucher.Voucher_Description;
                        check = true;
                    }

                    DateTime now = DateTime.Now - TimeSpan.FromDays(1);
                    if (end >= now && start <= end)
                    {
                        if (start != myvoucher.Start_Date)
                        {
                            myvoucher.Start_Date = start;
                        }
                        if (end != myvoucher.End_Date)
                        {
                            myvoucher.End_Date = end;
                        }
                        check = true;

                    }
                    else if (start > end)
                    {

                        string message = "End date must be set after the start date";
                        return BadRequest(new { message });
                    }
                    else if (end < now)
                    {
                        string message = "End date must be set after today's date";
                        return BadRequest(new { message });
                    }
                    else
                    {
                        string message = "Error in adding voucher, please try again!";
                        return BadRequest(new { message });
                    }

                    if (myvoucher.Limit_Value != voucher.Limit_Value)
                    {
                        myvoucher.Limit_Value = voucher.Limit_Value;
                    }

                    if (myvoucher.Member_Type != voucher.Member_Type)
                    {
                        myvoucher.Member_Type = voucher.Member_Type;
                        check = true;

                    }

                    if (myvoucher.Discount_In_Value != voucher.Discount_In_Value)
                    {
                        myvoucher.Discount_In_Value = voucher.Discount_In_Value;
                        check = true;

                    }
                    myvoucher.Voucher_Status = true;

                    /*   if (voucher.Discount_type == "Value")
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
					   }*/

                    if (check == false)
                    {
                        string message = "Nothing Change!";
                        return BadRequest(new { message });
                    }


                    myvoucher.Create_date = DateTime.Now;
                    _context.SaveChanges();
                    return Ok(myvoucher);


                }
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
                LearningAPI.Models.Member? member = _context.Members.Find(id);
                DateTime now = DateTime.Now - TimeSpan.FromDays(1);
                if (member == null)
                {
                    UplayUser? uplay = _context.UplayUsers.Find(id);
                    if (uplay != null)
                    {
                        IQueryable<Voucher> normal_member_voucher = _context.Vouchers.Where(x => x.Member_Type == "Guest" && x.End_Date >= now && x.Voucher_Status == true);
                        return Ok(normal_member_voucher);

                    }
                }
                else if (member.MemberStatus == "NTUC")
                {
                    IQueryable<Voucher> result1 = _context.Vouchers.Where(x => x.End_Date >= now && x.Voucher_Status == true);
                    return Ok(result1);

                }
            
                    // Uplay
                    IQueryable<Voucher> result = _context.Vouchers.Where(x => (x.Member_Type == "Guest" || x.Member_Type == member.MemberStatus )&& x.End_Date >= now && x.Voucher_Status == true);
                    return Ok(result);

                
                //IQueryable<Voucher> result = _context.Vouchers.Where(x => x.Member_Type == member.MemberStatus && x.End_Date >= now && x.Voucher_Status == true);


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
                if (myvoucher == null)
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