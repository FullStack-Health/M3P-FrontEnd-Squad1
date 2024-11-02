import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoggedUserService } from '../services/logged-user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const loggedUserService = inject(LoggedUserService);
  const userRole = loggedUserService.getUserRole();
  
  if (state.url === '/home') {
    if (userRole === 'MEDICO' || userRole === 'ADMIN') {
      return true; 
    }
    if (userRole === 'PACIENTE') {
      const patientId = loggedUserService.getPacienteId();
      window.location.href = `/prontuario/${patientId}`;
      return false; 
    }
  }
  return true;
};