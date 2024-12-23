import { Routes } from "@angular/router";
import { ExpensesHomeComponent } from "./expenses-home/expenses-home.component";
import { ExpensesListComponent } from "./expenses-list/expenses-list.component";
import { ExpensesDetailsComponent } from "./expenses-details/expenses-details.component";
import { CreateExpensesComponent } from "./create-expenses/create-expenses.component";
// import { loadExpensesResolver } from "../_resolvers/expenses.resolver";
// import { loadPeriodResolver } from "../_resolvers/period.resolver";
import { FixedExpensesListComponent } from "./fixed-expenses-list/fixed-expenses-list.component";
import { CreateFixedExpensesComponent } from "./create-fixed-expenses/create-fixed-expenses.component";
import { FixedExpensesDetailsComponent } from "./fixed-expenses-details/fixed-expenses-details.component";

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
        // resolve: { loadPeriods: loadPeriodResolver }
    },
    {
        path: 'create-expenses',
        component: CreateExpensesComponent,
        // resolve: { loadPeriods: loadPeriodResolver }
    },
    {
        path: 'fixed-expenses-list',
        component: FixedExpensesListComponent,
    },
    {
        path: 'fixed-expenses-details/:id',
        component: FixedExpensesDetailsComponent,
        // resolve: { loadPeriods: loadPeriodResolver }
    },
    {
        path: 'create-fixed-expenses',
        component: CreateFixedExpensesComponent,
        // resolve: { loadPeriods: loadPeriodResolver }
    }
] as Routes;
