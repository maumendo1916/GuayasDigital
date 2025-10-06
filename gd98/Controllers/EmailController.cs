using gd98.Services;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;

namespace gd98.Controllers
{
    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }

    public class EmailController : ApiController
    {
        [System.Web.Mvc.HttpPost]
        [System.Web.Mvc.Route("SendEmail")]
        public async Task<IHttpActionResult> SendEmail(EmailRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.To) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
            {
                return BadRequest("All fields are required.");
            }

            try
            {
                var emailService = new EmailService();
                var identityMessage = new IdentityMessage
                {
                    Destination = request.To,
                    Subject = request.Subject,
                    Body = request.Body
                };

                await emailService.SendAsync(identityMessage);
                return Ok("Email sent successfully!");
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                return InternalServerError(ex);
            }
        }
    }
}
