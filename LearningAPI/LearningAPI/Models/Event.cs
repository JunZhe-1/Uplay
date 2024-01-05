using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


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

		[Required, MaxLength(300)]
		[JsonPropertyName("Event_Description")]
		public string Event_Description { get; set; } = string.Empty;

		[Range(0,1000), Required]
		[JsonPropertyName("Event_Fee")]
		public int Event_Fee { get; set;}


		[Range(0,10000), Required]
		[JsonPropertyName("Vacancies")]
		public int Vacancies { get; set;}


		[Column(TypeName = "datetime")]
		[JsonPropertyName("CreatedAt")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		[JsonPropertyName("UpdatedAt")]

		public DateTime UpdatedAt { get; set; }

		// foreign key
		[JsonPropertyName("Category_ID")]
		public int Category_ID { get; set; }

	}
}
