using budget_tracker_client.Periods;

namespace budget_tracker_client.FixedExpenses;

public record FixedExpenseDetailsDto
(
    int FixedExpenseId,
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    Period Period,
    DateOnly CreatedAt
);