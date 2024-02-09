using LearningAPI;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;



namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UplayUserController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        public UplayUserController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        
        [HttpGet]
        public IActionResult GetAll()
        {
            
            return Ok(_context.UplayUsers.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetMember(int id)
        {
            UplayUser? user = _context.UplayUsers.Find(id);
            return Ok(user);
        }

        [HttpPost("register")]
        public IActionResult AddUser(RegisterRequest request)
        {
            var now = DateTime.Now;
            request.EmailAddress = request.EmailAddress.Trim().ToLower();
            request.Password = request.Password.Trim();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var myUplayUser = new UplayUser()
            {
                EmailAddress = request.EmailAddress,
                UserName = request.UserName,
                Password = passwordHash,
                CreatedAt = now,
                UpdatedAt = now
            };
            // Check email
            var foundUser = _context.UplayUsers.Where(
            x => x.EmailAddress == request.EmailAddress).FirstOrDefault();
            if (foundUser != null)
            {
                string message = "Email already exists.";
                return BadRequest(new { message });
            }
            _context.UplayUsers.Add(myUplayUser);
            _context.SaveChanges();
            return Ok(myUplayUser);
        }
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            // Trim string values
            request.EmailAddress = request.EmailAddress.Trim().ToLower();
            request.Password = request.Password.Trim();
            // Check email and password
            string message = "Email or password is not correct.";
            var foundUser = _context.UplayUsers.Where(
            x => x.EmailAddress == request.EmailAddress).FirstOrDefault();
            if (foundUser == null)
            {
                return BadRequest(new { message });
            }
            bool verified = BCrypt.Net.BCrypt.Verify(
            request.Password, foundUser.Password);
            if (!verified)
            {
                return BadRequest(new { message });
            }
 
            var uplayuser = new
            { 
                foundUser.UserId,
                foundUser.EmailAddress,
                foundUser.UserName
            };
            string accessToken = CreateToken(foundUser);
            return Ok(new { uplayuser, accessToken });
        }
        [HttpPost("validatePassword")]
        public IActionResult ValidatePassword(ValidatePasswordRequest request)
        {
            var user = _context.UplayUsers.Find(request.UserId);

            if (user == null)
            {
                return NotFound();
            }

            bool verified = BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password);

            if (verified)
            {
                return Ok(new { message = "Password validated successfully" });
            }
            else
            {
                return BadRequest(new { message = "Old password is incorrect" });
            }
        }


        [HttpPut("image/{id}")]
        public IActionResult UpdateImage(int id, [FromBody] UplayUser uplayUser)
        {
            var user = _context.UplayUsers.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(uplayUser.ImageFile))
            {
                return BadRequest(new { message = "Image file name cannot be empty" });
            }

            user.ImageFile = uplayUser.ImageFile;
            user.EmailAddress = user.EmailAddress;
            user.Password = user.Password;
            user.UserName   = user.UserName;
            user.CreatedAt = user.CreatedAt;
            user.UpdatedAt = DateTime.Now;


            _context.SaveChanges();

            return Ok(user); // Return the updated user object if needed
        }


        [HttpPut("{id}")]
        public IActionResult UpdateUplayUser(int id, UpdateUplayUserRequest uplayuser)
        {
            var user = _context.UplayUsers.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            user.UserName = uplayuser.UserName;
            user.EmailAddress = uplayuser.EmailAddress.Trim();
            user.UpdatedAt = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(uplayuser.Password.Trim()))
            {
                if (uplayuser.Password.Trim().Length < 8)
                {
                    // Handle validation error for password length, if needed
                    return Ok("Set all except password");
                }
                else
                {
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(uplayuser.Password);
                    user.Password = passwordHash;
                }
            }
            if (!string.IsNullOrEmpty(uplayuser.ImageFile))
            {
                if (uplayuser.ImageFile.Trim().Length < 8)
                {
                    // Handle validation error for password length, if needed
                    return Ok("Set all except password");
                }
                else
                {
                   
                    user.ImageFile = uplayuser.ImageFile;
                }
            }
            _context.SaveChanges();

            return Ok(user);
        }




        



        [HttpGet("auth"), Authorize]
        public IActionResult Auth()
        {
            var UserId = Convert.ToInt32(User.Claims.Where(
            c => c.Type == ClaimTypes.NameIdentifier)
            .Select(c => c.Value).SingleOrDefault());
            var UserName = User.Claims.Where(c => c.Type == ClaimTypes.Name)
            .Select(c => c.Value).SingleOrDefault();
            var EmailAddress = User.Claims.Where(c => c.Type == ClaimTypes.Email)
            .Select(c => c.Value).SingleOrDefault();
            if (UserId != 0 && UserName != null && EmailAddress != null)
            {
                var user = new
                {
                    UserId,
                    EmailAddress,
                    UserName
                };
                return Ok(new { user });
            }
            else
            {
                return Unauthorized();
            }
        }

        private string CreateToken(UplayUser user)
        {
            string secret = _configuration.GetValue<string>(
            "Authentication:Secret");
            int tokenExpiresDays = _configuration.GetValue<int>(
            "Authentication:TokenExpiresDays");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Email, user.EmailAddress)
            }),
                Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
                SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(securityToken);
            return token;
        }
    }
}