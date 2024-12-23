namespace budget_tracker_client.Savings;

public record CreateSavingDto(
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    // int PeriodId,
    int UserId
);