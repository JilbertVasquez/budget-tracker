import { Component, ViewChild, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Column, DataTableComponent } from '../../_shared/data-table/data-table.component';
import { FixedExpenseDetailsDto } from '../../_dtos/fixed-expenses/fixed-expenses-details-dto';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { Router } from '@angular/router';
import { FixedExpensesService } from '../../_services/fixed-expenses.service';

@Component({
    selector: 'app-fixed-expenses-list',
    imports: [MatCardModule, DataTableComponent],
    templateUrl: './fixed-expenses-list.component.html',
    styleUrl: './fixed-expenses-list.component.css'
})
export class FixedExpensesListComponent {
    @ViewChild('dt') dt!: DataTableComponent<FixedExpenseDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: FixedExpenseDetailsDto[] = [];
    columns: Column[] = [
        // { identifier: 'expenseId', title: 'Id' },
        { identifier: 'name', title: 'Name' },
        { identifier: 'description', title: 'Description' },
        { identifier: 'category', title: 'Category' },
        { identifier: 'amount', title: 'Amount' },
        { identifier: 'createdAt', title: 'CreatedAt' },
        { identifier: 'actions', title: 'Actions' }
    ];

    constructor(private _fixedexpensesService: FixedExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _router: Router
    ) { }

    async ngOnInit() {
        await this._fixedexpensesService.loadFixedExpensesList();
    }

    ngOnDestroy() {
        this.data = [];
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this._loadData();
        });
    }

    editFixedExpense(data: FixedExpenseDetailsDto) {
        console.log(data);
        this._router.navigate(['expenses/fixed-expenses-details/', data.fixedExpenseId]);
    }

    private _loadData() {
        this.data = this._fixedexpensesService.fixedExpensesList();
        this.dt.dataSource.data = this.data;
    }
}
