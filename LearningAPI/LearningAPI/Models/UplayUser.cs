using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LearningAPI.Models
{
    public class UplayUser
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress, MaxLength(50)]
        public string EmailAddress { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(250),JsonIgnore]
        public string Password { get; set; } = string.Empty;

        [Required, MinLength(1), MaxLength(20)]
        public string UserName { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public Member? Member { get; set; }

    }
}