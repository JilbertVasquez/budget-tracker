using System.ComponentModel.DataAnnotations;
using budget_tracker_client.Dtos;

namespace budget_tracker_client.Extensions;

public static class DateFilterDtoExtensions
{
    public static void EnsureStartBeforeEnd(this DateFilterDto dateFilter)
    {
        if (dateFilter.StartDate > dateFilter.EndDate)
        {
            throw new ValidationException("Start date cannot be greater than end date.");
        }
    }

    public static DateOnly GetStartOfStartDate(this DateFilterDto dateFilter)
    {
        return dateFilter.StartDate;
    }

    public static DateOnly GetEndOfEndDate(this DateFilterDto dateFilter)
    {
        return dateFilter.EndDate;
    }
}