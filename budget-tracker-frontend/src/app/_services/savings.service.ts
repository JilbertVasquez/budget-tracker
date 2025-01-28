import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {SavingsForListDto} from '../_dtos/savings/savings-for-list-dto';
import {CreateSavingsDto} from '../_dtos/savings/create-savings-dto';
import {SavingsDetailsDto} from '../_dtos/savings/savings-details-dto';
import {UpdateSavingsDto} from '../_dtos/savings/update-savings-dto';
import { DateFilterDto } from '../_dtos/date/date-filter-dto';

@Injectable({
    providedIn: 'root',
})
export class SavingsService {
    private _baseUrl = environment.apiUrl + '/api/savings';
    dateRange: DateFilterDto | null = null;

    constructor(private _http: HttpClient) {}

    getSavingsList(start: string, end: string) {
        const params = {
            startDate: start,
            endDate: end,
        };
        return lastValueFrom(
            this._http.get<SavingsForListDto>(`${this._baseUrl}`, {params})
        );
    }

    getSavings(savingId: number) {
        return lastValueFrom(
            this._http.get<SavingsDetailsDto>(`${this._baseUrl}/${savingId}`)
        );
    }

    createSavings(createSavingsDto: CreateSavingsDto) {
        return lastValueFrom(this._http.post(this._baseUrl, createSavingsDto));
    }

    createWithdrawSavings(createSavingsDto: CreateSavingsDto) {
        return lastValueFrom(
            this._http.post(`${this._baseUrl}/withdraw`, createSavingsDto)
        );
    }

    updateSavings(fixedExpenseId: number, updateSavings: UpdateSavingsDto) {
        return lastValueFrom(
            this._http.put(`${this._baseUrl}/${fixedExpenseId}`, updateSavings)
        );
    }

    deleteSavings(savingsId: number) {
        return lastValueFrom(
            this._http.delete(`${this._baseUrl}/${savingsId}`)
        );
    }
}
