using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // Import this namespace

namespace LearningAPI.Models
{

    public class Voucher
    {
        // This model is for admin to create the voucher for types of member

        [Key]
        [JsonPropertyName("Voucher_ID")]
        public int Voucher_ID { get; set; }

        [MaxLength(50)]
        [Required]
        [JsonPropertyName("Voucher_Name")]
        public string Voucher_Name { get; set; } = string.Empty;

        [MaxLength(50)]
        [Required]
        [JsonPropertyName("Voucher_Description")]
        public string Voucher_Description { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        [Required]
        [JsonPropertyName("Start_Date")]
        public DateTime Start_Date { get; set; }

        [Required]
        [Column(TypeName = "datetime")]
        [JsonPropertyName("End_Date")]
        public DateTime End_Date { get; set; }

        //[MaxLength(50)]
        //[Required]
        //[JsonPropertyName("Discount_type")]
        //public string Discount_type { get; set; } = string.Empty;


        [JsonPropertyName("Discount_In_Value")]
        public int Discount_In_Value { get; set; } = 0;

        [JsonPropertyName("Limit_Value")]
        public int Limit_Value { get; set; } = 0;


        [Column(TypeName = "datetime")]
        [JsonPropertyName("Create_date")]
        public DateTime Create_date { get; set; }



        [Required]
        [JsonPropertyName("Voucher_Status")]
        public bool Voucher_Status { get; set; } = true;


        [MaxLength(20)]

        [JsonPropertyName("ImageFile")]

        public string? ImageFile { get; set; }

        // Foreign key property
        // Use it for member type
        [JsonPropertyName("Member_Type")]
        public string Member_Type { get; set; } = String.Empty;

        // Other properties and relationships can be added as needed
    }
}
