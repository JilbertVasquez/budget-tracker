using budget_tracker_client.Periods;

namespace budget_tracker_client.Budgets;

public record BudgetDetailsDto
(
    int BudgetId,
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    // Period Period,
    DateOnly CreatedAt
);