import { Injectable, signal } from '@angular/core';
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
    fixedExpensesList = signal<FixedExpenseDetailsDto[]>([]);

    constructor(private _http: HttpClient) { }

    getFixedExpensesList() {
        return lastValueFrom(this._http.get<FixedExpensesForListDto>(`${this._baseUrl}`));
    }

    getFixedExpense(fixedExpenseId: number) {
        return lastValueFrom(this._http.get<FixedExpenseDetailsDto>(`${this._baseUrl}/${fixedExpenseId}`));
    }

    async loadFixedExpensesList() {
        const fixedExpensesList = await this.getFixedExpensesList();
        this.fixedExpensesList.set(fixedExpensesList.fixedExpensesList);
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
