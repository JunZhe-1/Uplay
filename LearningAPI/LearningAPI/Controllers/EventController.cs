﻿using AutoMapper;
using LearningAPI.Controllers;
using LearningAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MySqlX.XDevAPI.Relational;
using System.Diagnostics.Tracing;
using System.Security.Claims;
using System.Security.Cryptography;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
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




        [HttpPost("add_event")]

        public IActionResult AddEvent(Event events)
        {


            try
            {
                //int userId = GetUserId();

                DateTime event_date = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(events.Event_Launching_Date, "Singapore Standard Time");
                DateTime now = DateTime.Now - TimeSpan.FromDays(1);

                if (event_date < now)
                {
                    string message = "Event's date must be today onward.";
                    return BadRequest(new { message });
                }
                if (events.ImageFile == null || events.ImageFile.Trim() == "")
                {

                    string message = "Image is required for voucher";
                    return BadRequest(new { message });
                }




                string fileExtension = Path.GetExtension(events.ImageFile);
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

                if (!allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
                {
                    string message = "only image is allowedf";
                    return BadRequest(new { message });
                }


                var myEvent = new Event()
                {
                    Event_Name = events.Event_Name,
                    Event_Description = events.Event_Description,
                    Event_Fee_Guest = events.Event_Fee_Guest,
                    Event_Fee_NTUC = events.Event_Fee_NTUC,
                    Event_Fee_Uplay = events.Event_Fee_Uplay,
                    Event_Location = events.Event_Location,
                    Event_Category = events.Event_Category,
                    Vacancies = events.Vacancies,
                    ImageFile = events.ImageFile,
                    CreatedAt = now,
                    UpdatedAt = now,
                    Event_Launching_Date = event_date,
                    Event_Status = true

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





        //[HttpGet("getone/{id}")]
        //public IActionResult getEventClient(int id)
        //{

        //	try
        //	{
        //		Event? myevent = _context.Events.Find(id);
        //		if(myevent == null)
        //		{
        //			return NotFound();
        //		}
        //		return Ok(myevent);
        //	}

        //	catch (Exception ex)
        //	{
        //		_logger.LogError(ex, "Error when get voucher by id");
        //		return StatusCode(500);
        //	}

        //}


        [HttpGet("getEvent/{id}")]
        public IActionResult Getindividual(int id)
        {
            try
            {
                Event? myevent = _context.Events.Find(id);
                if (myevent == null)
                {
                    return NotFound();
                }
                return Ok(myevent);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get event by id");
                return StatusCode(500);
            }
        }


        [HttpPut("updateStatus/{id}")]
        public IActionResult UpdateEventStatus(int id, bool status)
        {
            try
            {
              
                var myevent = _context.Events.Find(id);
                myevent.Event_Status = (!myevent.Event_Status);
                _context.SaveChanges();
                return Ok(myevent);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when update tutorial");
                return StatusCode(500);
            }

        }

        [HttpGet("getreview/{id}")]
        public IActionResult GetReview(int id)
        {
            IQueryable<Review> result = _context.Reviews.Where(x => x.Event_ID == id);

            var finalResult = result.Select(x => new
            {
                x.Review_ID,
                x.Rating,
                x.Event_ID,
                x.Event_Review,
                Name = _context.UplayUsers
                            .Where(y => y.UserId == x.User_ID)
                            .Select(y => y.UserName)
                            .FirstOrDefault()
            });

            return Ok(finalResult);
        }



        [HttpPost("review")]
        public IActionResult AddReview( Review review)
        {

          
            LearningAPI.Models.Member? member = _context.Members.Find(review.User_ID);
            if (member == null)
            {
                if (_context.UplayUsers.Find(review.User_ID) == null)
                {
                    string message = "Please Login Again";
                    return BadRequest(new { message });

                }
            }

            if (review.Event_Review == "" || review.Event_Review == null)
            {
                string message = "Reciew can't be ";
                return BadRequest(new { message });

            }
            var myreview = new Review()
            {
                Event_Review = review.Event_Review,
                Rating = review.Rating,
                User_ID = review.User_ID,
                Event_ID = review.Event_ID,
            };

            _context.Reviews.Add(myreview);
            _context.SaveChanges();
            return Ok(myreview);
        }



        [HttpPut("update/{id}")]
        public IActionResult UpdateEvent(int id, Event Event)
        {
            try
            {



                string fileExtension = Path.GetExtension(Event.ImageFile);
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
                DateTime event_date = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Event.Event_Launching_Date, "Singapore Standard Time");
                DateTime now = DateTime.Now - TimeSpan.FromDays(1);

                if (event_date < now)
                {
                    string message = "Event's date must be today onward.";
                    return BadRequest(new { message });
                }

                if (!allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
                {
                    string message = "only image is allowedf";
                    return BadRequest(new { message });
                }

                var myevent = _context.Events.Find(id);

                // if the Event is not found, enter if statement to return NotFounf()
                if (myevent == null)
                {
                    return NotFound();
                }

                if (myevent.ImageFile == null || Event.ImageFile.Trim() == "")
                {

                    string message = "Image is required for voucher";
                    return BadRequest(new { message });
                }
                else
                {
                    myevent.ImageFile = Event.ImageFile.Trim();
                }


                if (Event.Event_Name != null && Event.Event_Name != myevent.Event_Name)
                {
                    myevent.Event_Name = Event.Event_Name;
                }
                if (Event.Event_Location != null && Event.Event_Location.Trim() != myevent.Event_Location)
                {
                    myevent.Event_Location = Event.Event_Location;
                }
                if (Event.Event_Category != null && Event.Event_Category != myevent.Event_Category)
                {
                    myevent.Event_Category = Event.Event_Category;
                }

                if (Event.Event_Launching_Date != myevent.Event_Launching_Date)
                {
                    myevent.Event_Launching_Date = event_date;
                }

                //var now = DateTime.Now;
                if (Event.Event_Fee_Guest != myevent.Event_Fee_Guest)
                {
                    myevent.Event_Fee_Guest = Event.Event_Fee_Guest;
                }
                myevent.Event_Status = true;

                if (Event.Event_Fee_NTUC != myevent.Event_Fee_NTUC)
                {
                    myevent.Event_Fee_NTUC = Event.Event_Fee_NTUC;
                }
                if (Event.Event_Fee_Uplay != myevent.Event_Fee_Uplay)
                {
                    myevent.Event_Fee_Uplay = Event.Event_Fee_Uplay;
                }

                if (Event.Event_Description.Trim() != myevent.Event_Description)
                {
                    myevent.Event_Description = Event.Event_Description;
                }

                if (Event.Vacancies != myevent.Vacancies)
                {
                    myevent.Vacancies = Event.Vacancies;
                }
                //Event.UpdatedAt = now;


                myevent.UpdatedAt = DateTime.Now;

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


        // get event and show in the home page

        [HttpGet]
        public IActionResult GetAll(String? search)
        {
            try
            {
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

        // when user click an event, enter the page and show the event in detail

        [HttpGet("Event/{id}")]
        public IActionResult GetAll(int? id)
        {
            try
            {
                Event? result = _context.Events.Find(id);

                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when retrieve the Events");
                return StatusCode(500);
            }
        }




















    }

}