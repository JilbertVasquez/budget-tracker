
using System.Security.Cryptography.X509Certificates;
using budget_tracker_client.Expenses;
using budget_tracker_client.Periods;
using budget_tracker_client.Users;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Shared
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {

        public required DbSet<User> Users { get; set; }
        public required DbSet<Period> Periods { get; set; }
        public required DbSet<Expense> Expenses { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                onExpensesModelCreating(modelBuilder);
            }

        private void onExpensesModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Expense>()
                .HasOne(e => e.User)
                .WithMany(u => u.Expenses)
                .HasForeignKey(e => e.UserId);
        }
    }
}
