import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service'; // Certifique-se de que o nome está correto
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Extraindo os dados do formulário
      this.authService.authenticateUser(email, password).subscribe({
        next: (user) => {
          localStorage.setItem('loggedUser', JSON.stringify(user));
          this.router.navigate(['/home']);
        },
        error: () => {
          alert('Usuário ou senha inválidos');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  esqueciSenha() {
    if (this.loginForm.get('email')?.valid) {
      this.authService.requestPasswordReset(this.loginForm.get('email')?.value).subscribe({
        next: () => {
          alert('Instruções para recuperação de senha foram enviadas para o seu email.');
        },
        error: () => {
          alert('Usuário não encontrado.');
        }
      });
    } else {
      alert('Por favor, insira um email válido.');
    }
  }

}