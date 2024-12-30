import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { SavingsForListDto } from '../_dtos/savings/savings-for-list-dto';
import { CreateSavingsDto } from '../_dtos/savings/create-savings-dto';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {
    private _baseUrl = environment.apiUrl + '/api/savings';

    constructor(private _http: HttpClient) { }

    getSavingsList(start: string, end: string) {
        const params = {
            startDate: start,
            endDate: end
        }
        return lastValueFrom(this._http.get<SavingsForListDto>(`${this._baseUrl}`, {params}));
    }

    createSavings(createSavingsDto: CreateSavingsDto) {
        return lastValueFrom(this._http.post(this._baseUrl, createSavingsDto));
    }
}
