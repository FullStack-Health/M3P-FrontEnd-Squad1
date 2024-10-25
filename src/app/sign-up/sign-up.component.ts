import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorService } from '../services/custom-validator.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  form = new FormGroup({
    nome: new FormControl('', [Validators.required, this.customValidatorService.validarNomeCompleto()]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.minLength(8), Validators.required]),
    confirmarSenha: new FormControl('', [Validators.minLength(8), Validators.required]),
    codigoUsuario: new FormControl(''),
    role: new FormControl('', Validators.required)
  });

  constructor(
    private customValidatorService: CustomValidatorService,
    private router: Router,
    private userService: UserService // Injetando UserService
  ) { }

  cadastrar() {
    if (this.form.valid && this.form.value.senha === this.form.value.confirmarSenha) {
      const userCode = Math.floor(1000 + Math.random() * 9000);
      this.form.patchValue({ codigoUsuario: userCode.toString() });

      this.userService.registerUser(this.form.value).subscribe({
        next: () => {
          Swal.fire({
            text: "Cadastro efetuado com sucesso!",
            icon: "success",
            confirmButtonColor: "#0A7B73",
            confirmButtonText: "OK"
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: () => {
          Swal.fire({
            text: "Erro ao cadastrar usuário",
            icon: "error",
            confirmButtonColor: "#0A7B73",
            confirmButtonText: "OK"
          });
        }
      });
    } else {
      Swal.fire({
        text: "Formulário inválido",
        icon: "error",
        confirmButtonColor: "#0A7B73",
        confirmButtonText: "OK"
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}