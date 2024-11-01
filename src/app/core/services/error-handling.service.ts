import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlingService {
  constructor() {}
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    // debugger;
    if (error.status === 0) {
      errorMessage = "Falha na conexão com o servidor. Verifique sua conexão.";
    } else if (error.status === 400) {
      errorMessage = error.error.message || "Requisição inválida.";
    } else if (error.status === 401) {
      errorMessage = "Login ou senha incorretos.";
    } else if (error.status === 403) {
      errorMessage = error.error.message || "Acesso não permitido.";
    } else if (error.status === 404) {
      errorMessage = error.error.message || "Recurso não encontrado.";
    } else if (error.status === 409) {
      errorMessage = error.error.message || "Conflito de dados.";
    } else if (error.status >= 500) {
      errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
    } else {
      errorMessage = `Erro inesperado: (${error.status}) ${error.message}`;
    }

    // console.error("Erro:", error);
    return throwError(() => new Error(errorMessage));
  }
}
