namespace budget_tracker_client.Commissions;

public record UpdateCommissionDto
(
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    int UserId
);