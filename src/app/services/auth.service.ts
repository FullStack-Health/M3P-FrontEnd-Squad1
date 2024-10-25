import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from './authentication.service'; // Importa o novo AuthenticationService
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  onLoginSubmit(loginForm: FormGroup) {
    const email = loginForm.get('email')?.value;
    const password = loginForm.get('password')?.value;

    this.authenticationService.authenticateUser(email, password).subscribe({
      next: (user) => {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        this.router.navigate(['/home']);
      },
      error: () => {
        Swal.fire({
          text: 'Usuário ou senha inválidos',
          icon: 'error',
          confirmButtonColor: '#0A7B73',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onPasswordResetRequest(loginForm: FormGroup) {
    const email = loginForm.get('email')?.value;

    this.authenticationService.requestPasswordReset(email).subscribe({
      next: () => {
        Swal.fire({
          text: 'Sua senha foi alterada para a senha padrão: a1b2c4d4. Por favor, prossiga utilizando essa senha.',
          icon: 'success',
          confirmButtonColor: '#0A7B73',
          confirmButtonText: 'OK'
        });
      },
      error: () => {
        Swal.fire({
          text: 'Usuário não encontrado',
          icon: 'error',
          confirmButtonColor: '#0A7B73',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }
}