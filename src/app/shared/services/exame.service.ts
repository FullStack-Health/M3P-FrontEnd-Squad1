import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ExameService {
  private apiService = inject(ApiService);
  private exameUrl = "exames";
  private exameList: any[] = [];
  constructor() {}

  getAllExames(): Observable<any> {
    return this.apiService.get(this.exameUrl).pipe(
      tap((response: any) => {
        // isolar lista de exames da resposta paginada
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  getExameById(exameId: string): Observable<any> {
    return this.apiService.get(`${this.exameUrl}/${exameId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  addExame(newExame: any): Observable<any> {
    return this.apiService.post(this.exameUrl, newExame).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  updateExame(updatedExame: any): Observable<any> {
    return this.apiService
      .put(this.exameUrl, updatedExame.id, updatedExame)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  deleteExame(exameId: string): Observable<any> {
    return this.apiService.post(this.exameUrl, exameId).pipe(
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
      errorMessage = "Exame não encontrado";
    } else if (error.status === 409) {
      // errorMessage = "Exame já cadastrado";
      // mensagem de erro específico vem do backend:
      errorMessage = `${error.message}`;
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}
