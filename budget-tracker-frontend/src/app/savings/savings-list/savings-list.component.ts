import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Column, DataTableComponent } from '../../_shared/data-table/data-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateRangePickerComponent } from '../../date-range-picker/date-range-picker.component';
import { DatePipe } from '@angular/common';
import { SavingsDetailsDto } from '../../_dtos/savings/savings-details-dto';
import { DateFilterDto } from '../../_dtos/date/date-filter-dto';
import { SavingsService } from '../../_services/savings.service';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-savings-list',
    imports: [MatCardModule, DataTableComponent, MatFormFieldModule, MatDatepickerModule, FormsModule, MatButtonModule, DateRangePickerComponent],
    templateUrl: './savings-list.component.html',
    styleUrl: './savings-list.component.css',
    providers: [DatePipe],
})
export class SavingsListComponent {
    @ViewChild('dt') dt!: DataTableComponent<SavingsDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: SavingsDetailsDto[] = [];
        dateRange: DateFilterDto | undefined = undefined;

    columns: Column[] = [
        { identifier: 'name', title: 'Name' },
        { identifier: 'description', title: 'Description' },
        { identifier: 'category', title: 'Category' },
        { identifier: 'note', title: 'Note' },
        { identifier: 'amount', title: 'Amount' },
        { identifier: 'createdAt', title: 'CreatedAt' },
        { identifier: 'actions', title: 'Actions' }
    ];

    constructor(private _savingsService: SavingsService,
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
            this._loadData();
        }

    private _loadData() {
        if (!this.dateRange?.start && !this.dateRange?.end) {
            this._dialogService.message("Please enter valid date.");
            return;
        }

        const start = this.dateRange.start;
        const end = this.dateRange.end;

        const formattedStart = this.datePipe.transform(start, 'yyyy-MM-dd');
        const formattedEnd = this.datePipe.transform(end, 'yyyy-MM-dd');

        this._getSavingsList(formattedStart!, formattedEnd!);

    }

    private async _getSavingsList(formattedStart: string, formattedEnd: string) {
        try {
            const response = await this._savingsService.getSavingsList(formattedStart!.toString(), formattedEnd!.toString());
            this.data = response.savingsList;
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
}
