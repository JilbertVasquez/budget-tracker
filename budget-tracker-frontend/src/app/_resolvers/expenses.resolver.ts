import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { ExpensesService } from "../_services/expenses.service";
import { ExpenseDetailsDto } from "../_dtos/expenses/expenses-details-dto";

export const loadExpensesResolver: ResolveFn<ExpenseDetailsDto[]> = async () => {
    const expensesService = inject(ExpensesService);

    if (expensesService.expensesList().length) return expensesService.expensesList();

    await expensesService.loadExpensesList();
    return expensesService.expensesList();
}
