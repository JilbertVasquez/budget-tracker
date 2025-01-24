import {Component} from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CreateExpenseDto} from '../../_dtos/expenses/create-expense-dto';
import {appAuthService} from '../../_services/app-auth.service';
import {ExpensesService} from '../../_services/expenses.service';
import {DialogService} from '../../_services/dialog.service';
import {ErrorService} from '../../_services/error.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-create-expenses',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './create-expenses.component.html',
    styleUrl: './create-expenses.component.css',
})
export class CreateExpensesComponent {
    createForm: FormGroup;
    isBusy = false;
    withNote = false;
    withCategory = false;

    constructor(
        private _appAuthService: appAuthService,
        private _expensesService: ExpensesService,
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
        const user = this._appAuthService.loggedInUser();

        if (!this.createForm.valid)
            return this._dialogService.error('Invalid form.');
        if (!user) return this._dialogService.error('Invalid user.');

        const name = this.createForm.value.name;
        const description = this.createForm.value.description;
        const note = this.createForm.value.note;
        const amount = this.createForm.value.amount;
        const category = this.createForm.value.category;

        const userId = user!.userId;

        const createExpense: CreateExpenseDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            userId: userId,
        };

        try {
            await this._expensesService.createExpense(createExpense);
            this._dialogService.message('Expense successfully added.');
            this._route.navigate(['./expenses/expenses-list']);
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }
}
