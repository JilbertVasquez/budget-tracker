import { CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { DialogService } from '../_services/dialog.service';
import { UserRole } from '../_enums/user-role';
import { inject } from '@angular/core';

export const commissionGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const dialogService = inject(DialogService);

    if (!authService.hasPermission(UserRole.Commissioner)) {
        dialogService.message("You don't have enough permission.");
        return false;
    }

    return true;
};
