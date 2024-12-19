import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-expenses',
  imports: [MatCardModule, MatFormFieldModule, MatButtonModule, FormsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './create-expenses.component.html',
  styleUrl: './create-expenses.component.css'
})
export class CreateExpensesComponent {
    createForm: FormGroup;
    isBusy = false;
    withNote = false;
    withCategory = false;

    constructor() {
        this.createForm = new FormGroup({
            name: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(2),
                ]
            ),
            description: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(2),
                ]
            ),
            note: new FormControl('',
                [
                    Validators.minLength(2)
                ]
            ),
            amount: new FormControl('',
                [
                    Validators.required
                ]
            ),
            category: new FormControl('',
                [
                    Validators.minLength(2),
                ]
            )
        });
    }

    toggleNote() {
        this.withNote = !this.withNote;
    }

    toggleCategory() {
        this.withCategory = !this.withCategory;
    }

    async submit() {

    }
}
