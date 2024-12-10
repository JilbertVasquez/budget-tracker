namespace budget_tracker_client.Budgets;

public record CreateBudgetDto(
    string Name,
    string Description,
    string? Note,
    double Amount,
    int PeriodId,
    int UserId
);