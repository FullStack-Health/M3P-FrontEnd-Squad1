import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from "rxjs";
import { ApiService } from '../../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaService {
    private apiService = inject(ApiService);
    private consultaUrl = 'consultas';

    constructor() { }

    getAllConsultas(page: number = 0, size: number = 10): Observable<any> {
        return this.apiService.get(`${this.consultaUrl}?page=${page}&size=${size}`).pipe(
            tap((response: any) => {
            }),
        );
    }

    getConsultaById(consultaId: string): Observable<any> {
        return this.apiService.get(`${this.consultaUrl}/${consultaId}`).pipe(
            tap((response: any) => {
            }),
        );
    }

    addConsulta(newConsulta: any): Observable<any> {
        return this.apiService.post(this.consultaUrl, newConsulta).pipe(
            tap((response: any) => {
            }),
        );
    }

    updateConsulta(consultaId: string, updatedConsulta: any): Observable<any> {
        return this.apiService.put(this.consultaUrl, consultaId, updatedConsulta).pipe(
            tap((response: any) => {
            }),
        );
    }

    deleteConsulta(consultaId: string): Observable<any> {
        return this.apiService.delete(this.consultaUrl, consultaId).pipe(
            tap((response: any) => {
            }),
        );
    }

    getConsultasByPatientId(patientId: string, page: number = 0, size: number = 10): Observable<any> {
        return this.apiService.get(`${this.consultaUrl}?patientId=${patientId}&page=${page}&size=${size}`).pipe(
            tap((response: any) => {
            }),
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
            errorMessage = `${error.message}`;
        } else {
            errorMessage = `${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}