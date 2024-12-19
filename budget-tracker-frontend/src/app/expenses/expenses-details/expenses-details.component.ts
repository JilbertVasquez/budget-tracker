import {Component, computed, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteComponent, AutoCompleteData } from '../../_shared/auto-complete/auto-complete.component';
import { PeriodService } from '../../_services/period.service';
import { AuthService } from '../../_services/auth.service';
import { ExpensesService } from '../../_services/expenses.service';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodDto } from '../../_dtos/periods/periodDto';
import { ExpenseDetailsDto } from '../../_dtos/expenses/expenses-details-dto';
import { UpdateExpenseDto } from '../../_dtos/expenses/update-expense-dto';

@Component({
    selector: 'app-expenses-details',
    imports: [MatCardModule, MatFormFieldModule, MatButtonModule, FormsModule, MatInputModule, ReactiveFormsModule, AutoCompleteComponent],
    templateUrl: './expenses-details.component.html',
    styleUrl: './expenses-details.component.css',
})
export class ExpensesDetailsComponent {
    @ViewChild('autocompleteForPeriods') autocompleteForPeriods!: AutoCompleteComponent;
    selectedPeriod: PeriodDto | null = null;
    editForm: FormGroup;
    expenseId: number | null = null;
    isBusy = false;

    expenseDetails: ExpenseDetailsDto | null = null;
    autoCompleteData = computed(() => {
        const periods = this._periodService.periods();

        if (!periods.length) return [];
        return this._convertToAutoCompleteData(periods);
    })

    constructor(private _periodService: PeriodService,
            private _authService: AuthService,
            private _expensesservice: ExpensesService,
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

        this.expenseId = +expenseId;

        try {
            this.expenseDetails = await this._expensesservice.getExpense(this.expenseId);

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

            const updateExpense: UpdateExpenseDto = {
                name: name,
                description: description,
                note: note,
                amount: amount,
                category: category,
                periodId: periodId,
                userId: userId
            };

            try {
                await this._expensesservice.updateExpense(this.expenseId!, updateExpense);
                this._dialogService.message('Expense successfully updated.');
                this._router.navigate(['./expenses/expenses-list']);
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
