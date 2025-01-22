import {Routes} from '@angular/router';
import {ExpensesHomeComponent} from './expenses-home/expenses-home.component';
import {ExpensesListComponent} from './expenses-list/expenses-list.component';
import {ExpensesDetailsComponent} from './expenses-details/expenses-details.component';
import {CreateExpensesComponent} from './create-expenses/create-expenses.component';
import {FixedExpensesListComponent} from './fixed-expenses-list/fixed-expenses-list.component';
import {CreateFixedExpensesComponent} from './create-fixed-expenses/create-fixed-expenses.component';
import {FixedExpensesDetailsComponent} from './fixed-expenses-details/fixed-expenses-details.component';

export default [
    {
        path: '',
        component: ExpensesHomeComponent,
    },
    {
        path: 'expenses-list',
        component: ExpensesListComponent,
    },
    {
        path: 'expenses-details/:id',
        component: ExpensesDetailsComponent,
    },
    {
        path: 'create-expenses',
        component: CreateExpensesComponent,
    },
    {
        path: 'fixed-expenses-list',
        component: FixedExpensesListComponent,
    },
    {
        path: 'fixed-expenses-details/:id',
        component: FixedExpensesDetailsComponent,
    },
    {
        path: 'create-fixed-expenses',
        component: CreateFixedExpensesComponent,
    },
] as Routes;
