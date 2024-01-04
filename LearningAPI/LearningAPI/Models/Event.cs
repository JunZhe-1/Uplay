using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace LearningAPI.Models
{
	public class Event
	{
		[Key]
		public int Event_ID { get; set; }

		[Required, MaxLength(50)]
		public string Event_Name { get; set; } = string.Empty;

		[Required, MaxLength(300)]
		public string Event_Description { get; set; } = string.Empty;

		[Range(0,1000), Required]
		public int Event_Fee { get; set;}


		[Range(0,10000), Required]
		public int Vacancies { get; set;}


		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }

		// foreign key
		public int Category_ID { get; set; }

	}
}
