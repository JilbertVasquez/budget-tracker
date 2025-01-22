import {Component} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {SignUpDto} from '../_dtos/users/signup-dto';
import {ErrorService} from '../_services/error.service';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-signup',
    imports: [
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
})
export class SignupComponent {
    signupForm: FormGroup;
    isBusy = false;

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _errorService: ErrorService
    ) {
        this.signupForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            username: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(18),
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(18),
            ]),
        });
    }

    async submit() {
        if (this._isValidFields()) {
            const name = this.signupForm.get('name')!.value;
            const email = this.signupForm.get('email')!.value;
            const username = this.signupForm.get('username')!.value;
            const password = this.signupForm.get('password')!.value;

            const user: SignUpDto = {
                name: name,
                email: email,
                username: username,
                password: password,
            };

            try {
                await this._authService.signup(user);
                this._router.navigate(['./login']);
            } catch (error: any) {
                this._errorService.handle(error);
            } finally {
                this.isBusy = false;
            }
        }
    }

    private _isValidFields() {
        const name = this.signupForm.get('name');
        const email = this.signupForm.get('email');
        const username = this.signupForm.get('username');
        const password = this.signupForm.get('password');

        return (
            name?.valid && email?.valid && username?.valid && password?.valid
        );
    }
}
