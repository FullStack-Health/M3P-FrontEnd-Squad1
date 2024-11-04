import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: "root",
})
export class PacienteService {
  private apiService = inject(ApiService);
  private pacienteUrl = "pacientes";

  constructor() {}

  getAllPacientes(page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}?page=${page}&size=${size}`).pipe(
      tap((response: any) => {
      })
    );
  }

  getPacienteById(pacienteId: string): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}/${pacienteId}`).pipe(
      tap((response: any) => {
      })
    );
  }

  addPaciente(newPaciente: any): Observable<any> {
    return this.apiService.post(this.pacienteUrl, newPaciente).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }
  
  updatePaciente(updatedPaciente: any): Observable<any> {
    return this.apiService.put(this.pacienteUrl, updatedPaciente.id, updatedPaciente).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  deletePaciente(pacienteId: string): Observable<any> {
    return this.apiService.delete(this.pacienteUrl, pacienteId).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  getPacientesByPhone(phone: string): Observable<any> {
    const cleanedPhone = this.cleanString(phone);
    return this.apiService.get(`${this.pacienteUrl}/telefone/${cleanedPhone}`).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  cleanString(value: string): string {
    return value ? value.replace(/\D/g, '') : '';
  }

  getPacientesByName(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name.trim());
    return this.apiService.get(`${this.pacienteUrl}/nome/${encodedName}`).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  getPacientesByEmail(email: string): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}/email/${email}`).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }
  
  searchPacientes(query: string): Observable<any> {
    return this.apiService.get(`${this.pacienteUrl}/search?query=${query}`).pipe(
      tap((response: any) => {
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado.";
  
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
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
    }
  
    Swal.fire({
      text: errorMessage,
      icon: "error",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK",
    });
  
    return throwError(() => new Error(errorMessage));
  }
}