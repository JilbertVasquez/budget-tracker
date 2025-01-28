import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router, RouterModule} from '@angular/router';
import {UserRole} from '../_enums/user-role';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
import { AuthService } from '@auth0/auth0-angular';
import { appAuthService } from '../_services/app-auth.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        RouterModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
        AuthButtonComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
    isCommissioner: boolean = false;
    isExpenseTracker: boolean = false;
    isSaver: boolean = false;
    isSuperuser: boolean = false;

    constructor(public auth: AuthService, private _router: Router, private _appAuthService: appAuthService) {
        toObservable(this._appAuthService.isLoggedIn)
            .pipe(takeUntilDestroyed())
            .subscribe((isLoggedIn) => {
                if (isLoggedIn) {
                    this.isCommissioner = this._appAuthService.hasPermission([UserRole.Commissioner]);
                    this.isExpenseTracker = this._appAuthService.hasPermission([UserRole.ExpenseTracker]);
                    this.isSaver = this._appAuthService.hasPermission([UserRole.Saver]);
                    this.isSuperuser = this._appAuthService.hasPermission([UserRole.SuperUser]);
                }
            })
    }

    ngOnInit(): void { }

    login() {
        this._router.navigate(['/login']);
    }

    signup() {
        this._router.navigate(['/signup']);
    }

    logout() {
        localStorage.removeItem('Budget-Tracker-Token');
        // this.authService.isLoggedIn.set(false);
        this._router.navigate(['/']);
    }
}
