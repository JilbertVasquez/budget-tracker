import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { CommissionForListDto } from '../_dtos/commissions/commission-for-list-dto';
import { CommissionDetailsDto } from '../_dtos/commissions/commission-details-dto';
import { UpdateCommissionDto } from '../_dtos/commissions/update-commission-dto';
import { CreateCommissionDto } from '../_dtos/commissions/create-commission-dto';

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

    getCommission(commissionId: number) {
        return lastValueFrom(this._http.get<CommissionDetailsDto>(`${this._baseUrl}/${commissionId}`));
    }

    createCommission(createCommmissionDto: CreateCommissionDto) {
        return lastValueFrom(this._http.post(this._baseUrl, createCommmissionDto));
    }

    updateCommission(commissionId: number, updateCommission: UpdateCommissionDto) {
        return lastValueFrom(this._http.put(`${this._baseUrl}/${commissionId}`, updateCommission));
    }

    deleteCommission(commissionId: number) {
        return lastValueFrom(this._http.delete(`${this._baseUrl}/${commissionId}`));
    }
}
