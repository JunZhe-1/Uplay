using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LearningAPI.Models
{
	public class CartUser
	{
		[Key]
		[JsonPropertyName("Cart_ID")]
		public int Cart_ID { get; set; }

		[Column(TypeName = "datetime")]
		[Required]
		[JsonPropertyName("Booking_Date")]
		public DateTime Booking_Date { get; set; }

		[Required]
		[JsonPropertyName("Booking_Quantity")]
		public int Booking_Quantity { get; set; } = 0;

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }
	}
}
