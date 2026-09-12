import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const taskboardGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authenticated = sessionStorage.getItem('taskboard_auth') === 'true';
  if (!authenticated) {
    router.navigate(['/taskboard-login']);
    return false;
  }
  return true;
};
