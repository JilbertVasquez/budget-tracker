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
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorService} from '../../_services/error.service';
import {DialogService} from '../../_services/dialog.service';
import {AuthService} from '../../_services/auth.service';
import {FixedExpensesService} from '../../_services/fixed-expenses.service';
import {FixedExpenseDetailsDto} from '../../_dtos/fixed-expenses/fixed-expenses-details-dto';
import {UpdateFixedExpenseDto} from '../../_dtos/fixed-expenses/update-expense-dto';

@Component({
    selector: 'app-fixed-expenses-details',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './fixed-expenses-details.component.html',
    styleUrl: './fixed-expenses-details.component.css',
})
export class FixedExpensesDetailsComponent {
    editForm: FormGroup;
    fixedExpenseId: number | null = null;
    isBusy = false;

    expenseDetails: FixedExpenseDetailsDto | null = null;

    constructor(
        private _authService: AuthService,
        private _fixedExpensesService: FixedExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _router: Router,
        private _route: ActivatedRoute
    ) {
        this.editForm = new FormGroup({
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

    async ngOnInit() {
        const expenseId = this._route.snapshot.paramMap.get('id');
        if (!expenseId) {
            this._router.navigate(['./expenses']);
            return;
        }

        this.fixedExpenseId = +expenseId;

        try {
            this.expenseDetails =
                await this._fixedExpensesService.getFixedExpense(
                    this.fixedExpenseId
                );

            this.editForm.setValue({
                name: this.expenseDetails.name,
                description: this.expenseDetails.description,
                note: this.expenseDetails.note,
                amount: this.expenseDetails.amount,
                category: this.expenseDetails.category,
            });
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }

    async submit() {
        const user = this._authService.loggedInUser();

        if (!this.editForm.valid)
            return this._dialogService.error('Invalid form.');
        if (!user) return this._dialogService.error('Invalid user.');

        const name = this.editForm.value.name;
        const description = this.editForm.value.description;
        const note = this.editForm.value.note;
        const amount = this.editForm.value.amount;
        const category = this.editForm.value.category;

        const userId = user!.userid;

        const updateExpense: UpdateFixedExpenseDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            userId: userId,
        };

        try {
            await this._fixedExpensesService.updateFixedExpense(
                this.fixedExpenseId!,
                updateExpense
            );
            this._dialogService.message('Expense successfully updated.');
            this._router.navigate(['./expenses/fixed-expenses-list']);
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }
}
