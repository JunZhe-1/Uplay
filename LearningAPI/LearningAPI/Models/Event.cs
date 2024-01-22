using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json.Serialization; // Import this namespace


namespace LearningAPI.Models
{
    public class Event
    {
        [Key]
        [JsonPropertyName("Event_ID")]

        public int Event_ID { get; set; }

        [Required, MaxLength(50)]
        [JsonPropertyName("Event_Name")]
        public string Event_Name { get; set; } = string.Empty;



        [Required, MaxLength(600)]
        [JsonPropertyName("Event_Description")]
        public string Event_Description { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [JsonPropertyName("Event_Category")]
        public string Event_Category { get; set; } = string.Empty;

        [Required, MaxLength(300)]
        [JsonPropertyName("Event_Location")]
        public string Event_Location { get; set; } = string.Empty;


        [Range(0, 1000), Required]
        [JsonPropertyName("Event_Fee_Guest")]
        public int Event_Fee_Guest { get; set; }

        [Range(0, 1000), Required]
        [JsonPropertyName("Event_Fee_Uplay")]
        public int Event_Fee_Uplay { get; set; }

        [Range(0, 1000), Required]
        [JsonPropertyName("Event_Fee_NTUC")]
        public int Event_Fee_NTUC { get; set; }


        [Range(0, 10000), Required]
        [JsonPropertyName("Vacancies")]
        public int Vacancies { get; set; }




        [MaxLength(20)]

        public string? ImageFile { get; set; }



        [Column(TypeName = "datetime")]
        [JsonPropertyName("Event_Launching_Date")]
        public DateTime Event_Launching_Date { get; set; }



        [Column(TypeName = "datetime")]
        [JsonPropertyName("CreatedAt")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        [JsonPropertyName("UpdatedAt")]
        public DateTime UpdatedAt { get; set; }



    }
}
