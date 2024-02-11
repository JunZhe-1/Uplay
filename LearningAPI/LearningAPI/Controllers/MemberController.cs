using LearningAPI;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Relational;
using System.Security.Claims;


namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MemberController : Controller
    {
        private readonly MyDbContext _context;
        public MemberController(MyDbContext context)
        {
            _context = context;
        }
        

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Members.ToList());
        }
        [HttpGet("{id}")]
        public IActionResult GetMember(int id)
        {
            Member? member = _context.Members.Find(id);
            return Ok(member);
        }

        [HttpPost("{id}")]
        public IActionResult SetAsMember(int id)
        {


            var now = DateTime.Now;
            try
            {
                var myMember = new Member()
                {
                    UserId = id,
                    NRIC = "000A",
                    Name = "Wait For Reset",
                    DateOfBirth = now.Date,
                    MemberStatus = "NTUC",
                    LastSubscriptionDate = now,
                    ExpiredDate = now.AddYears(1),
                    Year = 1
                };

                _context.Members.Add(myMember);
                _context.SaveChanges();
                return Ok(myMember);
            }
            catch (Exception ex) {
                Console.WriteLine(ex.ToString());
                return StatusCode(500);
            }
            
        }


    

    [HttpPost]
        public IActionResult AddUser(BuyMemberRequest member)
        {
            var now = DateTime.Now;


            try
            {
                int id = GetUserId();
                var myMember = new Member()
                {
                    UserId = id,
                    NRIC = member.NRIC.Trim(),
                    Name = member.Name.Trim(),
                    DateOfBirth = member.DateOfBirth,
                    MemberStatus = member.MemberStatus.Trim(),
                    LastSubscriptionDate = now,
                    ExpiredDate = now.AddYears(member.Years),
                    Year = member.Years
                    
                };
                _context.Members.Add(myMember);
                _context.SaveChanges();
                return Ok(myMember);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500);
            }

        }

       

    [HttpPut]

        public IActionResult UpdateMember(int points)
        {
            try
            {
                int id = GetUserId();
                var mymember = _context.Members.Find(id);
            
            if (mymember == null)
            {
                return NotFound();
            }
            mymember.LastSubscriptionDate = DateTime.Now;
            mymember.ExpiredDate = mymember.ExpiredDate.AddYears(1);
                if (mymember.Points == null)
                {
                    mymember.Points = points;
                }
                else
                {
                    mymember.Points = points+mymember.Points;
                }
            _context.SaveChanges();
            return Ok(mymember);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500);
            }
        }
        [HttpPut("Set/{id}")]

        public IActionResult UpdateMemberAdmin(int id)
        {
            try { 
            var mymember = _context.Members.Find(id);

            
            mymember.LastSubscriptionDate = DateTime.Now;
            mymember.MemberStatus = "NTUC";
            mymember.ExpiredDate = mymember.ExpiredDate.AddYears(1);
            _context.SaveChanges();
            return Ok(mymember);
            }catch (Exception ex) {
                Console.WriteLine(ex.ToString());
                return StatusCode(500);
            }

        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMember(int id)
        {

            var member = _context.Members.Find(id);
            if (member == null)
            {
                return NotFound();
            }

            if (member.ExpiredDate >= DateTime.Now)
            {
                return BadRequest("Membership has not expired yet.");
            }
            else
            {
                _context.Members.Remove(member);
                _context.SaveChanges();
                return Ok();

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
