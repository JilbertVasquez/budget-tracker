import { Injectable } from '@angular/core';
import { FixedExpenseDetailsDto } from '../_dtos/fixed-expenses/fixed-expenses-details-dto';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FixedExpensesForListDto } from '../_dtos/fixed-expenses/fixed-expenses-for-list-dto';
import { CreateFixedExpenseDto } from '../_dtos/fixed-expenses/create-fixed-expense-dto';
import { UpdateFixedExpenseDto } from '../_dtos/fixed-expenses/update-expense-dto';

@Injectable({
    providedIn: 'root'
})
export class FixedExpensesService {
    private _baseUrl = environment.apiUrl + '/api/fixedExpenses';

    constructor(private _http: HttpClient) { }

    getFixedExpensesList(start: string, end: string) {
        const params = {
            startDate: start,
            endDate: end
        }
        return lastValueFrom(this._http.get<FixedExpensesForListDto>(`${this._baseUrl}`, {params}));
    }

    getFixedExpense(fixedExpenseId: number) {
        return lastValueFrom(this._http.get<FixedExpenseDetailsDto>(`${this._baseUrl}/${fixedExpenseId}`));
    }

    createFixedExpense(createFixedExpenseDto: CreateFixedExpenseDto) {
        return lastValueFrom(this._http.post(this._baseUrl, createFixedExpenseDto));
    }

    updateFixedExpense(fixedExpenseId: number, updateFixedExpense: UpdateFixedExpenseDto) {
        return lastValueFrom(this._http.put(`${this._baseUrl}/${fixedExpenseId}`, updateFixedExpense));
    }

    deleteFixedExpense(fixedExpenseId: number) {
        return lastValueFrom(this._http.delete(`${this._baseUrl}/${fixedExpenseId}`));
    }
}
