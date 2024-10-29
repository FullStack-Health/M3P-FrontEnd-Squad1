import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import Swal from "sweetalert2";
import { UsuarioService } from "../../shared/services/usuario.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  loginForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    // if (this.loginForm.valid) {

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log("Login bem-sucedido!", response);
        this.router.navigate(["/home"]);
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
    // }
  }

  esqueciSenha() {
    Swal.fire({
      title: "Redefinir Senha",
      html: `
        <input type="email" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="newPassword" class="swal2-input" placeholder="Nova Senha">
      `,
      confirmButtonText: "Enviar",
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const email = (
          Swal.getPopup()?.querySelector("#email") as HTMLInputElement
        ).value;
        const newPassword = (
          Swal.getPopup()?.querySelector("#newPassword") as HTMLInputElement
        ).value;

        if (!email || !newPassword) {
          Swal.showValidationMessage("Por favor, preencha todos os campos");
          return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          Swal.showValidationMessage("Insira um e-mail válido");
          return;
        }

        if (newPassword.length < 8) {
          Swal.showValidationMessage(
            "A senha deve conter ao menos 8 caracteres"
          );
        }

        return { email, newPassword };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { email, newPassword } = result.value!;
        this.usuarioService.redefinirSenha({ email, newPassword }).subscribe({
          next: () => {
            Swal.fire({
              text: "Senha redefinida com sucesso!",
              icon: "success",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            });
          },
          error: (error) => {
            Swal.fire({
              text: `Erro: ${error.message}`,
              icon: "error",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  }
}
