using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningAPI.Models
{
    public class BuyMemberRequest
    {

        [Required, StringLength(4)]
        public string NRIC { get; set; } = string.Empty;

        [Required, MinLength(2), MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "date")] // Use "date" for storing only the date part
        [DataType(DataType.Date)] // Specify the data type for UI frameworks
        public DateTime DateOfBirth { get; set; }

        [Required]
        public int Years { get; set; }

        [Required]
        public string MemberStatus { get; set; } = string.Empty;
    }
}