import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DashboardMetrics {
  statistics: {
    appointmentCount: number;
    userCount: number;
    patientCount: number;
    examCount: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiService = inject(ApiService);
  private dashboardUrl = "dashboard"; 

  constructor() {}

  getDashboardData(): Observable<DashboardMetrics> {
    return this.apiService.get<{ message: string; data: DashboardMetrics }>(this.dashboardUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erro ao obter dados do dashboard', error);
        throw error; 
      })
    );
  }
}