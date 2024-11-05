import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiService = inject(ApiService);
  private usuarioUrl = "usuarios";

  constructor() {}

  addPreRegistro(newUser: any): Observable<any> {
    return this.apiService
      .post(`${this.usuarioUrl}/pre-registro`, newUser)
      .pipe(
        tap((response: any) => {
        })
      );
  }

  updateSenha(credentials: any): Observable<any> {
    const email = credentials.email;
    const body = {
      newPassword: credentials.newPassword,
    };
    return this.apiService
      .put(`${this.usuarioUrl}/email/${email}/redefinir-senha`, null, body)
      .pipe(
        tap((response: any) => {
        })
      );
  }

  getAllUsuarios(page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.get(`${this.usuarioUrl}?page=${page}&size=${size}`).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  getUsuarioById(usuarioId: string): Observable<any> {
    return this.apiService.get(`${this.usuarioUrl}/${usuarioId}`).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  addUsuario(newUsuario: any): Observable<any> {
    return this.apiService.post(this.usuarioUrl, newUsuario).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  updateUsuario(updatedUsuario: any): Observable<any> {
    return this.apiService
      .put(this.usuarioUrl, updatedUsuario.id, updatedUsuario)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError)
      );
  }

  deleteUsuario(usuarioId: string): Observable<any> {
    return this.apiService.delete(this.usuarioUrl, usuarioId).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 400) {
        errorMessage = "Dados ausentes ou incorretos";
      } else if (error.status === 401) {
        errorMessage = "Falha de autenticação.";
      } else if (error.status === 404) {
        errorMessage = "Usuário não encontrado.";
      } else if (error.status === 409) {
        errorMessage = "Usuário já cadastrado";
      } else {
        errorMessage = `${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}