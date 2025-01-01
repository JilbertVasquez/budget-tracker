import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { DialogService } from '../_services/dialog.service';
import { UserRole } from '../_enums/user-role';

export const expenseTrackerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
      const dialogService = inject(DialogService);

      if (!authService.getUserRoles().includes(UserRole.ExpenseTracker)) {
          dialogService.message("You don't have enough permission.");
          return false;
      }

      return true;
};
