using AssignmentAPI.Models;
using Microsoft.AspNetCore.Mvc;
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
        private static readonly List<Member> list = new();

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(list);
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
            mymember.ExpiredDate = member.ExpiredDate.AddYears(1);
            _context.SaveChanges();
            return Ok(mymember);

        }

    }
}
