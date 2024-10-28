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
    password: new FormControl("", [Validators.minLength(8), Validators.required]),
    confirmarPassword: new FormControl("", [
      Validators.minLength(8),
      Validators.required,
    ]),
    codigoUsuario: new FormControl(""),
    role: new FormControl ("", [Validators.required]) 
  });

  constructor(
    private customValidatorService: CustomValidatorService,
    private Router: Router
  ) {}

  cadastrar() {
    const listaUsers = localStorage.getItem("cadastroData");
    const users = listaUsers ? JSON.parse(listaUsers) : [];

    const existingUser = users.find(
      (user: any) => user.email === this.form.value.email
    );

    if (existingUser) {
      alert("User already exists.");
    } else {
      if (
        this.form.valid &&
        this.form.value.password === this.form.value.confirmarPassword
      ) {
        const userCode = Math.floor(1000 + Math.random() * 9000);
        this.form.patchValue({ codigoUsuario: userCode.toString() });

        users.push(this.form.value);
        localStorage.setItem("cadastroData", JSON.stringify(users));

        this.form.controls["name"].setValue("");
        this.form.controls["email"].setValue("");
        this.form.controls["role"].setValue("");
        this.form.controls["password"].setValue("");
        this.form.controls["confirmarPassword"].setValue("");

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
  }

  goToLogin() {
    this.Router.navigate(["/login"]);
  }
}
