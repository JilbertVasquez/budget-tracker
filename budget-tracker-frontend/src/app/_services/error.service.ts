import {Injectable} from '@angular/core';
import {DialogService} from './dialog.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor(private _dialogService: DialogService) {}

    handle(message: any) {
        if (message.error?.detail) {
            this._dialogService.error(message.error.detail);
        }
        else if (message.status == 403) {
            this._dialogService.error(message.statusText);
        }
        else {
            this._dialogService.error("error. something went wrong.");
        }
    }
}
