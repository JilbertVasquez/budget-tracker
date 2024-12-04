namespace budget_tracker_client.Periods;

public record PeriodDto(int PeriodId, string Name, string? Description, DateTime CreatedAt);