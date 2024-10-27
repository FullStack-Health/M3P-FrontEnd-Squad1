import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  http = inject(HttpClient);

  private apiUrl = " http://localhost:8081/api/usuarios/login";

  constructor() {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => this.saveLogin(response.token)),
      catchError(this.handleError)
    );
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
    } else if (error.status === 0) {
      errorMessage = "Falha na conexão com o servidor.";
    } else if (error.error instanceof ErrorEvent) {
      // erro frontend
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // outro erro, enviado pelo backend
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }

    // Lança o erro como uma nova mensagem para ser exibida no componente
    return throwError(() => new Error(errorMessage));
  }
}
