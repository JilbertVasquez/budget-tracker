
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.FixedExpenses;

public interface IFixedExpenseServices
{
    Task<Result<bool, string>> AddFixedExpenses(CreateFixedExpenseDto dto);
    Task<Result<FixedExpenseDetailsDto, string>> GetFixedExpense(FixedExpenseRequestDto dto, int fixedExpenseId);
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

    public async Task<Result<FixedExpenseDetailsDto, string>> GetFixedExpense(FixedExpenseRequestDto dto, int fixedExpenseId)
    {
        try
        {
            var fixedExpense = await _db.FixedExpenses
                .Where(x => x.UserId == dto.UserId && x.FixedExpensesId == fixedExpenseId && x.IsDeleted == null)
                .Include(p => p.Period)
                .FirstOrDefaultAsync();

            if (fixedExpense == null) return "Failed to get fixed expense.";

            return new FixedExpenseDetailsDto(
                fixedExpense.FixedExpensesId,
                fixedExpense.Name,
                fixedExpense.Description,
                fixedExpense.Note,
                fixedExpense.Amount,
                fixedExpense.Category,
                fixedExpense.Period,
                fixedExpense.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get fixed expense.");
            return "Failed to get fixed expense.";
        }
    }
}