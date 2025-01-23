import { CanActivateFn } from '@angular/router';
import { appAuthService } from '../_services/app-auth.service';
import { DialogService } from '../_services/dialog.service';
import { UserRole } from '../_enums/user-role';
import { inject } from '@angular/core';

export const commissionGuard: CanActivateFn = () => {
    const authService = inject(appAuthService);
    const dialogService = inject(DialogService);

    if (!authService.hasPermission(UserRole.Commissioner)) {
        dialogService.message("You don't have enough permission.");
        return false;
    }

    return true;
};
