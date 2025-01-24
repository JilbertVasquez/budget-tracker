import {Component} from '@angular/core';
import {CreateSavingsDto} from '../../_dtos/savings/create-savings-dto';
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
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
    selector: 'app-create-savings',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './create-savings.component.html',
    styleUrl: './create-savings.component.css',
})
export class CreateSavingsComponent {
    createForm: FormGroup;
    isBusy = false;
    withNote = false;
    withCategory = false;

    constructor(
        private _appAuthService: appAuthService,
        private _savingsService: SavingsService,
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

        const createSavings: CreateSavingsDto = {
            name: name,
            description: description,
            note: note,
            amount: amount,
            category: category,
            userId: userId,
        };

        try {
            await this._savingsService.createSavings(createSavings);
            this._dialogService.message('Savings successfully added.');
            this._route.navigate(['./savings/savings-list']);
        } catch (error: any) {
            this._errorService.handle(error);
        }
    }
}
