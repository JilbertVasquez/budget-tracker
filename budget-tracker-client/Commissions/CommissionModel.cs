
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using budget_tracker_client.Users;

namespace budget_tracker_client.Commissions
{
    [Table("commissions")]
    public class Commission
    {
        [Key]
        public int CommissionId { get; set; }

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

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = default!;

        public Commission() { }
        public Commission(CreateCommissionDto dto)
        {
            Name = dto.Name;
            Description = dto.Description;
            Note = dto.Note;
            Amount = dto.Amount;
            Category = dto.Category;
            UserId = dto.UserId;
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
        }
    }
}