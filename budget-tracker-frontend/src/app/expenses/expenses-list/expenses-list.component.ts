import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Column, DataTableComponent } from '../../_shared/data-table/data-table.component';
import { ExpensesService } from '../../_services/expenses.service';
import { MatCardModule } from '@angular/material/card';
import { ExpenseDetailsDto } from '../../_dtos/expenses/expenses-details-dto';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-expenses-list',
    imports: [MatCardModule, DataTableComponent, MatFormFieldModule, MatDatepickerModule, FormsModule, MatButtonModule],
    templateUrl: './expenses-list.component.html',
    styleUrl: './expenses-list.component.css',
    providers: [provideNativeDateAdapter()],
})
export class ExpensesListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('dt') dt!: DataTableComponent<ExpenseDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: ExpenseDetailsDto[] = [];
    dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
    columns: Column[] = [
        // { identifier: 'expenseId', title: 'Id' },
        { identifier: 'name', title: 'Name' },
        { identifier: 'description', title: 'Description' },
        { identifier: 'category', title: 'Category' },
        { identifier: 'amount', title: 'Amount' },
        { identifier: 'createdAt', title: 'CreatedAt' },
        { identifier: 'actions', title: 'Actions' }
    ]

    constructor(private _expensesService: ExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _router: Router
    ) { }

    async ngOnInit() {
        await this._expensesService.loadExpensesList();
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

    clearDatePicker() {
        this.dateRange.start = null;
        this.dateRange.end = null;
        this._loadData();
    }

    editExpense(data: ExpenseDetailsDto) {
        this._router.navigate(['expenses/expenses-details/', data.expenseId]);
    }

    async deleteExpense(data: ExpenseDetailsDto) {
        try {
            const isConfirm = await this._getUserConfirmation(`Do you want to delete ${data.name} expense?`);
            if (!isConfirm) return;

            await this._expensesService.deleteExpense(data.expenseId);
            this._dialogService.message("Expense successfully deleted.");
            await this._expensesService.loadExpensesList();
            this._loadData();
        }
        catch (error: any) {
            this._errorService.handle(error);
        }
    }

    private _loadData() {
        this.data = this._expensesService.expensesList();
        this.onDateRangeChange();
        // this.dt.dataSource.data = this.data;
    }

    private async _getUserConfirmation(message: string) {
        const dialogRef = this._dialogService.confirmationModal(message);
        return await firstValueFrom(dialogRef.afterClosed());
    }
}
