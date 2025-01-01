import { Inject, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { DialogService } from '../_services/dialog.service';

export const authGuard: CanActivateFn = () => {
    const authGuard = inject(AuthService);
    const dialogService = inject(DialogService);

    if (!authGuard.isLoggedIn()) {
        dialogService.message("Login first.");
        return false;
    }

    return authGuard.isLoggedIn();
};
