import {Routes} from '@angular/router';
import {SavingsHomeComponent} from './savings-home/savings-home.component';
import {SavingsListComponent} from './savings-list/savings-list.component';
import {SavingsDetailsComponent} from './savings-details/savings-details.component';
import {CreateSavingsComponent} from './create-savings/create-savings.component';
import {WithdrawSavingsComponent} from './withdraw-savings/withdraw-savings.component';

export default [
    {
        path: '',
        component: SavingsHomeComponent,
    },
    {
        path: 'savings-list',
        component: SavingsListComponent,
    },
    {
        path: 'savings-details/:id',
        component: SavingsDetailsComponent,
    },
    {
        path: 'create-savings',
        component: CreateSavingsComponent,
    },
    {
        path: 'withdraw-savings',
        component: WithdrawSavingsComponent,
    },
] as Routes;
