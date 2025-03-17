import { CanActivateFn } from '@angular/router';
import { appAuthService } from '../_services/app-auth.service';
import { inject } from '@angular/core';
import { DialogService } from '../_services/dialog.service';
import { UserRole } from '../_enums/user-role';

export const savingsGuard: CanActivateFn = (route) => {
    const authService = inject(appAuthService);
    const dialogService = inject(DialogService);

    const permissions = route.data['permissions'] as string[];

    if (!authService.hasPermission(permissions)) {
        dialogService.message("You don't have enough permission.");
        return false;
    }

    return true;
};
