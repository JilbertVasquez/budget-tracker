import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { CommissionForListDto } from '../_dtos/commissions/commission-for-list-dto';

@Injectable({
    providedIn: 'root',
})
export class CommissionService {
    private _baseUrl = environment.apiUrl + '/api/commissions';

        constructor(private _http: HttpClient) { }

        getCommissionList(start: string, end: string) {
            const params = {
                startDate: start,
                endDate: end
            }
            return lastValueFrom(this._http.get<CommissionForListDto>(`${this._baseUrl}`, { params }));
        }
}
