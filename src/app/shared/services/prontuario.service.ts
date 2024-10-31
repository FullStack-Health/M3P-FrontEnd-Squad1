import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProntuarioService {
  private apiService = inject(ApiService);
  private pacienteUrl = "pacientes";
  private prontuarioUrl = "prontuarios";
  constructor() {}

  getAllProntuarios(): Observable<any> {
    return this.apiService
      .get(`${this.pacienteUrl}/${this.prontuarioUrl}`)
      .pipe(
        tap((response: any) => {
          // isolar listas da resposta paginada
          // console.log(response);
        }),
        catchError(this.handleError)
      );
  }
  getProntuarioByPacienteId(pacienteId: string): Observable<any> {
    return this.apiService
      .get(`${this.pacienteUrl}/${pacienteId}${this.prontuarioUrl}`)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";

    if (error.status === 400) {
      errorMessage = "Dados ausentes ou incorretos";
    } else if (error.status === 401) {
      errorMessage = "Falha de autenticação.";
    } else if (error.status === 404) {
      errorMessage = "Paciente não encontrado.";
    } else if (error.status === 409) {
      errorMessage = "Paciente já cadastrado";
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}
