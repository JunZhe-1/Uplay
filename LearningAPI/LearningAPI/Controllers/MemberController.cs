﻿using LearningAPI;
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
        private readonly ILogger<TutorialController> _logger;
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
            try
            {
                int id = GetUserId();
                var uplayuser = _context.UplayUsers.Find(id);
                var myMember = new Member()
                {
                    UserId = id,
                    NRIC = member.NRIC.Trim(),
                    Name = member.Name.Trim(),
                    LastSubscriptionDate = now,
                    ExpiredDate = now.AddYears(1),
                    UplayUser = uplayuser
                    
                };
                _context.Members.Add(myMember);
                _context.SaveChanges();
                return Ok(myMember);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when buying member");
                return StatusCode(500);
            }

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

        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }
    }
}
