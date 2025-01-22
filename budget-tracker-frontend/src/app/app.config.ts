import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';

function getToken() {
    return localStorage.getItem('Budget-Tracker-Token');
}

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            JwtModule.forRoot({
                config: {
                    tokenGetter: getToken,
                    allowedDomains: ['localhost:5004'],
                    disallowedRoutes: [],
                },
            })
        ),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
    ],
};
