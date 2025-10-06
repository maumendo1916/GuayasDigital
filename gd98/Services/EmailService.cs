using Microsoft.AspNet.Identity;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System;
using System.Configuration;
using System.Threading.Tasks;

namespace gd98.Services
{
    public class EmailService
    {
        public async Task SendAsync(IdentityMessage message)
        {
            try
            {
                string emailUser = ConfigurationManager.AppSettings["EmailUser"];           // info@guayasdigital.com
                string emailPassword = ConfigurationManager.AppSettings["EmailPassword"];   // Santarosa.1
                string serverEmail = ConfigurationManager.AppSettings["ServerEmail"];       // guayasdigital.com

                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress("Guayas Digital", emailUser));
                mimeMessage.To.Add(new MailboxAddress("Destino", message.Destination));
                mimeMessage.Subject = message.Subject;

                mimeMessage.Body = new TextPart("html")
                {
                    Text = message.Body
                };

                using (var client = new SmtpClient())
                {
                    // Ignorar la validación del certificado SSL
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    await client.ConnectAsync(serverEmail, 465, SecureSocketOptions.SslOnConnect);
                    await client.AuthenticateAsync(emailUser, emailPassword);
                    await client.SendAsync(mimeMessage);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al enviar correo con MailKit: " + ex.Message, ex);
            }
        }
    }
}
