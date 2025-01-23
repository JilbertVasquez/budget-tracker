import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { appAuthService } from '../_services/app-auth.service';
import { DialogService } from '../_services/dialog.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(appAuthService);
    const dialogService = inject(DialogService);

    if (!authService.isLoggedIn()) {
        dialogService.message("Login first.");
        return false;
    }

    return authService.isLoggedIn();
};
