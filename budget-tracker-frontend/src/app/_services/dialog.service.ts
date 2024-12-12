import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root"
})

export class DialogService {
    private defailt_duration = 3000;

    constructor(private _snackBar: MatSnackBar) { }

    message(message: string) {
        this._snackBar.open(message, 'dismiss', {
            duration: this.defailt_duration
        })
    }

    error(message: string) {
        this._snackBar.open(message, 'dismiss', {
            duration: this.defailt_duration
        })
    }
}
