using LearningAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningAPI
{
    public class MyDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public MyDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string? connectionString = _configuration.GetConnectionString("MyConnection");
            if (connectionString != null)
            {
                optionsBuilder.UseMySQL(connectionString);
            }
        }

        public DbSet<Tutorial> Tutorials { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<UplayUser> UplayUsers { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<Member> Members { get; set; }

        public DbSet<Voucher> Vouchers { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<Review> Reviews { get; set; }

    }
}