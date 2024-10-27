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
