import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
// import {JwtModule} from '@auth0/angular-jwt';
import {AuthHttpInterceptor, AuthModule} from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { JwtModule } from '@auth0/angular-jwt';

function getToken() {
    return localStorage.getItem('Budget-Tracker-Token');
}

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            // JwtModule.forRoot({
            //     config: {
            //         tokenGetter: getToken,
            //         allowedDomains: ['localhost:5004'],
            //         disallowedRoutes: [],
            //     },
            // })
            AuthModule.forRoot({
                domain: environment.auth0Domain,
                clientId: environment.auth0ClientId,
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: environment.auth0Audience
                },
                httpInterceptor: {
                    allowedList: [{
                        uri: `${environment.apiUrl}/*`,
                        tokenOptions: {
                            authorizationParams: {
                                redirect_uri: window.location.origin
                            }
                        }
                    }]
                }
            })
        ),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
    ],
};
