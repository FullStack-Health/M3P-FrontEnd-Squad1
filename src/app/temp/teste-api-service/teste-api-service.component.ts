import { Component, inject } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { HttpClient } from "@angular/common/http";
import { UsuarioService } from "../../shared/services/usuario.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-teste-api-service",
  standalone: true,
  imports: [],
  templateUrl: "./teste-api-service.component.html",
  styleUrl: "./teste-api-service.component.scss",
})
export class TesteApiServiceComponent {
  private usuarioService = inject(UsuarioService);

  constructor() {}

  teste(): void {
    const credentials = {
      email: "admin@example.com",
      newPassword: "123123123",
    };
    this.usuarioService.redefinirSenha(credentials).subscribe({
      next: (response) => {
        console.log("senha alterada!", response);
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
  }
}
