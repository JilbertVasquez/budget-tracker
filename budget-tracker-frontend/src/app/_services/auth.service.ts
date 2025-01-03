import { Injectable, signal } from "@angular/core"
import { environment } from "../../environments/environment"
import { UserProfileDto } from "../_dtos/users/user-profile-dto";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginDto } from "../_dtos/users/login-dto";
import { lastValueFrom } from "rxjs";
import { SignUpDto } from "../_dtos/users/signup-dto";


@Injectable({
    providedIn: "root"
})
export class AuthService {
    private _baseUrl = environment.apiUrl + '/api/users';
    private _BudgetTrackerTokenKey = 'Budget-Tracker-Token';
    isLoggedIn = signal(false);
    loggedInUser = signal<UserProfileDto | null>(null);

    constructor(private _http: HttpClient, private _jwtHelper: JwtHelperService) {
        const token = this._getToken();
        if (!token) return;
        this.isLoggedIn.set(!this._jwtHelper.isTokenExpired(token));
        this.getUser();
        this.getUserRoles();
    }

    signup(dto: SignUpDto) {
        return lastValueFrom(this._http.post(this._baseUrl + '/register', dto));
    }

    login(dto: LoginDto) {
        return lastValueFrom(this._http.post(this._baseUrl + "/login", dto));
    }

    getUser() {
        const token = this._getToken();
        if (!token) return null;

        const user = this._decodeToken(token);
        const userProfile: UserProfileDto = {
            userid: user.nameid,
            username: user.unique_name,
            userRoles: user.role
        };

        return this.loggedInUser.set(userProfile);
    }

    getUserRoles(): string[] {
        const userRoles = this.loggedInUser()?.userRoles;

        return userRoles ? userRoles : [];

    }

    private _getToken() {
        return localStorage.getItem(this._BudgetTrackerTokenKey);
    }

    private _decodeToken(token: string) {
        return this._jwtHelper.decodeToken(token);
    }
}
