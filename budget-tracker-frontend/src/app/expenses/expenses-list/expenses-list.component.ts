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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateFilterDto } from '../../_dtos/date/date-filter-dto';
import { DateRangePickerComponent } from '../../date-range-picker/date-range-picker.component';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-expenses-list',
    imports: [MatCardModule, DataTableComponent, MatFormFieldModule, MatDatepickerModule, FormsModule, MatButtonModule, DateRangePickerComponent],
    templateUrl: './expenses-list.component.html',
    styleUrl: './expenses-list.component.css',
    providers: [DatePipe],
})
export class ExpensesListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('dt') dt!: DataTableComponent<ExpenseDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: ExpenseDetailsDto[] = [];
    dateRange: DateFilterDto | undefined = undefined;
    columns: Column[] = [
        // { identifier: 'expenseId', title: 'Id' },
        { identifier: 'name', title: 'Name' },
        { identifier: 'description', title: 'Description' },
        { identifier: 'category', title: 'Category' },
        { identifier: 'note', title: 'Note' },
        { identifier: 'amount', title: 'Amount' },
        { identifier: 'createdAt', title: 'CreatedAt' },
        { identifier: 'actions', title: 'Actions' }
    ]

    constructor(private _expensesService: ExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _router: Router,
        private datePipe: DatePipe
    ) { }

    async ngOnInit() { }

    ngOnDestroy() {
        this.data = [];
    }

    ngAfterViewInit() { }

    onRangeInput(dateFilterDto: DateFilterDto) {
        this.dateRange = dateFilterDto;
    }

    async search() {
        await this._loadData();
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
            this._loadData();
        }
        catch (error: any) {
            this._errorService.handle(error);
        }
    }

    private async _loadData() {
        if (!this.dateRange?.start && !this.dateRange?.end) {
            this._dialogService.message("Please enter valid date.");
            return;
        }

        const start = this.dateRange.start;
        const end = this.dateRange.end;

        const formattedStart = this.datePipe.transform(start, 'yyyy-MM-dd');
        const formattedEnd = this.datePipe.transform(end, 'yyyy-MM-dd');

        await this._getExpensesList(formattedStart!, formattedEnd!);

    }

    private async _getExpensesList(formattedStart: string, formattedEnd: string) {
        try {
            const response = await this._expensesService.getExpensesList(formattedStart!.toString(), formattedEnd!.toString());
            this.data = response.expensesList;
            this.dt.dataSource.data = this.data;
            this._calculateTotal();
        }
        catch (error: any) {
            this._errorService.handle(error);
        }
    }

    private _calculateTotal() {
        const total = this.dt.dataSource.data.reduce((sum, val) => {
            return sum + val.amount;
        }, 0);

        this.dt.total = total;
    }

    private async _getUserConfirmation(message: string) {
        const dialogRef = this._dialogService.confirmationModal(message);
        return await firstValueFrom(dialogRef.afterClosed());
    }
}
