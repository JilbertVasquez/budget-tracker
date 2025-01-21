import { CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { inject } from '@angular/core';
import { DialogService } from '../_services/dialog.service';
import { UserRole } from '../_enums/user-role';

export const savingsGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const dialogService = inject(DialogService);

    if (!authService.hasPermission(UserRole.Saver)) {
        dialogService.message("You don't have enough permission.");
        return false;
    }

    return true;
};
