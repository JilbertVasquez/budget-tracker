
using budget_tracker_client.Models;
using budget_tracker_client.Shared;

namespace budget_tracker_client.FixedExpenses;

public interface IFixedExpenseServices
{
    Task<Result<bool, string>> AddFixedExpenses(CreateFixedExpenseDto dto);
}

public class FixedExpenseService(DataContext db, ILogger<FixedExpenseService> logger) : IFixedExpenseServices
{
    private readonly DataContext _db = db;

    public async Task<Result<bool, string>> AddFixedExpenses(CreateFixedExpenseDto dto)
    {
        try
        {
            if(string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if(string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            var fixedExpense = new FixedExpense(dto)
            {
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
            };

            _db.FixedExpenses.Add(fixedExpense);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add fixed expense.");
            return "Failed to add fixed expense.";
        }
    }
}