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
import {CommissionDetailsDto} from '../../_dtos/commissions/commission-details-dto';
import {appAuthService} from '../../_services/app-auth.service';
import {CommissionService} from '../../_services/commission.service';
import {DialogService} from '../../_services/dialog.service';
import {ErrorService} from '../../_services/error.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UpdateCommissionDto} from '../../_dtos/commissions/update-commission-dto';

@Component({
    selector: 'app-commission-details',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './commission-details.component.html',
    styleUrl: './commission-details.component.css',
})
export class CommissionDetailsComponent {
    editForm: FormGroup;
    commissionId: number | null = null;
    isBusy = false;

    commissionDetails: CommissionDetailsDto | null = null;

    constructor(
        private _appAuthService: appAuthService,
        private _commissionService: CommissionService,
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
            this._router.navigate(['./commissions']);
            return;
        }

        this.commissionId = +expenseId;

        try {
            this.commissionDetails =
                await this._commissionService.getCommission(this.commissionId);

            this.editForm.setValue({
                name: this.commissionDetails.name,
                description: this.commissionDetails.description,
                note: this.commissionDetails.note,
                amount: this.commissionDetails.amount,
                category: this.commissionDetails.category,
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

        const userId = user!.userId;

        const updateExpense: UpdateCommissionDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            userId: userId,
        };

        try {
            await this._commissionService.updateCommission(
                this.commissionId!,
                updateExpense
            );
            this._dialogService.message('Commission successfully updated.');
            this._router.navigate(['./commissions/commission-list']);
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }
}
