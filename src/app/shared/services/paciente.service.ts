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

  // métodos do antigo pacienteService (com localStorage):
  // getAllPactients(): any[];
  // getPatientById(patientId: string): any;
  // addPatient(patient: any): void ;
  // updatePatient(updatedPatient: any): void ;
  // deletePatient(patientId: string): void;

  getAllPacientes(): Observable<any> {
    return this.apiService.get(this.pacienteUrl).pipe(
      tap((response: any) => {
        // isolar lista de pacientes da resposta paginada
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  getPacienteById(pacienteId: string): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}/${pacienteId}`).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  addPaciente(newPaciente: any): Observable<any> {
    return this.apiService.post(this.pacienteUrl, newPaciente).pipe(
      tap((response: any) => {
        // console.log(response);
      }),
      catchError(this.handleError)
    );
  }

  updatePaciente(updatedPaciente: any): Observable<any> {
    return this.apiService
      .put(this.pacienteUrl, updatedPaciente.id, updatedPaciente)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  deletePaciente(pacienteId: string): Observable<any> {
    return this.apiService.post(this.pacienteUrl, pacienteId).pipe(
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
