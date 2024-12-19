import {Component, computed, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild} from '@angular/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-auto-complete',
    imports: [MatAutocompleteModule, MatFormFieldModule, MatSelectModule, MatOptionModule, FormsModule,CommonModule, ReactiveFormsModule, MatInputModule],
    templateUrl: './auto-complete.component.html',
    styleUrl: './auto-complete.component.css',
})
export class AutoCompleteComponent implements OnInit, OnDestroy {
    @Output() onSelectEvent = new EventEmitter();
    // @ViewChild('input') input!: MatInput;
    @Input({ required: true}) data!: AutoCompleteData[];
    @Input({ required: true}) label!: string;

    @Input() showLoading = false;
    @Input() isAvailable = true;
    loadingText = 'Busy...';

    filteredData = computed(() => this._filter(this.inputValue()));
    inputValue = signal('');

    constructor() { }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.inputValue.set('');
    }

    onSelect(selection: AutoCompleteData) {
        this.onSelectEvent.emit(selection);
    }

    displayFn(data?: AutoCompleteData) {
        return data?.display ?? '';
    }

    private _filter(value: string) {
        if (!value.length || !this.data.length) return;
        const filterValue = value.toString().toLowerCase();
        return this.data.filter(x => x.display.toLowerCase().includes(filterValue));
    }
}


export interface AutoCompleteData {
    id: number,
    display: string,
    description?: string,
    createdAt: string
}
