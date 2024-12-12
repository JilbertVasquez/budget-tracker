import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        RouterModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    constructor(public authService: AuthService, private _router: Router) { }

    login() {
        this._router.navigate(['/login']);
    };

    signup() {
        this._router.navigate(["/signup"]);
    }

    logout() {
        localStorage.removeItem('Budget-Tracker-Token');
        this.authService.isLoggedIn.set(false);
        this._router.navigate(['/']);
    }
}
