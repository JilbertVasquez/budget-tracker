import { Component, computed, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteComponent, AutoCompleteData } from '../../_shared/auto-complete/auto-complete.component';
import { PeriodDto } from '../../_dtos/periods/periodDto';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../../_services/error.service';
import { DialogService } from '../../_services/dialog.service';
import { PeriodService } from '../../_services/period.service';
import { AuthService } from '../../_services/auth.service';
import { FixedExpensesService } from '../../_services/fixed-expenses.service';
import { FixedExpenseDetailsDto } from '../../_dtos/fixed-expenses/fixed-expenses-details-dto';
import { UpdateFixedExpenseDto } from '../../_dtos/fixed-expenses/update-expense-dto';

@Component({
    selector: 'app-fixed-expenses-details',
    imports: [MatCardModule, MatFormFieldModule, MatButtonModule, FormsModule, MatInputModule, ReactiveFormsModule, AutoCompleteComponent],
    templateUrl: './fixed-expenses-details.component.html',
    styleUrl: './fixed-expenses-details.component.css'
})
export class FixedExpensesDetailsComponent {
    @ViewChild('autocompleteForPeriods') autocompleteForPeriods!: AutoCompleteComponent;
    selectedPeriod: PeriodDto | null = null;
    editForm: FormGroup;
    fixedExpenseId: number | null = null;
    isBusy = false;

    expenseDetails: FixedExpenseDetailsDto | null = null;
    autoCompleteData = computed(() => {
        const periods = this._periodService.periods();

        if (!periods.length) return [];
        return this._convertToAutoCompleteData(periods);
    })

    constructor(private _periodService: PeriodService,
            private _authService: AuthService,
            private _fixedExpensesService: FixedExpensesService,
            private _dialogService: DialogService,
            private _errorService: ErrorService,
            private _router: Router,
            private _route: ActivatedRoute
        ) {
            this.editForm = new FormGroup({
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

    async ngOnInit() {
        const expenseId = this._route.snapshot.paramMap.get('id');
        if (!expenseId) {
            this._router.navigate(['./expenses']);
            return;
        }

        this.fixedExpenseId = +expenseId;

        try {
            this.expenseDetails = await this._fixedExpensesService.getFixedExpense(this.fixedExpenseId);

            this.editForm.setValue({
                name: this.expenseDetails.name,
                description: this.expenseDetails.description,
                note: this.expenseDetails.note,
                amount: this.expenseDetails.amount,
                category: this.expenseDetails.category
            });
        }
        catch (error: any) {
            this._errorService.handle(error);
        }
    }

    onSelect(data: AutoCompleteData) {
        const period: PeriodDto = {
            periodId: data.id,
            name: data.display,
            description: data.description,
            createdAt: data.createdAt
        }
        this.selectedPeriod = period;
    }

    async submit() {
            const user = this._authService.loggedInUser();

            if (!this.editForm.valid) return this._dialogService.error("Invalid form.");
            if (!user) return this._dialogService.error("Invalid user.");
            if (!this.selectedPeriod) return this._dialogService.error("No selected period.");

            const name = this.editForm.value.name;
            const description = this.editForm.value.description;
            const note = this.editForm.value.note;
            const amount = this.editForm.value.amount;
            const category = this.editForm.value.category;

            const periodId = this.selectedPeriod!.periodId;
            const userId = user!.userid;

            const updateExpense: UpdateFixedExpenseDto = {
                name: name,
                description: description,
                note: note,
                amount: amount,
                category: category,
                periodId: periodId,
                userId: userId
            };

            try {
                await this._fixedExpensesService.updateFixedExpense(this.fixedExpenseId!, updateExpense);
                this._dialogService.message('Expense successfully updated.');
                this._router.navigate(['./expenses/fixed-expenses-list']);
            }
            catch( error: any) {
                this._errorService.handle(error);
            }
        }


    private _convertToAutoCompleteData(periods: PeriodDto[]) {
        return periods.map(x => {
            return {
                id: x.periodId,
                display: x.name,
                description: x.description,
                createdAt: x.createdAt
            }
        })
    }
}
