import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from '../../_services/auth.service';
import {FixedExpensesService} from '../../_services/fixed-expenses.service';
import {DialogService} from '../../_services/dialog.service';
import {ErrorService} from '../../_services/error.service';
import {Router} from '@angular/router';
import {CreateFixedExpenseDto} from '../../_dtos/fixed-expenses/create-fixed-expense-dto';

@Component({
    selector: 'app-create-fixed-expenses',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './create-fixed-expenses.component.html',
    styleUrl: './create-fixed-expenses.component.css',
})
export class CreateFixedExpensesComponent {
    createForm: FormGroup;
    isBusy = false;
    withNote = false;
    withCategory = false;

    constructor(
        private _authService: AuthService,
        private _fixedExpensesService: FixedExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _route: Router
    ) {
        this.createForm = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
            ]),
            description: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
            ]),
            note: new FormControl('', [Validators.minLength(2)]),
            amount: new FormControl('', [Validators.required]),
            category: new FormControl('', [Validators.minLength(2)]),
        });
    }

    toggleNote() {
        this.withNote = !this.withNote;
    }

    toggleCategory() {
        this.withCategory = !this.withCategory;
    }

    async submit() {
        const user = this._authService.loggedInUser();

        if (!this.createForm.valid)
            return this._dialogService.error('Invalid form.');
        if (!user) return this._dialogService.error('Invalid user.');

        const name = this.createForm.value.name;
        const description = this.createForm.value.description;
        const note = this.createForm.value.note;
        const amount = this.createForm.value.amount;
        const category = this.createForm.value.category;

        const userId = user!.userid;

        const createFixedExpense: CreateFixedExpenseDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            userId: userId,
        };

        try {
            await this._fixedExpensesService.createFixedExpense(
                createFixedExpense
            );
            this._dialogService.message('Fixed expense successfully added.');
            this._route.navigate(['./expenses/fixed-expenses-list']);
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }
}
