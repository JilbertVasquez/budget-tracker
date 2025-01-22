import {Injectable} from '@angular/core';
import {DialogService} from './dialog.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor(private _dialogService: DialogService) {}

    handle(message: any) {
        this._dialogService.error(message.error.detail);
    }
}
