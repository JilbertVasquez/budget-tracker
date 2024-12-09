
using budget_tracker_client.Models;
using budget_tracker_client.Shared;

namespace budget_tracker_client.Expenses;

public interface IExpenseServices
{
    Task<Result<bool, string>> AddExpense(CreateExpenseDto dto);
}

public class ExpenseService(DataContext db, ILogger<ExpenseService> logger) : IExpenseServices
{
    private readonly DataContext _db = db;

    public async Task<Result<bool, string>> AddExpense(CreateExpenseDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if (string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            var expense = new Expense(dto)
            {
                CreatedAt = DateTime.UtcNow
            };
            _db.Expenses.Add(expense);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add expense.");
            return "Failed to add expense.";
        }
    }

}