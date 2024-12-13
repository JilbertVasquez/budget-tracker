import { Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ExpensesForListDto } from "../_dtos/users/expenses/expenses-for-list-dto";
import { AuthService } from "./auth.service";
import { ExpensesRequestDto } from "../_dtos/users/expenses/expenses-request-dto";
import { ExpenseDetailsDto } from "../_dtos/users/expenses/expenses-details-dto";

@Injectable({
    providedIn: "root"
})
export class ExpensesService {
    private _baseUrl = environment.apiUrl + '/api/expenses';
    expensesList = signal<ExpenseDetailsDto[]>([]);


    constructor(private _http: HttpClient, private _authService: AuthService) { }

    getExpensesList() {
        // const request: ExpensesRequestDto = {
        //     userId: this._authService.loggedInUser()?.userid!
        // };
        // const userId = this._authService.loggedInUser()?.userid!;
        // const id = userId.toString();
        // console.log(id);

        // still figuring out how to fix passing the userId

        const params = new HttpParams().set('userId', 1);
        return lastValueFrom(this._http.get<ExpensesForListDto>(`${this._baseUrl}`, {params}));
    }

    async loadExpensesList() {
        const expensesList = await this.getExpensesList();
        console.log(expensesList);
        this.expensesList.set(expensesList.expensesList);
    }
}
