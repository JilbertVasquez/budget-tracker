import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginDto } from '../_dtos/users/login-dto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../_services/error.service';

@Component({
    selector: 'app-login',
    imports: [MatCardModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    isBusy = false;

    constructor(private _authService: AuthService, private _router: Router, private _errorService: ErrorService) {
        this.loginForm = new FormGroup({
            username: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(18)
                ]),
            password: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(18)
                ])
        });
    }

    async submit() {
        if (this._isValidFields()) {
            const username = this.loginForm.get('username')!.value;
            const password = this.loginForm.get('password')!.value;;

            const user: LoginDto = {
                username: username,
                password: password
            };

            try
            {
                const response: any = await this._authService.login(user);
                localStorage.setItem('Budget-Tracker-Token', response);
                this._authService.getUser();
                this._authService.isLoggedIn.set(true);
                this._router.navigate(['/']);
            }
            catch (error: any) {
                this._errorService.handle(error);
            }
            finally {
                this.isBusy = false;
            }
        }
    }

    private _isValidFields() {
        const username = this.loginForm.get('username');
        const password = this.loginForm.get('password');

        return username?.valid && password?.valid;
    }

}
