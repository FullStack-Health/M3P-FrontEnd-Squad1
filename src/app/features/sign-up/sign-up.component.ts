import { Component } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CustomValidatorService } from "../../shared/services/custom-validator.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";
import { ApiService } from "../../core/services/api.service";


@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  form = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      this.customValidatorService.validarNomeCompleto(),
    ]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.minLength(8),
      Validators.required,
    ]),
    confirmarPassword: new FormControl("", [
      Validators.minLength(8),
      Validators.required,
    ]),
    codigoUsuario: new FormControl(""),
    role: new FormControl("", [Validators.required]),
  });

  constructor(
    private customValidatorService: CustomValidatorService,
    private router: Router,
    private apiService: ApiService // Injetando o ApiService
  ) {}

  cadastrar() {
    if (
      this.form.valid &&
      this.form.value.password === this.form.value.confirmarPassword
    ) {
      // Definindo o objeto de dados para enviar ao backend
      const userData = {
        email: this.form.value.email,
        password: this.form.value.password,
        role: this.form.value.role
      };
  
      // Chamada ao método de cadastro da API
      this.apiService.postData("api/usuarios/pre-registro", userData).subscribe(
        (response) => {
          // Sucesso: Exibir mensagem de confirmação e redirecionar
          Swal.fire({
            text: "Cadastro efetuado com sucesso!",
            icon: "success",
            confirmButtonColor: "#0A7B73",
            confirmButtonText: "OK",
          }).then(() => {
            this.router.navigate(["/login"]);
          });
        },
        (error) => {
          if (error.status === 409) {
            // Exibir mensagem específica para erro 409 (Email já cadastrado)
            Swal.fire({
              text: "Email já cadastrado. Por favor, tente outro.",
              icon: "warning",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            });
          } else {
            // Erro genérico
            Swal.fire({
              text: "Erro ao efetuar cadastro. Tente novamente.",
              icon: "error",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            });
          }
        }
      );
    } else {
      Swal.fire({
        text: "Formulário inválido ou senhas não coincidem.",
        icon: "error",
        confirmButtonColor: "#0A7B73",
        confirmButtonText: "OK",
      });
    }
  }
  

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
