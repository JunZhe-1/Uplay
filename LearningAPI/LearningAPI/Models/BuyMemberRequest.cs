using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class BuyMemberRequest
    {

        [Required, StringLength(9)]
        public string NRIC { get; set; } = string.Empty;

        [Required, MinLength(2), MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string MemberStatus { get; set; } = string.Empty;
    }
}