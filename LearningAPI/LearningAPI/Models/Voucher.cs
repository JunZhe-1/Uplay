using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // Import this namespace

namespace LearningAPI.Models
{
<<<<<<< Updated upstream

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
=======
	public class Voucher
	{
		// This model is for admin to create the voucher for types of member

		[Key]
		[JsonPropertyName("Voucher_ID")]
		public int Voucher_ID { get; set; }

		[MaxLength(50)]
		[JsonPropertyName("Voucher_Name")]
		public string Voucher_Name { get; set; } = string.Empty;

		[Column(TypeName = "datetime")]
		[JsonPropertyName("Start_Date")]
		public DateTime Start_Date { get; set; }

		[Column(TypeName = "datetime")]
		[JsonPropertyName("End_Date")]
		public DateTime End_Date { get; set; }

		[MaxLength(50)]
		[JsonPropertyName("Discount_type")]
		public string Discount_type { get; set; } = string.Empty;

		[JsonPropertyName("Discount_In_Percentage")]
		public int Discount_In_Percentage { get; set; } = 0;

		[JsonPropertyName("Discount_In_Value")]
		public int Discount_In_Value { get; set; } = 0;

		[Column(TypeName = "datetime")]
		[JsonPropertyName("Create_date")]
		public DateTime Create_date { get; set; }

		// Foreign key property
		// Use it for member type
		[JsonPropertyName("Member_Type")]
		public string Member_Type { get; set; } = String.Empty;

		// Other properties and relationships can be added as needed
	}
}
>>>>>>> Stashed changes
