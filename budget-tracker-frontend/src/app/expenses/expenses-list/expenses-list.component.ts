import { Component, ViewChild } from '@angular/core';
import { Column, DataTableComponent } from '../../_shared/data-table/data-table.component';
import { ExpensesService } from '../../_services/expenses.service';
import { MatCardModule } from '@angular/material/card';
import { ExpenseDetailsDto } from '../../_dtos/expenses/expenses-details-dto';

@Component({
    selector: 'app-expenses-list',
    imports: [MatCardModule, DataTableComponent],
    templateUrl: './expenses-list.component.html',
    styleUrl: './expenses-list.component.css'
})
export class ExpensesListComponent {
    @ViewChild('dt') dt!: DataTableComponent<ExpenseDetailsDto>;
    isLoading = false;
    isBusy = false;
    data: ExpenseDetailsDto[] = [];
    columns: Column[] = [
        { identifier: 'expenseId', title: 'Id' },
        { identifier: 'name', title: 'Name' },
        { identifier: 'description', title: 'Description' },
        { identifier: 'category', title: 'Category' },
        { identifier: 'amount', title: 'Amount' },
        { identifier: 'createdAt', title: 'CreatedAt' },
    ]

    constructor(private _expensesService: ExpensesService) { }

    ngOnDestroy() {
        this.data = [];
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.data = this._expensesService.expensesList();
            this.dt.dataSource.data = this.data;
            console.log(this.dt.dataSource.data);
        });
    }

    editExpense(id: number) {
        console.log(id);
    }

    deleteExpense(data: ExpenseDetailsDto) {
        console.log(data);
    }
}
