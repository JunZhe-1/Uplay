using AssignmentAPI.Models;
using Microsoft.AspNetCore.Mvc;
namespace AssignmentAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UplayUserController : ControllerBase
    {
        private readonly MyDbContext _context;
        public UplayUserController(MyDbContext context)
        {
            _context = context;
        }
        private static readonly List<UplayUser> list = new();
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(list);
        }
        [HttpPost]
        public IActionResult AddUser(UplayUser user)
        {
            var now = DateTime.Now;
            var myUplayUser = new UplayUser()
            {
                EmailAddress = user.EmailAddress.Trim(),
                UserName = user.UserName.Trim(),
                Password = user.Password.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };
            _context.UplayUsers.Add(myUplayUser);
            _context.SaveChanges();
            return Ok(myUplayUser);
        }

    }
}
