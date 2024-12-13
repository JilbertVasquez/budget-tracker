import { Routes } from "@angular/router";
import { ExpensesHomeComponent } from "./expenses-home/expenses-home.component";
import { ExpensesListComponent } from "./expenses-list/expenses-list.component";
import { ExpensesDetailsComponent } from "./expenses-details/expenses-details.component";
import { CreateExpensesComponent } from "./create-expenses/create-expenses.component";
import { loadExpensesResolver } from "../_resolvers/expenses-resolver";

export default [
    {
        path: '',
        component: ExpensesHomeComponent
    },
    {
        path: 'expenses-list',
        component: ExpensesListComponent,
        resolve: { loadExpense: loadExpensesResolver }
    },
    {
        path: 'expenses-details',
        component: ExpensesDetailsComponent
    },
    {
        path: 'create-expenses',
        component: CreateExpensesComponent
    }
] as Routes;
