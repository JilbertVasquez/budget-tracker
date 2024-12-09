using budget_tracker_client.Periods;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Expenses;

public record ExpenseDetailsDto
(
    int ExpenseId, 
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    Period Period,
    DateOnly CreatedAt
);