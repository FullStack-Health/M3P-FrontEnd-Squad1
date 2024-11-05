import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { ErrorHandlingService } from "./error-handling.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  http = inject(HttpClient);
  errorHandlingService = inject(ErrorHandlingService);

  private apiUrl = "http://localhost:8081/api";

  constructor() {}

  get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${url}`)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${url}`, body)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  put<T>(url: string, id: string | null, body: any): Observable<T> {
    if (!id) {
      return this.http
        .put<T>(`${this.apiUrl}/${url}`, body)
        .pipe(
          catchError((error) => this.errorHandlingService.handleError(error))
        );
    }

    return this.http
      .put<T>(`${this.apiUrl}/${url}/${id}`, body)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  delete<T>(url: string, id: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${url}/${id}`)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
