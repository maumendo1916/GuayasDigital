using System.Data.Entity;

namespace gd98.Models
{
    public class MyContext : DbContext
    {
        public MyContext() : base("ConnectionString")
        {
            // 🔒 Desactiva la comprobación del modelo frente a la base de datos
            Database.SetInitializer<MyContext>(null);
        }

        public DbSet<Visita> Visitas { get; set; }
        public DbSet<Contador> Contadores { get; set; }
    }
}
