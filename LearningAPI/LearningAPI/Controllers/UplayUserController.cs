using LearningAPI;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
        
        [HttpGet]
        public IActionResult GetAll()
        {
            
            return Ok(_context.UplayUsers.ToList());
        }
        [HttpPost]
        public IActionResult AddUser(UplayUser user)
        {
            var now = DateTime.Now;
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            var myUplayUser = new UplayUser()
            {
                EmailAddress = user.EmailAddress.Trim(),
                UserName = user.UserName.Trim(),
                Password = passwordHash,
                CreatedAt = now,
                UpdatedAt = now
            };
            // Check email
            var foundUser = _context.UplayUsers.Where(
            x => x.EmailAddress == user.EmailAddress).FirstOrDefault();
            if (foundUser != null)
            {
                string message = "Email already exists.";
                return BadRequest(new { message });
            }
            _context.UplayUsers.Add(myUplayUser);
            _context.SaveChanges();
            return Ok(myUplayUser);
        }

    }
}