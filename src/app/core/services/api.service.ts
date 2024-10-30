import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  http = inject(HttpClient);

  // URL com proxy para evistar erro CORS:
  private apiUrl = "http://localhost:4200/api";

  constructor() {}

  //métodos genéricos:
  get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${url}`)
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${url}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, id: string | null, body: any): Observable<T> {
    // redefinir senha não envia id
    if (!id) {
      return this.http
        .put<T>(`${this.apiUrl}/${url}`, body)
        .pipe(catchError(this.handleError));
    }

    return this.http
      .put<T>(`${this.apiUrl}/${url}/${id}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string, id: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // tratamento erros genéricos de servidor e comunicação:
    if (error.status === 0) {
      return throwError(
        () =>
          new Error(
            "Falha na conexão com o servidor. Por favor, verifique sua conexão."
          )
      );
    }
    if (error.status >= 500) {
      // com o proxy ativado, esse erro aparece ao invés de erro 0 falha de conexão, caso o servidor esteja offline
      return throwError(
        () => new Error("Erro interno do servidor. Tente novamente mais tarde.")
      );
    }
    // console.error(error);
    // erros específicos são tratados no serviço específico
    return throwError(() => error);
  }
}
