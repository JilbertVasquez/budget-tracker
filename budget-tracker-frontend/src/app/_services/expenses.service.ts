import { Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ExpensesForListDto } from "../_dtos/users/expenses/expenses-for-list-dto";
import { AuthService } from "./auth.service";
import { ExpenseDetailsDto } from "../_dtos/users/expenses/expenses-details-dto";

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
        console.log(expensesList);
        this.expensesList.set(expensesList.expensesList);
    }
}
