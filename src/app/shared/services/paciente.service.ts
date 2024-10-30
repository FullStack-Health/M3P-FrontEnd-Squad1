import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PacienteService {
  private apiService = inject(ApiService);
  private pacienteUrl = "api/pacientes";
  private pacienteList: any[] = [];

  constructor() {}

  // métodos do antigo pacienteService (com localStorage):
  // getAllPactients(): any[];
  // getPatientById(patientId: string): any;
  // addPatient(patient: any): void ;
  // updatePatient(updatedPatient: any): void ;
  // deletePatient(patientId: string): void;

  getAllPatients(): Observable<any> {
    return this.apiService.get(this.pacienteUrl).pipe(
      tap((response: any) => {
        // isolar lista de pacientes da resposta paginada
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  getPatientById(pacienteId: string): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}/${pacienteId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  addPatient(newPaciente: any): Observable<any> {
    return this.apiService.post(this.pacienteUrl, newPaciente).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  updatePatient(updatedPatient: any): Observable<any> {
    return this.apiService
      .put(this.pacienteUrl, updatedPatient.id, updatedPatient)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  deletePatient(patientId: string): Observable<any> {
    return this.apiService.post(this.pacienteUrl, patientId).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";

    if (error.status === 400) {
      errorMessage = "Dados ausentes ou incorretos";
    } else if (error.status === 401) {
      errorMessage = "Falha de autenticação.";
    } else if (error.status === 404) {
      errorMessage = "Paciente não encontrado.";
    } else if (error.status === 409) {
      errorMessage = "Paciente já cadastrado";
    } else {
      errorMessage = `${error.message}`;
    }
    // console.error(error);

    return throwError(() => new Error(errorMessage));
  }
}
