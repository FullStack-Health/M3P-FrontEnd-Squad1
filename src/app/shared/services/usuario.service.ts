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

  // usuario pré-registro
  addPreRegistro(newUser: any): Observable<any> {
    return this.apiService
      .post(`${this.usuarioUrl}/pre-registro`, newUser)
      .pipe(
        tap((response: any) => {
          // console.log(response);
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
          // console.log(response);
        })
      );
  }

  // Listar todos os usuários
  getAllUsuarios(): Observable<any> {
    return this.apiService.get(this.usuarioUrl).pipe(
      tap((response: any) => {
        // isolar lista de usuarios da resposta paginada
        // console.log(response);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error("Falha ao buscar usuários."));
      })
    );
  }

  getUsuarioById(usuarioId: string): Observable<any> {
    return this.apiService.get(`${this.usuarioUrl}/${usuarioId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  // usuario completo
  addUsuario(newUsuario: any): Observable<any> {
    return this.apiService.post(this.usuarioUrl, newUsuario).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  updateUsuario(updatedUsuario: any): Observable<any> {
    return this.apiService
      .put(this.usuarioUrl, updatedUsuario.id, updatedUsuario)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        })
      );
  }

  deleteUsuario(usuarioId: string): Observable<any> {
    return this.apiService.post(this.usuarioUrl, usuarioId).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }
}
