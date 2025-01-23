import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { DialogService } from '../_services/dialog.service';
import { AuthService } from '@auth0/auth0-angular';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const dialogService = inject(DialogService);

    if (!auth.isAuthenticated$) {
        dialogService.message("Login first.");
        return false;
    }

    return auth.isAuthenticated$;
};
