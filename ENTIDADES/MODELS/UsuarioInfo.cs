using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.MODELS
{
    public class UsuarioInfo
    {
        public int UsuarioID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Usuario { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Telefono { get; set; }
        public DateTime FechaRegistro { get; set; }
        public bool Activo { get; set; }
        public string ErrorCode { get; set; }
        public string Error { get; set; }
    }
}
