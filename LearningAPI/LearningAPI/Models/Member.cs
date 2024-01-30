using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace LearningAPI.Models
{
    public class Member
    {
        [Key, ForeignKey("UplayUser")]
        public int UserId { get; set; }

        [Required, StringLength(4)]
        public string NRIC { get; set; } = string.Empty;

        [Required, MinLength(2), MaxLength(50)]
        public string Name { get; set; } = string.Empty;


        [Required]
        [Column(TypeName = "date")] // Use "date" for storing only the date part
        [DataType(DataType.Date)] // Specify the data type for UI frameworks
        public DateTime DateOfBirth { get; set; }


        [Required]
        // either NTUC or Uplay member
        public string MemberStatus { get; set; } = string.Empty;


        [Column(TypeName = "datetime")]
        public DateTime LastSubscriptionDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime ExpiredDate { get; set; }

        

        [JsonIgnore]
        public UplayUser UplayUser { get; set; }

    }
}
