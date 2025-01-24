namespace budget_tracker_client.Commissions;

public record CreateCommissionDto(
    string Name, 
    string Description, 
    string? Note,
    double Amount,
    string? Category,
    string UserId
);