import { Routes } from "@angular/router";
import { SavingsHomeComponent } from "./savings-home/savings-home.component";
import { SavingsListComponent } from "./savings-list/savings-list.component";
import { SavingsDetailsComponent } from "./savings-details/savings-details.component";
import { CreateSavingsComponent } from "./create-savings/create-savings.component";


export default [
    {
        path: '',
        component: SavingsHomeComponent
    },
    {
        path: 'expenses-list',
        component: SavingsListComponent,
    },
    {
        path: 'expenses-details/:id',
        component: SavingsDetailsComponent,
    },
    {
        path: 'create-expenses',
        component: CreateSavingsComponent,
    },
] as Routes;
