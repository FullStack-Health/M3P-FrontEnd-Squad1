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
import { UsuarioService } from "../../shared/services/usuario.service";
import { MessageService } from "../../shared/services/message.service";
import { PreUser } from "../../shared/interfaces/pre-user";

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

  private createForm() {
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

  private passwordsMatch(control: AbstractControl) {
    const senha = control.get("senha")?.value;
    const confirmarSenha = control.get("confirmarSenha")?.value;
    return senha === confirmarSenha ? null : { senhaMismatch: true };
  }

  cadastrar() {
    if (this.userForm.valid) {
      const newUser: PreUser = {
        email: this.userForm.value.email,
        password: this.userForm.value.senha,
        role: this.userForm.value.perfil,
      };

      this.usuarioService.addPreRegistro(newUser).subscribe({
        next: (response) => {
          this.messageService
            .showSuccess("Cadastro realizado com sucesso")
            .then(() => {
              if (this.router.url === "/login") {
                this.reload();
              } else {
                this.goToLogin();
              }
            });
        },
        error: (error: Error) => {
          this.messageService.showError(error.message);
          console.error("Erro de autenticação:", error.message);
        },
      });
    } else {
      this.messageService.showError("Formulário inválido");
    }
  }

  private reload() {
    window.location.reload();
  }

  private goToLogin() {
    this.router.navigate(["/login"]);
  }
}
