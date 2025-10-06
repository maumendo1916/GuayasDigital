using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.MODELS
{
    public class MenuNuevo
    {
        public string id { get; set; } = null;
        public string text { get; set; }
        public string parentId { get; set; }
        public string url { get; set; } = "";
        public string Icon { get; set; } = "";
        public long IdenBase { get; set; } = 0;

    }
}
