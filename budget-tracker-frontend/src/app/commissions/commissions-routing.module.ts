import { Routes } from "@angular/router";
import { CommissionHomeComponent } from "./commission-home/commission-home.component";
import { CashOutComponent } from "./cash-out/cash-out.component";
import { CreateCommissionComponent } from "./create-commission/create-commission.component";
import { CommissionDetailsComponent } from "./commission-details/commission-details.component";
import { CommissionListsComponent } from "./commission-lists/commission-lists.component";

export default [
    {
        path: '',
        component: CommissionHomeComponent
    },
    {
        path: 'commission-list',
        component: CommissionListsComponent,
    },
    {
        path: 'commission-details/:id',
        component: CommissionDetailsComponent,
    },
    {
        path: 'create-commission',
        component: CreateCommissionComponent,
    },
    {
        path: 'cashout',
        component: CashOutComponent,
    },
] as Routes;
