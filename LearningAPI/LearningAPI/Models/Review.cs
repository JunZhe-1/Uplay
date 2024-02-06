using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // Import this namespace

namespace LearningAPI.Models
{
    public class Review
    {
        [Key]
        [JsonPropertyName("Review_ID")]
        public int Review_ID { get; set; }

        [Required]
        [JsonPropertyName("Event_Review")]
        public string Event_Review { get; set; } = string.Empty;

        [ Required]
        [JsonPropertyName("Rating")]
        public int Rating { get; set; }


        [JsonPropertyName("Event_ID")]
        public int Event_ID { get; set; }


        [JsonPropertyName("User_ID")]
        public int User_ID { get; set; }
    }
}
