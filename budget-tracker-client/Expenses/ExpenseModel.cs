
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using budget_tracker_client.Periods;
using budget_tracker_client.Users;

namespace budget_tracker_client.Expenses
{
    [Table("expenses")]
    public class Expense
    {
        [Key]
        public int ExpensesId { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        [Required]
        public string Description { get; set; } = default!;

        public string? Note { get; set; }

        [Required]
        public double Amount { get; set; } = default!;

        public string? Category { get; set; }

        [Required]
        public DateOnly CreatedAt { get; set; } = default!;
        
        public bool? IsDeleted { get; set; }

        // public int PeriodId { get; set; } = default!;
        // public Period Period { get; set; } = default!;

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = default!;

        public Expense() { }
        public Expense(CreateExpenseDto dto)
        {
            Name = dto.Name;
            Description = dto.Description;
            Note = dto.Note;
            Amount = dto.Amount;
            Category = dto.Category;
            // PeriodId = dto.PeriodId;
            UserId = dto.UserId;
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
        }
    }
}