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
import { MessageService } from "../../shared/services/message.service";

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);

  userForm!: FormGroup;

  constructor() {}
  ngOnInit() {
    this.createForm();
  }

  createForm() {
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

      this.usuarioService.addPreRegistro(newUser).subscribe({
        next: (response) => {
          this.messageService.showSuccess(response.message).then(() => {
            if (this.router.url === "/login") {
              window.location.reload();
            } else {
              this.router.navigate(["/login"]);
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
    this.router.navigate(["/login"]);
  }
}
