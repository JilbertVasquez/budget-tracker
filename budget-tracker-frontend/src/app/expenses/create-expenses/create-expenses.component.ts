import { Component, computed, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodService } from '../../_services/period.service';
import { AutoCompleteComponent, AutoCompleteData } from '../../_shared/auto-complete/auto-complete.component';
import { PeriodDto } from '../../_dtos/periods/periodDto';
import { CreateExpenseDto } from '../../_dtos/expenses/create-expense-dto';
import { AuthService } from '../../_services/auth.service';
import { ExpensesService } from '../../_services/expenses.service';
import { DialogService } from '../../_services/dialog.service';
import { ErrorService } from '../../_services/error.service';
import { Route, Router } from '@angular/router';

@Component({
    selector: 'app-create-expenses',
    imports: [MatCardModule, MatFormFieldModule, MatButtonModule, FormsModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './create-expenses.component.html',
    styleUrl: './create-expenses.component.css'
})
export class CreateExpensesComponent {
    // @ViewChild('autocompleteForPeriods') autocompleteForPeriods!: AutoCompleteComponent;
    createForm: FormGroup;
    isBusy = false;
    withNote = false;
    withCategory = false;
    // selectedPeriod: PeriodDto | null = null;

    // autoCompleteData = computed(() => {
    //     const periods = this._periodService.periods();

    //     if (!periods.length) return [];
    //     return this._convertToAutoCompleteData(periods);
    // })

    constructor(private _periodService: PeriodService,
        private _authService: AuthService,
        private _expensesService: ExpensesService,
        private _dialogService: DialogService,
        private _errorService: ErrorService,
        private _route: Router
    ) {
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

    // onSelect(data: AutoCompleteData) {
    //     const period: PeriodDto = {
    //         periodId: data.id,
    //         name: data.display,
    //         description: data.description,
    //         createdAt: data.createdAt
    //     }
    //     // this.selectedPeriod = period;
    // }

    async submit() {
        const user = this._authService.loggedInUser();

        if (!this.createForm.valid) return this._dialogService.error("Invalid form.");
        if (!user) return this._dialogService.error("Invalid user.");
        // if (!this.selectedPeriod) return this._dialogService.error("No selected period.");

        const name = this.createForm.value.name;
        const description = this.createForm.value.description;
        const note = this.createForm.value.note;
        const amount = this.createForm.value.amount;
        const category = this.createForm.value.category;

        // const periodId = this.selectedPeriod!.periodId;
        const userId = user!.userid;

        const createExpense: CreateExpenseDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            // periodId: periodId,
            userId: userId
        };

        try {
            await this._expensesService.createExpense(createExpense);
            this._dialogService.message('Expense successfully added.');
            this._route.navigate(['./expenses/expenses-list']);
        }
        catch( error: any) {
            this._errorService.handle(error);
        }
    }

    // private _convertToAutoCompleteData(periods: PeriodDto[]) {
    //     return periods.map(x => {
    //         return {
    //             id: x.periodId,
    //             display: x.name,
    //             description: x.description,
    //             createdAt: x.createdAt
    //         }
    //     })
    // }
}
