import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ConsultaService {
  private apiService = inject(ApiService);
  private consultaUrl = "api/consultas";
  private consultaList: any[] = [];
  constructor() {}

  getAllConsultas(): Observable<any> {
    return this.apiService.get(this.consultaUrl).pipe(
      tap((response: any) => {
        // isolar lista de consultas da resposta paginada
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  getConsultaById(consultaId: string): Observable<any> {
    return this.apiService.get(`${this.consultaUrl}/${consultaId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  addConsulta(newConsulta: any): Observable<any> {
    return this.apiService.post(this.consultaUrl, newConsulta).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  updateConsulta(updatedConsulta: any): Observable<any> {
    return this.apiService
      .put(this.consultaUrl, updatedConsulta.id, updatedConsulta)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  deleteConsulta(consultaId: string): Observable<any> {
    return this.apiService.post(this.consultaUrl, consultaId).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";

    if (error.status === 400) {
      // errorMessage = "Dados ausentes ou incorretos";
      // mensagem de erro específico vem do backend:
      errorMessage = `${error.message}`;
    } else if (error.status === 401) {
      errorMessage = "Falha de autenticação.";
    } else if (error.status === 404) {
      errorMessage = "Consulta não encontrada";
    } else if (error.status === 409) {
      // errorMessage = "Consulta já cadastrada";
      // mensagem de erro específico vem do backend:
      errorMessage = `${error.message}`;
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}
