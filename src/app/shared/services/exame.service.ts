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

  addExame(newExame: any): Observable<any> {
    return this.apiService.post(this.exameUrl, newExame).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  updateExame(updatedExame: any): Observable<any> {
    return this.apiService
      .put(this.exameUrl, updatedExame.id, updatedExame)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        })
      );
  }

  deleteExame(exameId: string): Observable<any> {
    return this.apiService.post(this.exameUrl, exameId).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }
}
