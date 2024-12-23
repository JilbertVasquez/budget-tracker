using System.ComponentModel.DataAnnotations;

namespace budget_tracker_client.Dtos;

public class DateFilterDto
{
    [Required] public required DateOnly StartDate { get; set; }
    [Required] public required DateOnly EndDate { get; set; }
}