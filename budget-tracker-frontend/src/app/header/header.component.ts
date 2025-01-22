import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {UserRole} from '../_enums/user-role';

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
    styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
    isCommissioner: boolean = false;
    isExpenseTracker: boolean = false;
    isSaver: boolean = false;
    isSuperuser: boolean = false;

    constructor(public authService: AuthService, private _router: Router) {}

    ngOnInit(): void {
        this.isCommissioner = this.authService.hasPermission(
            UserRole.Commissioner
        );
        this.isExpenseTracker = this.authService.hasPermission(
            UserRole.ExpenseTracker
        );
        this.isSaver = this.authService.hasPermission(UserRole.Saver);
        this.isSuperuser = this.authService.hasPermission(UserRole.SuperUser);
    }

    login() {
        this._router.navigate(['/login']);
    }

    signup() {
        this._router.navigate(['/signup']);
    }

    logout() {
        localStorage.removeItem('Budget-Tracker-Token');
        this.authService.isLoggedIn.set(false);
        this._router.navigate(['/']);
    }
}
