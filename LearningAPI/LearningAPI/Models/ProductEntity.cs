using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LearningAPI.Models
{
	public class ProductEntity
	{
		public string? ImageFile { get; set; }
		public string? Event_Name { get; set; }
		public int? Booking_Quantity { get; set; }
		public int? Price { get; set; }
	}
}
