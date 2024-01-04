using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class RegisterRequest
    {
        [Required, EmailAddress, MaxLength(50)]
        public string EmailAddress { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(50)]
        // Regular expression to enforce password complexity
        [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$", ErrorMessage = "At least 1 letter and 1 number")]
        public string Password { get; set; } = string.Empty;

        [Required, MinLength(1), MaxLength(20)]
        public string UserName { get; set; } = string.Empty;
    }
}
