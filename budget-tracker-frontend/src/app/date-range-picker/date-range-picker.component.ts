import {Component, EventEmitter, Output} from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-date-range-picker',
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatDatepickerModule,
        ReactiveFormsModule,
    ],
    templateUrl: './date-range-picker.component.html',
    styleUrl: './date-range-picker.component.css',
    providers: [provideNativeDateAdapter(), DatePipe],
})
export class DateRangePickerComponent {
    @Output() onRangeInput = new EventEmitter();

    constructor(private datePipe: DatePipe) {}

    dateForm = new FormGroup({
        start: new FormControl<Date | null>(null, [Validators.required]),
        end: new FormControl<Date | null>(null, [Validators.required]),
    });

    async onDateInput() {
        const start = this.dateForm.controls.start.value;
        const end = this.dateForm.controls.end.value;

        this.onRangeInput.emit({start, end});
    }
}
