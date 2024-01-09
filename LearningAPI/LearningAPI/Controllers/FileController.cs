using LearningAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NanoidDotNet;

namespace LearningAPI.Controllers
{
	[Route("[controller]")]
	[ApiController]
	public class FileController : ControllerBase
	{
		private readonly IWebHostEnvironment _environment;
		private readonly ILogger<FileController> _logger;

		public FileController(IWebHostEnvironment environment,
			ILogger<FileController> logger)
		{
			_environment = environment;
			_logger = logger;
		}

		//  [HttpPost("upload"), Authorize]
		// [ProducesResponseType(typeof(UploadResponse), StatusCodes.Status200OK)]

		[HttpPost("upload")]
		public IActionResult Upload(IFormFile file)
		{
			try
			{
				if (file.Length > 1024 * 1024)
				{
					var message = "Maximum file size is 1MB";
					return BadRequest(new { message });
				}

				// Check if the file has a valid image extension
				if (!IsImageWithValidExtension(file))
				{
					var message = "only Image is allowed";
					return BadRequest(new { message });
				}

				var id = Nanoid.Generate(size: 10);
				var filename = id + Path.GetExtension(file.FileName);
				var imagePath = Path.Combine(_environment.ContentRootPath, @"wwwroot/uploads", filename);
				using var fileStream = new FileStream(imagePath, FileMode.Create);
				file.CopyTo(fileStream);
				UploadResponse response = new() { Filename = filename };
				return Ok(response);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when uploading file");
				return StatusCode(500);
			}
		}

		private bool IsImageWithValidExtension(IFormFile file)
		{
			var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };

			var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
			return allowedExtensions.Contains(fileExtension);
		}
	}
}