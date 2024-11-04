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
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error("Falha ao buscar usuários."));
      })
    );
}

  getUsuarioById(usuarioId: string): Observable<any> {
    return this.apiService.get(`${this.usuarioUrl}/${usuarioId}`).pipe(
      tap((response: any) => {
      })
    );
  }

  addUsuario(newUsuario: any): Observable<any> {
    return this.apiService.post(this.usuarioUrl, newUsuario).pipe(
      tap((response: any) => {
      })
    );
  }

  updateUsuario(updatedUsuario: any): Observable<any> {
    return this.apiService
      .put(this.usuarioUrl, updatedUsuario.id, updatedUsuario)
      .pipe(
        tap((response: any) => {
        })
      );
  }

  deleteUsuario(usuarioId: string): Observable<any> {
    return this.apiService.delete(this.usuarioUrl, usuarioId).pipe(
      tap((response: any) => {
      })
    );
  }
}
