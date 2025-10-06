using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.MODELS
{
    public class MenuDesdeBD
    {
   
        public long ID_EMPRESA { get; set; }
        public long ID_ROL { get; set; }
        public string ID_USUARIO { get; set; }
        public string MNNIVEL { get; set; }
        public string MNDESCRIP { get; set; }
        public string Icon { get; set; }
        public string Url { get; set; }
        public string ID_USUARIO_CREA { get; set; }
        public string ID_USUARIO_MODI { get; set; }
        public DateTime FECHACREA { get; set; }
        public DateTime? FECHAMODI { get; set; } // Nullable porque la columna puede contener nulls
        public long IDX_ROW_ID { get; set; } // Identity, generalmente manejado por la base de datos
        
    }
}
