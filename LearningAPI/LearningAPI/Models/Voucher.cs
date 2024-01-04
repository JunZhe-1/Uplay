using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LearningAPI.Models
{

    public class Voucher
    {
        // this model is for admin to create the voucher for types of member
        [Key]
        public int Voucher_ID { get; set; }

        [MaxLength(50)]
        public string Voucher_Name { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime Start_Date { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime End_Date { get; set; }


        [MaxLength(50)]
        public string Discount_type { get; set; } = string.Empty;


        public int Discount_In_percentage { get; set; } = 0;



        public int Discount_In_value { get; set; } = 0;

        [Column(TypeName = "datetime")]
        public DateTime Create_date { get; set; }




        // Foreign key property
        // use it for member type
        public string member_type { get; set; } = String.Empty;

        //public User? User { get; set; }	
    }
}