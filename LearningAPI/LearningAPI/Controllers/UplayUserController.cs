using LearningAPI;
using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using GoogleReCaptcha.V3;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Text.Json;


namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UplayUserController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient; // Inject HttpClient

        private static readonly HashSet<string> _processedTokens = new HashSet<string>();
        public UplayUserController(MyDbContext context, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = httpClient; // Assign the injected HttpClient

            _httpClient.Timeout = TimeSpan.FromSeconds(15); // 15 seconds timeout
        }

        // Your other controller actions...

        private async Task<bool> VerifyRecaptchaToken(string token)
        {
            var secretKey = "6LdMGV8pAAAAAL3gcsIM5YrOFq4ERQvJKpcCpAoJ";
            var verificationUrl = $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}";

            try
            {
                var response = await _httpClient.PostAsync(verificationUrl, null);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync();
                var captchaResponse = JsonSerializer.Deserialize<ReCaptchaResponse>(responseBody); // Deserialize the response

                // Log the reCAPTCHA response
                Console.WriteLine($"reCAPTCHA Response: {responseBody}");

                return captchaResponse.Success;
            }
            catch (HttpRequestException ex)
            {
                // Handle timeout exception
                // Log the exception or return an appropriate error response
                Console.WriteLine($"Error while verifying reCAPTCHA token: {ex.Message}");
                return false;
            }
        }


        public class ReCaptchaResponse
        {
            public bool Success { get; set; }
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
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var recaptchaToken = request.RecaptchaToken;

            // Check for duplicate request
            lock (_processedTokens)
            {
                if (_processedTokens.Contains(recaptchaToken))
                {
                    return BadRequest(new { message = "Duplicate request detected." });
                }
                _processedTokens.Add(recaptchaToken);
            }

            // Verify reCAPTCHA token
            var isCaptchaPassed = await VerifyRecaptchaToken(recaptchaToken);

            

            // Reset processed token to prevent memory leak
            lock (_processedTokens)
            {
                _processedTokens.Remove(recaptchaToken);
            }

            request.EmailAddress = request.EmailAddress.Trim().ToLower();
            request.Password = request.Password.Trim();

            // Check email and password
            string message = "Email or password is not correct.";
            var foundUser = _context.UplayUsers.FirstOrDefault(x => x.EmailAddress == request.EmailAddress);

            if (foundUser == null || !BCrypt.Net.BCrypt.Verify(request.Password, foundUser.Password))
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

            // Return user data and access token
            return Ok(new { user = uplayuser, accessToken });
        }


        private string CreateToken(Claim[] userClaims)
        {
            string secret = _configuration.GetValue<string>("Authentication:Secret");
            int tokenExpiresDays = _configuration.GetValue<int>("Authentication:TokenExpiresDays");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(userClaims),
                Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
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
        public IActionResult UpdateImage(int id, [FromBody] string ImageFileName)
        {
            var user = _context.UplayUsers.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(ImageFileName))
            {
                return BadRequest(new { message = "Image file name cannot be empty" });
            }

            user.ImageFile = ImageFileName;
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