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

  constructor() {}

  getAllExames(page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.get(`${this.exameUrl}?page=${page}&size=${size}`).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  getExameById(exameId: string): Observable<any> {
    return this.apiService.get(`${this.exameUrl}/${exameId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  getExamesByPatientId(patientId: string, page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.get(`${this.exameUrl}?patientId=${patientId}&page=${page}&size=${size}`).pipe(
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
      })
    );
  }

  updateExame(exameId: string, updatedExame: any): Observable<any> {
    return this.apiService.put(this.exameUrl, exameId, updatedExame).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  deleteExame(exameId: string): Observable<any> {
    return this.apiService.delete(this.exameUrl, exameId).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";

    if (error.status === 400) {
      errorMessage = `${error.message}`;
    } else if (error.status === 401) {
      errorMessage = "Falha de autenticação.";
    } else if (error.status === 404) {
      errorMessage = "Exame não encontrado";
    } else if (error.status === 409) {
      errorMessage = `${error.message}`;
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}