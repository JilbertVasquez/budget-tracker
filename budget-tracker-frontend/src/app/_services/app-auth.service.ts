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
import { Permission } from '../_enums/permission';

@Injectable({
    providedIn: 'root',
})
export class appAuthService {
    private _jwtHelper = new JwtHelperService();
    private _baseUrl = environment.apiUrl + '/api/users';
    private _BudgetTrackerTokenKey = 'Budget-Tracker-Token';
    private _userPermissionsStrorageName = 'Budget-Tracker-User-Permissions';
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
                else {
                    localStorage.removeItem(this._userPermissionsStrorageName);
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
                userPermissions: decodedToken.permissions as string[],
            };

            this.loggedInUser.set(userProfile);

            const userPermissions = this.loggedInUser()?.userPermissions;
            localStorage.setItem(this._userPermissionsStrorageName, JSON.stringify(userPermissions));
            await this._checkAndSaveUser();
            this.isLoggedIn.set(true);
        }
    }

    private _checkAndSaveUser() {
        return lastValueFrom(this._http.post(this._baseUrl + '/check-and-save-user', this.loggedInUser()));
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

    hasPermission(permission: string[], requiredAll: boolean = true) {
        if (!this.isLoggedIn || this.loggedInUser == null) return false;
        if (this.isSuperUser()) return true;

        const userPermissions = this.getUserPermissions();

        if (requiredAll) {
            return permission.every(per => this._checkPermission(userPermissions, per));
        }
        else {
            return permission.some(per => this._checkPermission(userPermissions, per));
        }
    }

    private _checkPermission(userPermissions: string[], permission: string) {
        return userPermissions.includes(permission);
    }

    isSuperUser() {
        const userPermissions = this.getUserPermissions();

        if (!userPermissions || !userPermissions.length) return false;

        return userPermissions.includes(Permission.SuperUser);
    }

    getUserPermissions() {
        try
        {
            const localStorageUserPermissions = localStorage.getItem(this._userPermissionsStrorageName);
            const userPermissions = localStorageUserPermissions ? JSON.parse(localStorageUserPermissions) : [];
            return userPermissions;
        }
        catch (error) {
            return [];
        }
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
