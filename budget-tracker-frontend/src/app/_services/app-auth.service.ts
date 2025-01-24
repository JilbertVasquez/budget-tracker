import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {UserProfileDto} from '../_dtos/users/user-profile-dto';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LoginDto} from '../_dtos/users/login-dto';
import {lastValueFrom} from 'rxjs';
import {SignUpDto} from '../_dtos/users/signup-dto';
import {UserRole} from '../_enums/user-role';
import { AuthService } from '@auth0/auth0-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class appAuthService {
    private _jwtHelper = new JwtHelperService();
    private _baseUrl = environment.apiUrl + '/api/users';
    private _BudgetTrackerTokenKey = 'Budget-Tracker-Token';
    isLoggedIn = signal(false);
    loggedInUser = signal<UserProfileDto | null>(null);

    constructor(
        private _http: HttpClient,
        private _auth: AuthService
    ) {
        this._auth.isAuthenticated$
            .pipe(takeUntilDestroyed())
            .subscribe((isLoggedIn) => {
                if (isLoggedIn) {
                    this._initialize();
                }
            })
        // const token = this._getToken();
        // if (!token) return;
        // this.isLoggedIn.set(!this._jwtHelper.isTokenExpired(token));
        // this.getUser();
        // this._getUserRoles();
    }

    private async _initialize() {
        const token = await lastValueFrom(this._auth.getAccessTokenSilently());
        const isTokenExpired = this._jwtHelper.isTokenExpired(token);

        if (token && !isTokenExpired) {
            const decodedToken = this._jwtHelper.decodeToken(token);
            const userProfile: UserProfileDto = {
                userId: decodedToken.sub,
                name: decodedToken.name,
                username: decodedToken.username,
                email: decodedToken.email,
                userPermissions: decodedToken.permissions,
            };
            this.loggedInUser.set(userProfile);
            this.isLoggedIn.set(true);
        }
    }

    // signup(dto: SignUpDto) {
    //     return lastValueFrom(this._http.post(this._baseUrl + '/register', dto));
    // }

    // login(dto: LoginDto) {
    //     return lastValueFrom(this._http.post(this._baseUrl + '/login', dto));
    // }

    // getUser() {
    //     const token = this._getToken();
    //     if (!token) return null;

    //     const user = this._decodeToken(token);
    //     const userProfile: UserProfileDto = {
    //         userid: user.nameid,
    //         username: user.unique_name,
    //         userRoles: user.role,
    //     };

    //     return this.loggedInUser.set(userProfile);
    // }

    // hasPermission(role: string) {
    //     const userRoles = this._getUserRoles();

    //     if (!userRoles.length) return false;

    //     if (userRoles.includes(UserRole.SuperUser)) return true;

    //     return userRoles.includes(role);
    // }

    hasPermission(role: string) {
        return true;
    }

    // private _getUserRoles(): string[] {
    //     const userRoles = this.loggedInUser()?.userRoles;

    //     return userRoles ? userRoles : [];
    // }

    // private _getToken() {
    //     return localStorage.getItem(this._BudgetTrackerTokenKey);
    // }

    // private _decodeToken(token: string) {
    //     return this._jwtHelper.decodeToken(token);
    // }
}
