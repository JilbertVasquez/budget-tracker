
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using budget_tracker_client.Expenses;
using budget_tracker_client.FixedExpenses;

namespace budget_tracker_client.Users
{
    [Table("users")]
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        [Required, EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        public string Username { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;

        public DateOnly? CreatedAt { get; set; }

        public bool? IsDeleted { get; set; }

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
       
        public ICollection<FixedExpense> FixedExpenses { get; set; } = new List<FixedExpense>();

        public User() { }

        public User(RegisterUserDto dto)
        {
            Name = dto.Name;
            Email = dto.Email;
            Username = dto.Username;
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password, 11);
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
        }
    }
}