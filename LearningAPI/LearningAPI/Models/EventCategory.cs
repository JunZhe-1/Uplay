using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace LearningAPI.Models
{
	public class EventCategory
	{

		// cateogory entity
		[Key]
		public int Category_ID { get; set; }


		[Required, MaxLength(50)]
		public string CategoryName { get; set; }


		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }



	}
}
