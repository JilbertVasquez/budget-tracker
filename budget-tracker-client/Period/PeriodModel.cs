
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace budget_tracker_client.Periods
// {
//     [Table("period")]
//     public class Period
//     {
//         [Key]
//         public int PeriodId { get; set; }

//         [Required]
//         public string Name { get; set; } = default!;

//         public string? Description { get; set; }

//         public DateOnly CreatedAt { get; set; }

//         public bool? IsDeleted { get; set; }

//         public Period() { }

//         public Period(CreatePeriodDto dto)
//         {
//             Name = dto.Name;
//             Description = dto.Description;
//             CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
//         }
//     }
// }