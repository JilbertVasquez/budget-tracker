
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Expenses;

public interface IExpenseServices
{
    Task<Result<bool, string>> AddExpense(CreateExpenseDto dto);
    Task<Result<ExpenseDetailsDto, string>> GetExpense(ExpenseRequestDto dto, int expenseId);
    Task<Result<ExpensesForListDto, string>> GetExpenses(ExpenseRequestDto dto);
    Task<Result<bool, string>> UpdateExpense(int expenseId, UpdateExpenseDto dto);
    Task<Result<bool, string>> DeleteExpense(ExpenseRequestDto dto, int expenseId);

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
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
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

    public async Task<Result<ExpenseDetailsDto, string>> GetExpense(ExpenseRequestDto dto, int expenseId)
    {
        try
        {
            var expense = await _db.Expenses
                .Where(x => x.UserId == dto.UserId && x.ExpensesId == expenseId && x.IsDeleted == null)
                .Include(p => p.Period)
                .FirstOrDefaultAsync();
            
            if (expense == null) return "Failed to get expense.";

            return new ExpenseDetailsDto(
                expense.ExpensesId, 
                expense.Name, 
                expense.Description, 
                expense.Note, 
                expense.Amount, 
                expense.Category, 
                expense.Period, 
                expense.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get expense.");
            return "Failed to get expense.";
        }
    }

    public async Task<Result<ExpensesForListDto, string>> GetExpenses(ExpenseRequestDto dto)
    {
        try
        {
            var expenses = await _db.Expenses
                .Where(x => x.UserId == dto.UserId && x.IsDeleted == null)
                .Include(p => p.Period)
                .ToListAsync();

            var expensesList = expenses.Select(x => new ExpenseDetailsDto(
                x.ExpensesId,
                x.Name,
                x.Description,
                x.Note,
                x.Amount,
                x.Category,
                x.Period,
                x.CreatedAt
            )).ToArray();

            return new ExpensesForListDto(expensesList);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get expenses.");
            return "Failed to get expenses.";
        }
    }

    public async Task<Result<bool, string>> UpdateExpense(int expenseId, UpdateExpenseDto dto)
    {
        try
        {
            var expense = await _db.Expenses.FindAsync(expenseId);
            if (expense == null || expense.UserId != dto.UserId || expense.IsDeleted != null) return "Failed to update expense.";

            expense.Name = dto.Name;
            expense.Description = dto.Description;
            expense.Note = dto.Note;
            expense.Amount = dto.Amount;
            expense.Category = dto.Category;
            expense.Period = dto.Period;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update expense.");
            return "Failed to update expense.";
        }
    }

    public async Task<Result<bool, string>> DeleteExpense(ExpenseRequestDto dto, int expenseId)
    {
        try
        {
            var expense = await _db.Expenses.FindAsync(expenseId);
            if (expense == null || expense.UserId != dto.UserId || expense.IsDeleted != null) return "Failed to delete expense.";

            expense.IsDeleted = true;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete expense.");
            return "Failed to delete expense.";
        }
    }
}