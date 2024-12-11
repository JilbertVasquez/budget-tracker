using budget_tracker_client.Periods;

namespace budget_tracker_client.Savings;

public record SavingDetailsDto
(
    int SavingId,
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    Period Period,
    DateOnly CreatedAt
);