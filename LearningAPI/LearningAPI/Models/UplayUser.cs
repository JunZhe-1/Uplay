using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningAPI.Models
{
    public class UplayUser
    {
        [Key]
        public int UserId { get; set; }

        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        [Required,MinLength(6),MaxLength(30)]
        public string Password { get; set; } = string.Empty;

        [Required, MinLength(1), MaxLength(15)]
        public string UserName { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public List<Voucher>? Vouchers { get; set; }
    }
}
