using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace gd98.Services
{
    public class CorreoService
    {
        public async Task SendAsync(IdentityMessage message)
        {
            try
            {
                // Obtener usuario y contraseña del archivo de configuración
                string emailUser = ConfigurationManager.AppSettings["EmailUser"];
                string emailPassword = ConfigurationManager.AppSettings["EmailPassword"];

                // Configuración del cliente SMTP
                using (SmtpClient client = new SmtpClient("smtp.office365.com", 587))
                {
                    client.EnableSsl = true;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(emailUser, emailPassword);

                    // Crear el mensaje de correo
                    MailMessage mailMessage = new MailMessage(emailUser, message.Destination, message.Subject, message.Body)
                    {
                        IsBodyHtml = true // Asumimos que el cuerpo es HTML
                    };

                    // Enviar el correo de manera asíncrona
                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Loguear el error (asegúrate de usar un framework de logging adecuado)
                throw new Exception("Error sending email", ex);
            }
        }
    }
}