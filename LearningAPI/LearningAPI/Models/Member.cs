using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LearningAPI.Models
{
    public class Member
    {
        [Key, ForeignKey("UplayUser")]
        public int UserId { get; set; }

        [Required, StringLength(9)]
        public string NRIC { get; set; } = string.Empty;

        [Required, MinLength(2), MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime LastSubscriptionDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime ExpiredDate { get; set; }

        [JsonIgnore]
        public UplayUser UplayUser { get; set; }

    }
}
