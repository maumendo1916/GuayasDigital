using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.MODELS
{
    public  class MenuData
    {
        public string Text { get; set; }
        public string id { get; set; }
        public string Icon { get; set; }
        public string Url { get; set; }
        public long IdenBase { get; set; }

        public List<MenuData> Children { get; set; }
        public MenuData()
        {
            Children = new List<MenuData>();
        }
    }
}
