using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace gd98.Models
{
    [Table("visitas", Schema = "mezfjnkj_admin")]
    public class Visita
    {
        public long Id { get; set; }

        public DateTime Fecha { get; set; }

        public string ip_remota { get; set; }

        public string Navegador { get; set; }
    }
}
