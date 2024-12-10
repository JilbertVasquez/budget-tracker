
using System.Xml;
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.FixedExpenses;

public interface IFixedExpenseServices
{
    Task<Result<bool, string>> AddFixedExpenses(CreateFixedExpenseDto dto);
    Task<Result<FixedExpenseDetailsDto, string>> GetFixedExpense(FixedExpenseRequestDto dto, int fixedExpenseId);
    Task<Result<FixedExpensesForListDto, string>> GetFixedExpenses(FixedExpenseRequestDto dto);
    Task<Result<bool, string>> UpdateFixedExpense(int fixedExpenseId, UpdateFixedExpenseDto dto);
    Task<Result<bool, string>> DeleteFixedExpense(FixedExpenseRequestDto dto, int fixedExpenseId);
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

    public async Task<Result<FixedExpensesForListDto, string>> GetFixedExpenses(FixedExpenseRequestDto dto)
    {
        try
        {
            var fixedExpenses = await _db.FixedExpenses
                .Where(x => x.UserId == dto.UserId && x.IsDeleted == null)
                .Include(p => p.Period)
                .ToListAsync();

            var fixedExpensesList = fixedExpenses.Select( x => new FixedExpenseDetailsDto(
                x.FixedExpensesId,
                x.Name,
                x.Description,
                x.Note,
                x.Amount,
                x.Category,
                x.Period,
                x.CreatedAt
            )).ToArray();

            return new FixedExpensesForListDto(fixedExpensesList);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get fixed expenses.");
            return "Failed to get fixed expenses.";
        }
    }

    public async Task<Result<bool, string>> UpdateFixedExpense(int fixedExpenseId, UpdateFixedExpenseDto dto)
    {
        try
        {
            var fixedExpense = await _db.FixedExpenses.FindAsync(fixedExpenseId);

            if (fixedExpense == null || fixedExpense.UserId != dto.UserId) return "Failed to update fixed expense.";

            fixedExpense.Name = dto.Name;
            fixedExpense.Description = dto.Description;
            fixedExpense.Note = dto.Note;
            fixedExpense.Amount = dto.Amount;
            fixedExpense.Category = dto.Category;
            fixedExpense.Period = dto.Period;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update fixed expense.");
            return "Failed to update fixed expense.";
        }
    }

    public async Task<Result<bool, string>> DeleteFixedExpense(FixedExpenseRequestDto dto, int fixedExpenseId)
    {
        try
        {
            var fixedExpense = await _db.FixedExpenses.FindAsync(fixedExpenseId);
            if (fixedExpense == null || fixedExpense.UserId != dto.UserId) return "Failed to delete fixed expense.";

            fixedExpense.IsDeleted = true;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete fixed expense.");
            return "Failed to delete fixed expense.";
        }
    }
}