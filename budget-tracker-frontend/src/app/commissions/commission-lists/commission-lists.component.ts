import {Component, ViewChild} from '@angular/core';
import { DateRangePickerComponent } from '../../date-range-picker/date-range-picker.component';
import { MatCardModule } from '@angular/material/card';
import { Column, DataTableComponent } from '../../_shared/data-table/data-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommissionDetailsDto } from '../../_dtos/commissions/commission-details-dto';
import { DateFilterDto } from '../../_dtos/date/date-filter-dto';
import { CommissionService } from '../../_services/commission.service';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-commission-lists',
    imports: [MatCardModule, DataTableComponent, MatFormFieldModule, MatDatepickerModule, FormsModule, MatButtonModule, DateRangePickerComponent],
    templateUrl: './commission-lists.component.html',
    styleUrl: './commission-lists.component.css',
    providers: [DatePipe]
})
export class CommissionListsComponent {
    @ViewChild('dt') dt!: DataTableComponent<CommissionDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: CommissionDetailsDto[] = [];
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

    constructor(private _commissionService: CommissionService,
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

    editCommission(data: CommissionDetailsDto) {
        console.log(data);
        this._router.navigate(['commissions/commission-details/', data.commissionId]);
    }

    async deleteCommission(data: CommissionDetailsDto) {
        try {
            const isConfirm = await this._getUserConfirmation(`Do you want to delete ${data.name} savings?`);
            if (!isConfirm) return;

            await this._commissionService.deleteCommission(data.commissionId);
            this._dialogService.message("Commission successfully deleted.");
            this._loadData();
        }
        catch (error: any) {
            this._errorService.handle(error);
        }
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

        this._getCommissionList(formattedStart!, formattedEnd!);

    }

    private async _getCommissionList(formattedStart: string, formattedEnd: string) {
        try {
            const response = await this._commissionService.getCommissionList(formattedStart!.toString(), formattedEnd!.toString());
            this.data = response.commissionList;
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
