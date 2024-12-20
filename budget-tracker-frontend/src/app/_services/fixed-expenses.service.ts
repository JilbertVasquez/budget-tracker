import { Injectable, signal } from '@angular/core';
import { FixedExpenseDetailsDto } from '../_dtos/fixed-expenses/fixed-expenses-details-dto';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FixedExpensesForListDto } from '../_dtos/fixed-expenses/fixed-expenses-for-list-dto';

@Injectable({
  providedIn: 'root'
})
export class FixedExpensesService {
    private _baseUrl = environment.apiUrl + '/api/fixedExpenses';
    fixedExpensesList = signal<FixedExpenseDetailsDto[]>([]);

    constructor(private _http: HttpClient) { }

    getFixedExpensesList() {
        return lastValueFrom(this._http.get<FixedExpensesForListDto>(`${this._baseUrl}`));
    }

    async loadFixedExpensesList() {
        const expensesList = await this.getFixedExpensesList();
        this.fixedExpensesList.set(expensesList.expensesList);
    }
}
