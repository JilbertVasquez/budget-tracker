namespace budget_tracker_client.Commissions;

public record CommissionDetailsDto
(
    int CommissionId, 
    string Name,
    string Description,
    string? Note,
    double Amount,
    string? Category,
    DateOnly CreatedAt
);