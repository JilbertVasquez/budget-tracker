
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Budgets;

public interface IBudgetServices
{
    Task<Result<bool, string>> AddBudget(CreateBudgetDto dto);
    Task<Result<BudgetDetailsDto, string>> GetBudget(BudgetRequestDto dto, int budgetId);
    Task<Result<BudgetForListDto, string>> GetBudgets(BudgetRequestDto dto);
    Task<Result<bool, string>> UpdateBudget(int budgetId, UpdateBudgetDto dto);
    Task<Result<bool, string>> DeleteBudget(int budgetId, UpdateBudgetDto dto);
}

public class BudgetService(DataContext db, ILogger<BudgetService> logger) : IBudgetServices
{
    private readonly DataContext _db = db;

    public async Task<Result<bool, string>> AddBudget(CreateBudgetDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if (string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            var budget = new Budget(dto)
            {
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            _db.Budgets.Add(budget);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add budget.");
            return "Failed to add budget.";
        }
    }

    public async Task<Result<BudgetDetailsDto, string>> GetBudget(BudgetRequestDto dto, int budgetId)
    {
        try
        {
            var budget = await _db.Budgets
                .Where(x => x.UserId == dto.UserId && x.BudgetId == budgetId && x.IsDeleted == null)
                .FirstOrDefaultAsync();

            if (budget == null) return "Failed to get budget.";

            return new BudgetDetailsDto(
                budget.BudgetId,
                budget.Name,
                budget.Description,
                budget.Note,
                budget.Amount,
                budget.Category,
                budget.Period,
                budget.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get budget.");
            return "Failed to get budget.";
        }
    }

    public async Task<Result<BudgetForListDto, string>> GetBudgets(BudgetRequestDto dto)
    {
        try
        {
            var budget = await _db.Budgets
                .Where(x => x.UserId == dto.UserId && x.IsDeleted == null)
                .Include(p => p.Period)
                .ToListAsync();

            if (budget == null) return "Failed to get budgets.";

            var budgetList = budget.Select(x => new BudgetDetailsDto(
                x.BudgetId,
                x.Name,
                x.Description,
                x.Note,
                x.Amount,
                x.Category,
                x.Period,
                x.CreatedAt
            )).ToArray();

            return new BudgetForListDto(budgetList);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get budget");
            return "Failed to get budget";
        }
    }

    public async Task<Result<bool, string>> UpdateBudget(int budgetId, UpdateBudgetDto dto)
    {
        try
        {
            var budget = await _db.Budgets.FindAsync(budgetId);
            if (budget == null || budget.UserId != dto.UserId) return "Failed to update budget.";

            budget.Name = dto.Name;
            budget.Description = dto.Description;
            budget.Note = dto.Note;
            budget.Amount = dto.Amount;
            budget.Period = dto.Period;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update budget.");
            return "Failed to update budget.";
        }
    }

    public async Task<Result<bool, string>> DeleteBudget(int budgetId, UpdateBudgetDto dto)
    {
        try
        {
            var budget = await _db.Budgets.FindAsync(budgetId);
            if (budget == null || budget.UserId != dto.UserId) return "Failed to delete budget.";

            budget.IsDeleted = true;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete budget.");
            return "Failed to delete budget.";
        }
    }
}