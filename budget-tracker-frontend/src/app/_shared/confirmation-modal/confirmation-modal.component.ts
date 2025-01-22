import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-modal',
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './confirmation-modal.component.html',
    styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
    constructor(
        private _dialogRef: MatDialogRef<ConfirmationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {message: string}
    ) {}

    confirm() {
        this._dialogRef.close(true);
    }

    cancel() {
        this._dialogRef.close(false);
    }
}
