import {Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {AuthService} from '@auth0/auth0-angular';

@Component({
    selector: 'app-auth-button',
    imports: [MatButtonModule],
    template: '<button mat-button class="w-full" (click)="auth.loginWithRedirect()">Log in</button>',
    standalone: true,
})
export class AuthButtonComponent {
    constructor(public auth: AuthService) { }
}
