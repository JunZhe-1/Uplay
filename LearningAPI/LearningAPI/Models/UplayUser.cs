using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class UplayUser
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress, MaxLength(50)]
        public string EmailAddress { get; set; } = string.Empty;

        [Required, MinLength(6), MaxLength(250)]
        // Regular expression to enforce password complexity
        [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$", ErrorMessage = "At least 1 letter and 1 number")]
        public string Password { get; set; } = string.Empty;

        [Required, MinLength(1), MaxLength(20)]
        public string UserName { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}