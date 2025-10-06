using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace gd98.Models
{
    [Table("contador", Schema = "mezfjnkj_admin")]
    public class Contador
    {
        public int Id { get; set; }

        public long? contador { get; set; }

        public DateTime? ultimafecha { get; set; }
    }
}
