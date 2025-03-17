import {Component, ViewChild} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {
    Column,
    DataTableComponent,
} from '../../_shared/data-table/data-table.component';
import {FixedExpenseDetailsDto} from '../../_dtos/fixed-expenses/fixed-expenses-details-dto';
import {DialogService} from '../../_services/dialog.service';
import {ErrorService} from '../../_services/error.service';
import {Router} from '@angular/router';
import {FixedExpensesService} from '../../_services/fixed-expenses.service';
import {firstValueFrom} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {DateRangePickerComponent} from '../../date-range-picker/date-range-picker.component';
import {DatePipe} from '@angular/common';
import {DateFilterDto} from '../../_dtos/date/date-filter-dto';

@Component({
    selector: 'app-fixed-expenses-list',
    imports: [
        MatCardModule,
        DataTableComponent,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        MatButtonModule,
        DateRangePickerComponent,
    ],
    templateUrl: './fixed-expenses-list.component.html',
    styleUrl: './fixed-expenses-list.component.css',
    providers: [DatePipe],
})
export class FixedExpensesListComponent {
    @ViewChild('dt') dt!: DataTableComponent<FixedExpenseDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: FixedExpenseDetailsDto[] = [];
    dateRange: DateFilterDto | null = null;
    isEdit = false;

    columns: Column[] = [
        {identifier: 'name', title: 'Name'},
        {identifier: 'description', title: 'Description'},
        {identifier: 'category', title: 'Category'},
        {identifier: 'note', title: 'Note'},
        {identifier: 'amount', title: 'Amount'},
        {identifier: 'createdAt', title: 'CreatedAt'},
        {identifier: 'actions', title: 'Actions'},
    ];

    constructor(
        private _fixedexpensesService: FixedExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _router: Router,
        private datePipe: DatePipe
    ) {}

    async ngOnInit() {
        this.dateRange = this._fixedexpensesService.dateRange;
        if (this.dateRange) this._loadData();
    }

    ngOnDestroy() {
        this.data = [];
        if (!this.isEdit) this._fixedexpensesService.dateRange = null;
    }

    ngAfterViewInit() {}

    onRangeInput(dateFilterDto: DateFilterDto) {
        this.dateRange = dateFilterDto;
        this._fixedexpensesService.dateRange = dateFilterDto;
    }

    async search() {
        this._loadData();
    }

    editFixedExpense(data: FixedExpenseDetailsDto) {
        this.isEdit = true;
        this._router.navigate([
            'expenses/fixed-expenses-details/',
            data.fixedExpenseId,
        ]);
    }

    async deleteFixedExpense(data: FixedExpenseDetailsDto) {
        try {
            const isConfirm = await this._getUserConfirmation(
                `Do you want to delete ${data.name} fixed expense?`
            );
            if (!isConfirm) return;

            await this._fixedexpensesService.deleteFixedExpense(
                data.fixedExpenseId
            );
            this._dialogService.message('Expense successfully deleted.');
            this._loadData();
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }

    private _loadData() {
        if (!this.dateRange?.start && !this.dateRange?.end) {
            this._dialogService.message('Please enter valid date.');
            return;
        }

        const start = this.dateRange.start;
        const end = this.dateRange.end;

        const formattedStart = this.datePipe.transform(start, 'yyyy-MM-dd');
        const formattedEnd = this.datePipe.transform(end, 'yyyy-MM-dd');

        this._getExpensesList(formattedStart!, formattedEnd!);
    }

    private async _getExpensesList(
        formattedStart: string,
        formattedEnd: string
    ) {
        try {
            const response =
                await this._fixedexpensesService.getFixedExpensesList(
                    formattedStart!.toString(),
                    formattedEnd!.toString()
                );
            this.data = response.fixedExpensesList;
            this.dt.dataSource.data = this.data;
            this._calculateTotal();
        } catch (error: any) {
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
