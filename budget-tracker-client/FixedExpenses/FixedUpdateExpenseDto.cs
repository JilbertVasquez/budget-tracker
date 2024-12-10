using budget_tracker_client.Periods;

namespace budget_tracker_client.FixedExpenses;

public record UpdateFixedExpenseDto
(
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    Period Period,
    int UserId
);