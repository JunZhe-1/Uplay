using LearningAPI;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Relational;

namespace AssignmentAPI.Controllers
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


        [HttpPost]
        public IActionResult AddUser(Member member)
        {
            var now = DateTime.Now;
            var myMember = new Member()
            {
                NRIC = member.NRIC.Trim(),
                Name = member.Name.Trim(),
                LastSubscriptionDate = now,
                ExpiredDate = now.AddYears(1),
            };
            _context.Members.Add(myMember);
            _context.SaveChanges();
            return Ok(myMember);
        }

        [HttpPut("{id}")]

        public IActionResult UpdateMember(int id, Member member)
        {
            var mymember = _context.Members.Find(id);
            if (mymember == null)
            {
                return NotFound();
            }
            mymember.LastSubscriptionDate = DateTime.Now;
            mymember.ExpiredDate = mymember.ExpiredDate.AddYears(1);
            _context.SaveChanges();
            return Ok(mymember);

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

    }
}
