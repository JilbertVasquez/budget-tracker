// using budget_tracker_client.Periods;

namespace budget_tracker_client.FixedExpenses;

public record CreateFixedExpenseDto(
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    // int PeriodId,
    int UserId
);