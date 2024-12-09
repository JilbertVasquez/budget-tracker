using budget_tracker_client.Periods;

namespace budget_tracker_client.Expenses;

public record UpdateExpenseDto
(
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    Period Period,
    int UserId
);