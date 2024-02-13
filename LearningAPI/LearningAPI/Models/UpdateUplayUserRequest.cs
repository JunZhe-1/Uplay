using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class UpdateUplayUserRequest
    {
        [Required, EmailAddress, MaxLength(50)]
        public string EmailAddress { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        [Required, MinLength(1), MaxLength(20)]
        public string UserName { get; set; } = string.Empty;

        public string? ImageFile { get; set; }
    }
}
