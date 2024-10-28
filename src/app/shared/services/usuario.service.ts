import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiService = inject(ApiService);

  constructor() {}

  preRegistro(newUser: any): Observable<any> {
    return this.apiService.post("api/usuarios/pre-registro", newUser).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  redefinirSenha(credentials: any): Observable<any> {
    const email = credentials.email;
    const body = {
      newPassword: credentials.newPassword,
    };
    return this.apiService
      .put(`api/usuarios/email/${email}/redefinir-senha`, null, body)
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
      errorMessage = "Dados ausentes ou incorretos.";
    } else if (error.status === 401) {
      errorMessage = "Falha de autenticação.";
    } else if (error.status === 404) {
      errorMessage = "Usuário não encontrado.";
    } else if (error.status === 409) {
      errorMessage = "Email já cadastrado.";
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}
