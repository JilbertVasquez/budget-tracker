import { Routes } from "@angular/router";
import { ExpensesHomeComponent } from "./expenses-home/expenses-home.component";
import { ExpensesListComponent } from "./expenses-list/expenses-list.component";
import { ExpensesDetailsComponent } from "./expenses-details/expenses-details.component";
import { CreateExpensesComponent } from "./create-expenses/create-expenses.component";
// import { loadExpensesResolver } from "../_resolvers/expenses.resolver";
import { loadPeriodResolver } from "../_resolvers/period.resolver";

export default [
    {
        path: '',
        component: ExpensesHomeComponent
    },
    {
        path: 'expenses-list',
        component: ExpensesListComponent,
        // resolve: { loadExpenses: loadExpensesResolver }
    },
    {
        path: 'expenses-details/:id',
        component: ExpensesDetailsComponent,
        resolve: { loadPeriods: loadPeriodResolver }
    },
    {
        path: 'create-expenses',
        component: CreateExpensesComponent,
        resolve: { loadPeriods: loadPeriodResolver }
    }
] as Routes;
