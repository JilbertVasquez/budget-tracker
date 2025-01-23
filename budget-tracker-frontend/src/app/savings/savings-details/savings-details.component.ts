import {Component} from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {appAuthService} from '../../_services/app-auth.service';
import {SavingsService} from '../../_services/savings.service';
import {DialogService} from '../../_services/dialog.service';
import {ErrorService} from '../../_services/error.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SavingsDetailsDto} from '../../_dtos/savings/savings-details-dto';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {UpdateSavingseDto} from '../../_dtos/savings/update-savings-dto';

@Component({
    selector: 'app-savings-details',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './savings-details.component.html',
    styleUrl: './savings-details.component.css',
})
export class SavingsDetailsComponent {
    editForm: FormGroup;
    savingId: number | null = null;
    isBusy = false;

    savingsDetails: SavingsDetailsDto | null = null;

    constructor(
        private _appAuthService: appAuthService,
        private _savingsService: SavingsService,
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
            this._router.navigate(['./savings']);
            return;
        }

        this.savingId = +expenseId;

        try {
            this.savingsDetails = await this._savingsService.getSavings(
                this.savingId
            );

            this.editForm.setValue({
                name: this.savingsDetails.name,
                description: this.savingsDetails.description,
                note: this.savingsDetails.note,
                amount: this.savingsDetails.amount,
                category: this.savingsDetails.category,
            });
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }

    async submit() {
        const user = this._appAuthService.loggedInUser();

        if (!this.editForm.valid)
            return this._dialogService.error('Invalid form.');
        if (!user) return this._dialogService.error('Invalid user.');

        const name = this.editForm.value.name;
        const description = this.editForm.value.description;
        const note = this.editForm.value.note;
        const amount = this.editForm.value.amount;
        const category = this.editForm.value.category;

        const userId = user!.userid;

        const updateExpense: UpdateSavingseDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            userId: userId,
        };

        try {
            await this._savingsService.updateSavings(
                this.savingId!,
                updateExpense
            );
            this._dialogService.message('Savings successfully updated.');
            this._router.navigate(['./savings/savings-list']);
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }
}
