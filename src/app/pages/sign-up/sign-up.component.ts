import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UsuarioService } from "../../shared/services/usuario.service";

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  private Router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  userForm!: FormGroup;

  constructor() {
    this.userForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        perfil: ["", Validators.required],
        senha: ["", [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ["", Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }
  ngOnInit() {}
  passwordsMatch(control: AbstractControl) {
    const senha = control.get("senha")?.value;
    const confirmarSenha = control.get("confirmarSenha")?.value;
    return senha === confirmarSenha ? null : { senhaMismatch: true };
  }

  cadastrar() {
    if (this.userForm.valid) {
      const newUser = {
        email: this.userForm.value.email,
        password: this.userForm.value.senha,
        role: this.userForm.value.perfil,
      };

      this.usuarioService.preRegistro(newUser).subscribe({
        next: (response) => {
          console.log("Pré-cadastro bem-sucedido!", response);
          Swal.fire({
            text: "Cadastro efetuado com sucesso!",
            icon: "success",
            confirmButtonColor: "#0A7B73",
            confirmButtonText: "OK",
          }).then((result) => {
            if (this.Router.url === "/login") {
              window.location.reload();
            } else {
              this.Router.navigate(["/login"]);
            }
          });
        },
        error: (error: Error) => {
          Swal.fire({
            text: error.message,
            icon: "error",
            confirmButtonColor: "#0A7B73",
            confirmButtonText: "OK",
          });
          console.error("Erro de autenticação:", error.message);
        },
      });
    } else {
      Swal.fire({
        text: "Formulário inválido",
        icon: "error",
        confirmButtonColor: "#0A7B73",
        confirmButtonText: "OK",
      });
    }
  }

  goToLogin() {
    this.Router.navigate(["/login"]);
  }
}
