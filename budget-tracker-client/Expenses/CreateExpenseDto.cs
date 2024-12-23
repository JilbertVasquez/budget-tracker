namespace budget_tracker_client.Expenses;

public record CreateExpenseDto(
    string Name, 
    string Description, 
    string? Note,
    double Amount,
    string? Category,
    // int PeriodId,
    int UserId
);