import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  http = inject(HttpClient);
  apiService = inject(ApiService);

  private apiUrl = " http://localhost:8081/api/usuarios/login";

  constructor() {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post("api/usuarios/login", credentials).pipe(
      tap((response: any) => {
        this.saveLogin(response.token);
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  logout() {
    localStorage.removeItem("authToken");
  }

  private saveLogin(token: string): void {
    localStorage.setItem("loggedUder", "user");
    localStorage.setItem("authToken", token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";

    if (error.status === 401) {
      errorMessage = "E-mail ou senha incorretos.";
    } else if (error.status === 400) {
      errorMessage = "Requisição inválida.";
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}
