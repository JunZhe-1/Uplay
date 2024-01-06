using AutoMapper;
using LearningAPI.Controllers;
using LearningAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LearningAPI.COntrollers
{
	[ApiController]
	[Route("[controller]")]
	public class EventController: ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly IMapper _mapper;
		private readonly ILogger<EventController> _logger;

		public EventController(MyDbContext context, IMapper mapper,
		 ILogger<EventController> logger)
		{
			_context = context;
			_mapper = mapper;
			_logger = logger;
		}

		[HttpGet]
		public IActionResult GetAll(String? search)
		{
			try
			{
				//IQueryable<Voucher> result = _context.Vouchers.Include(t => t.Voucher_Name);
				IQueryable<Event> result = _context.Events;

				if (search != null)
				{
					result = result.Where(x => x.Event_Name.Contains(search));
				}
				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when retrieve the vouchers");
				return StatusCode(500);
			}
		}




		[HttpPost("add_event")]

		public IActionResult AddEvent(Event events)
		{
			var now = DateTime.Now;
			

				try
				{
					//int userId = GetUserId();


					var myEvent = new Event()
					{
						Event_Name = events.Event_Name,
						Event_Description = events.Event_Description,
						Event_Fee_Guest = events.Event_Fee_Guest,
						Event_Fee_NTUC = events.Event_Fee_NTUC,
						Event_Fee_Uplay = events.Event_Fee_Uplay,
						Vacancies = events.Vacancies,
						ImageFile = events.ImageFile,
						CreatedAt = now,
						UpdatedAt = now,
						
					};
					_context.Events.Add(myEvent);
					_context.SaveChanges();
					return Ok(myEvent);


				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Error when adding Voucher");
					return StatusCode(500);
				}
			


		}









	}

}
