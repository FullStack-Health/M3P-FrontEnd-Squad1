import { Component, inject } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { HttpClient } from "@angular/common/http";
import { UsuarioService } from "../../shared/services/usuario.service";
import Swal from "sweetalert2";
import { PacienteService } from "../../shared/services/paciente.service";
import { ConsultaService } from "../../shared/services/consulta.service";
import { ExameService } from "../../shared/services/exame.service";
import { ProntuarioService } from "../../shared/services/prontuario.service";

@Component({
  selector: "app-teste-api-service",
  standalone: true,
  imports: [],
  templateUrl: "./teste-api-service.component.html",
  styleUrl: "./teste-api-service.component.scss",
})
export class TesteApiServiceComponent {
  private usuarioService = inject(UsuarioService);
  private pacienteService = inject(PacienteService);
  private consultaService = inject(ConsultaService);
  private exameService = inject(ExameService);
  private prontuarioService = inject(ProntuarioService);

  constructor() {}

  teste(): void {
    const credentials = {
      email: "admin@example.com",
      newPassword: "123123123",
    };
    this.consultaService.getConsultaById("1").subscribe({
      next: (response) => {
        this.mensagemSucesso(response.message);
      },
      error: (error: Error) => {

        this.mensagemErro(error.message);
      },
    });


    
  }

mensagemSucesso(mensagem: string): void {
  Swal.fire({
    text: mensagem,
    icon: "success",
    confirmButtonColor: "#0A7B73",
    confirmButtonText: "OK",
  }).then((result) => {
   
  });
}
mensagemErro(mensagem: string): void {
  Swal.fire({
    text: mensagem,
    icon: "error",
    confirmButtonColor: "#0A7B73",
    confirmButtonText: "OK",
  });
  console.error("Erro de autenticação:", mensagem);
}

}
