
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Budgets;

public interface IBudgetServices
{
    Task<Result<bool, string>> AddBudget(CreateBudgetDto dto);
    Task<Result<BudgetDetailsDto, string>> GetBudget(BudgetRequestDto dto, int budgetId);
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

            if (budget == null) return "Failed to get budget";

            return new BudgetDetailsDto(
                budget.BudgetId,
                budget.Name,
                budget.Description,
                budget.Note,
                budget.Amount,
                budget.Period,
                budget.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get budget");
            return "Failed to get budget";
        }
    }
}