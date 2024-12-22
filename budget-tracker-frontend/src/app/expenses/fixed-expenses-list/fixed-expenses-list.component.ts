import { Component, ViewChild, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Column, DataTableComponent } from '../../_shared/data-table/data-table.component';
import { FixedExpenseDetailsDto } from '../../_dtos/fixed-expenses/fixed-expenses-details-dto';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { Router } from '@angular/router';
import { FixedExpensesService } from '../../_services/fixed-expenses.service';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-fixed-expenses-list',
    imports: [MatCardModule, DataTableComponent, MatFormFieldModule, MatDatepickerModule, FormsModule],
    templateUrl: './fixed-expenses-list.component.html',
    styleUrl: './fixed-expenses-list.component.css',
        providers: [provideNativeDateAdapter()],
})
export class FixedExpensesListComponent {
    @ViewChild('dt') dt!: DataTableComponent<FixedExpenseDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: FixedExpenseDetailsDto[] = [];
    dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
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

    onDateRangeChange(): void {
        if (this.dateRange.start && this.dateRange.end) {
            const filteredData = this.data.filter(x => {
                const createdAt = new Date(x.createdAt);
                return createdAt >= this.dateRange.start! && createdAt <= this.dateRange.end!;
            });
            this.dt.dataSource.data = filteredData;
        }
        else {
            this.dt.dataSource.data = this.data;
        }
    }

    editFixedExpense(data: FixedExpenseDetailsDto) {
        console.log(data);
        this._router.navigate(['expenses/fixed-expenses-details/', data.fixedExpenseId]);
    }

    async deleteFixedExpense(data: FixedExpenseDetailsDto) {
        try {
            const isConfirm = await this._getUserConfirmation(`Do you want to delete ${data.name} fixed expense?`);
            if (!isConfirm) return;

            await this._fixedexpensesService.deleteFixedExpense(data.fixedExpenseId);
            this._dialogService.message("Expense successfully deleted.");
            await this._fixedexpensesService.loadFixedExpensesList();
            this._loadData();
        }
        catch (error: any) {
            this._errorService.handle(error);
        }
    }

    private _loadData() {
        this.data = this._fixedexpensesService.fixedExpensesList();
        this.dt.dataSource.data = this.data;
    }

    private async _getUserConfirmation(message: string) {
            const dialogRef = this._dialogService.confirmationModal(message);
            return await firstValueFrom(dialogRef.afterClosed());
        }
}
