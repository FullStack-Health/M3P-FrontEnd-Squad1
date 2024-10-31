import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ConsultaService {
  private apiService = inject(ApiService);
  private consultaUrl = "consultas";
  private consultaList: any[] = [];
  constructor() {}

  getAllConsultas(): Observable<any> {
    return this.apiService.get(this.consultaUrl).pipe(
      tap((response: any) => {
        // isolar lista de consultas da resposta paginada
        // console.log(response);
      })
    );
  }

  getConsultaById(consultaId: string): Observable<any> {
    return this.apiService.get(`${this.consultaUrl}/${consultaId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  addConsulta(newConsulta: any): Observable<any> {
    return this.apiService.post(this.consultaUrl, newConsulta).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  updateConsulta(updatedConsulta: any): Observable<any> {
    return this.apiService
      .put(this.consultaUrl, updatedConsulta.id, updatedConsulta)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        })
      );
  }

  deleteConsulta(consultaId: string): Observable<any> {
    return this.apiService.post(this.consultaUrl, consultaId).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }
}
