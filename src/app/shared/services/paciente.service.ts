import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PacienteService {
  private apiService = inject(ApiService);
  private pacienteUrl = "pacientes";
  private pacienteList: any[] = [];

  constructor() {}

  getAllPacientes(): Observable<any> {
    return this.apiService.get(this.pacienteUrl).pipe(
      tap((response: any) => {
        // isolar lista de pacientes da resposta paginada
        // console.log(response);
      })
    );
  }

  getPacienteById(pacienteId: string): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}/${pacienteId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  addPaciente(newPaciente: any): Observable<any> {
    return this.apiService.post(this.pacienteUrl, newPaciente).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }

  updatePaciente(updatedPaciente: any): Observable<any> {
    return this.apiService
      .put(this.pacienteUrl, updatedPaciente.id, updatedPaciente)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        })
      );
  }

  deletePaciente(pacienteId: string): Observable<any> {
    return this.apiService.post(this.pacienteUrl, pacienteId).pipe(
      tap((response: any) => {
        // console.log(response);
      })
    );
  }
}
