import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {PeriodDto} from '../_dtos/periods/periodDto';
import {PeriodForListDto} from '../_dtos/periods/period-for-list-dto';

@Injectable({
    providedIn: 'root',
})
export class PeriodService {
    private _baseUrl = environment.apiUrl + '/api/periods';
    periods = signal<PeriodDto[]>([]);

    constructor(private _http: HttpClient) {}

    getPeriods() {
        return lastValueFrom(this._http.get<PeriodForListDto>(this._baseUrl));
    }

    async loadPeriods() {
        const periods = await this.getPeriods();
        this.periods.set(periods.periodList);
    }
}
