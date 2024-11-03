import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaService {
    private consultaUrl = 'consultas';

    constructor(private apiService: ApiService) { }

    getAllConsultas(page: number = 0, size: number = 10): Observable<any> {
        return this.apiService.get(`${this.consultaUrl}?page=${page}&size=${size}`).pipe(
            tap((response: any) => {
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
        return this.apiService.put(this.consultaUrl, updatedConsulta.id, updatedConsulta).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError(this.handleError)
        );
    }

    deleteConsulta(consultaId: string): Observable<any> {
        return this.apiService.delete(this.consultaUrl, consultaId).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError(this.handleError)
        );
    }

    getConsultasByPatientId(patientId: string): Observable<any> {
        return this.apiService.get(`${this.consultaUrl}/paciente/${patientId}`).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        let errorMessage = 'Ocorreu um erro inesperado.';
        if (error.status === 400) {
            errorMessage = 'Dados ausentes ou incorretos';
        } else if (error.status === 401) {
            errorMessage = 'Falha de autenticação.';
        } else if (error.status === 404) {
            errorMessage = 'Consulta não encontrada.';
        } else if (error.status === 409) {
            errorMessage = 'Consulta já cadastrada';
        } else {
            errorMessage = `${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}