import { Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { ExpenseDetailsDto } from "../_dtos/expenses/expenses-details-dto";
import { ExpensesForListDto } from "../_dtos/expenses/expenses-for-list-dto";
import { CreateExpenseDto } from "../_dtos/expenses/create-expense-dto";

@Injectable({
    providedIn: "root"
})
export class ExpensesService {
    private _baseUrl = environment.apiUrl + '/api/expenses';
    expensesList = signal<ExpenseDetailsDto[]>([]);


    constructor(private _http: HttpClient, private _authService: AuthService) { }

    getExpensesList() {
        return lastValueFrom(this._http.get<ExpensesForListDto>(`${this._baseUrl}`));
    }

    async loadExpensesList() {
        const expensesList = await this.getExpensesList();
        this.expensesList.set(expensesList.expensesList);
    }

    createExpense(createExpenseDto: CreateExpenseDto) {
        return lastValueFrom(this._http.post(this._baseUrl, createExpenseDto));
    }

    deleteExpense(expenseId: number) {
        return lastValueFrom(this._http.delete(`${this._baseUrl}/${expenseId}`));
    }
}
