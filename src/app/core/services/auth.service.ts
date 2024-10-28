import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  http = inject(HttpClient);
  apiService = inject(ApiService);

  constructor() {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post("api/usuarios/login", credentials).pipe(
      tap((response: any) => {
        this.saveLogin(response.token);
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem("authToken");
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private saveLogin(token: string): void {
    const decodedToken: { role: string; sub: string; exp: number } =
      this.decodeToken(token);

    const loggedUser = {
      name: decodedToken.sub,
      role: decodedToken.role.replace("ROLE_", ""),
      expired: decodedToken.exp * 1000 < Date.now(),
    };
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem("authToken", token);
  }

  getLoggedUser() {
    return JSON.parse(localStorage.getItem("loggedUser") || "{}");
  }

  private decodeToken(token: string): any {
    return jwtDecode(token);
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
