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
				//IQueryable<Event> result = _context.Events.Include(t => t.Event_Name);
				IQueryable<Event> result = _context.Events;

				if (search != null)
				{
					result = result.Where(x => x.Event_Name.Contains(search));
				}
				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when retrieve the Events");
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
					_logger.LogError(ex, "Error when adding Event");
					return StatusCode(500);
				}
			


		}



		[HttpGet("getOne/{id}")]
		public IActionResult Getindividual(int id)
		{
			try
			{
				Event? myvoucher = _context.Events.Find(id);
				if (myvoucher == null)
				{
					return NotFound();
				}
				return Ok(myvoucher);

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when get voucher by id");
				return StatusCode(500);
			}
		}


		[HttpPut("update/{id}")]
		public IActionResult UpdateEvent(int id, Event Event)
		{
			try
			{
				bool check = false;


				var myevent = _context.Events.Find(id);

				// if the Event is not found, enter if statement to return NotFounf()
				if (myevent == null)
				{
					return NotFound();
				}


				if (Event.Event_Name != null && Event.Event_Name != myevent.Event_Name)
				{
					myevent.Event_Name = Event.Event_Name;
				}

				var now = DateTime.Now;
				if(Event.Event_Fee_Guest != myevent.Event_Fee_Guest)
				{
					myevent.Event_Fee_Guest = Event.Event_Fee_Guest;
				}

				if(Event.Event_Fee_NTUC != myevent.Event_Fee_NTUC)
				{
					myevent.Event_Fee_Uplay = Event.Event_Fee_NTUC;
				}
				if(Event.Event_Fee_NTUC != myevent.Event_Fee_NTUC)
				{
					myevent.Event_Fee_NTUC = Event.Event_Fee_NTUC;
				}

				if(Event.Event_Description != myevent.Event_Description)
				{
					myevent.Event_Description = Event.Event_Description;
				}

				if(Event.Vacancies != myevent.Vacancies) {
					myevent.Vacancies = Event.Vacancies;
						}
				Event.UpdatedAt = now;


				myevent.CreatedAt = DateTime.Now;

				_context.SaveChanges();
				return Ok(myevent);


			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when update tutorial");
				return StatusCode(500);
			}
		}







		[HttpDelete("delete/{id}")]
		public IActionResult DeleteEvents(int id)
		{
			try
			{
				var myEvent = _context.Events.Find(id);

				if (myEvent == null)
				{
					return NotFound();
				}

				_context.Events.Remove(myEvent);
				_context.SaveChanges();
				return Ok();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error when delete tutorial");
				return StatusCode(500);
			}
		}
















	}

}
