using gd98.Services;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace gd98.Controllers
{
    public class HomeController : Controller
    {
        private readonly CorreoService _correoService;

        // Inyectamos el servicio de correo
        public HomeController()
        {
            _correoService = new CorreoService(); // O puedes usar DI si es necesario
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult DesarrolloSoftware() { 

            return View();
        }

        public ActionResult DesarrolloApps()
        {

            return View();
        }
        public ActionResult DesarrolloAppsConAi() { 

            return View();
        }
        public ActionResult OutSourcing() { 

            return View();
        }
        public ActionResult Consultoria() { 

            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public  ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }

        [HttpPost]
        public JsonResult ObtenerContador()
        {
            try
            {
                int contador = 0;
                string connStr = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;

                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    using (SqlCommand cmd = new SqlCommand("mezfjnkj_admin.Consultar", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@opcion", 1);
                        cmd.Parameters.AddWithValue("@json", DBNull.Value);

                        conn.Open();
                        var result = cmd.ExecuteScalar();
                        if (result != null)
                            contador = Convert.ToInt32(result);
                    }
                }

                return Json(new { success = true, valor = contador });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        public JsonResult GetPlaylist()
        {
            var musicPath = Server.MapPath("~/Content/Musica/");
            var audioFiles = new List<string>();

            if (Directory.Exists(musicPath))
            {
                audioFiles = Directory.GetFiles(musicPath, "*.mp*") // Matches .mp3 and .mp4
                                     .Where(f => f.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) ||
                                                 f.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase))
                                     .Select(f => "~/Content/Musica/" + Path.GetFileName(f))
                                     .ToList();
            }

            return Json(audioFiles, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public async Task<ActionResult> EnviarFormulario(FormCollection form, HttpPostedFileBase archivo)
        {
            try
            {
                var nombre = form["nombre"];
                var web = form["web"];
                var pais = form["pais"];
                var telefono = form["telefono"];
                var email = form["email"];
                var servicio = form["servicio"];
                var plazo = form["plazo"];
                var mensaje = form["mensaje"];
                var asunto = form["asunto"]; // Nuevo campo

                var cuerpoCorreo = $@"
        <html>
            <body>
                <p><strong>Nombre:</strong> {nombre}</p>
                <p><strong>Web:</strong> {web}</p>
                <p><strong>Pais:</strong> {pais}</p>
                <p><strong>Teléfono:</strong> {telefono}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Servicio:</strong> {servicio}</p>
                <p><strong>Plazo:</strong> {plazo}</p>
                <p><strong>Mensaje:</strong><br />{mensaje}</p>
            </body>
        </html>";

                var mensajeCorreo = new IdentityMessage
                {
                    Destination = "bolitto@gmail.com", // O quien tú desees
                    Subject = asunto, // Usa el campo asunto del formulario
                    Body = cuerpoCorreo
                };

                EmailService correoService = new EmailService();
                await correoService.SendAsync(mensajeCorreo);

                return Json(new { success = true, message = "Formulario enviado exitosamente" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Hubo un error: " + ex.Message });
            }
        }

    }
}