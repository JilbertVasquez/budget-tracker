import { CanActivateFn } from '@angular/router';

export const commissionGuard: CanActivateFn = (route, state) => {
  return true;
};
