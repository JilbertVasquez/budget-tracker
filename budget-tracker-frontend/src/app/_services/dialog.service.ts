import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmationModalComponent} from '../_shared/confirmation-modal/confirmation-modal.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private defailt_duration = 3000;

    constructor(private _snackBar: MatSnackBar, private _modal: MatDialog) {}

    message(message: string) {
        this._snackBar.open(message, 'dismiss', {
            duration: this.defailt_duration,
        });
    }

    error(message: string) {
        this._snackBar.open(message, 'dismiss', {
            duration: this.defailt_duration,
        });
    }

    confirmationModal(
        message: string
    ): MatDialogRef<ConfirmationModalComponent> {
        return this._modal.open(ConfirmationModalComponent, {
            data: {message: message},
        });
    }
}
