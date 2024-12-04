
using System.Security.Cryptography.X509Certificates;
using budget_tracker_client.Users;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Shared
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public required DbSet<User> Users { get; set; }
    }
}
