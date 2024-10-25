import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; 
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  constructor(private httpService: HttpService) {}

  getAllPatients(): Observable<any[]> {
    return this.httpService.get('/pacientes'); 
  }

  getPatientById(patientId: string): Observable<any> {
    return this.httpService.get(`/pacientes/${patientId}`); 
  }

  addPatient(patient: any): Observable<any> {
    return this.httpService.post('/pacientes', patient); 
  }

  updatePatient(updatedPatient: any): Observable<any> {
    return this.httpService.put(`/pacientes/${updatedPatient.id}`, updatedPatient); 
  }

  deletePatient(patientId: string): Observable<any> {
    return this.httpService.delete(`/pacientes/${patientId}`); 
  }

  // Métodos para consultas
  addConsulta(patientId: string, consulta: any): Observable<any> {
    return this.httpService.post(`/pacientes/${patientId}/consultas`, consulta); 
  }

  updateConsulta(patientId: string, updatedConsulta: any): Observable<any> {
    return this.httpService.put(`/pacientes/${patientId}/consultas/${updatedConsulta.id}`, updatedConsulta); 
  }

  getConsultaById(patientId: string, consultaId: string): Observable<any> {
    return this.httpService.get(`/pacientes/${patientId}/consultas/${consultaId}`); 
  }

  deleteConsulta(patientId: string, consultaId: string): Observable<any> {
    return this.httpService.delete(`/pacientes/${patientId}/consultas/${consultaId}`); 
  }

  // Métodos para exames
  addExam(patientId: string, exam: any): Observable<any> {
    return this.httpService.post(`/pacientes/${patientId}/exames`, exam); 
  }

  updateExam(patientId: string, updatedExam: any): Observable<any> {
    return this.httpService.put(`/pacientes/${patientId}/exames/${updatedExam.id}`, updatedExam); 
  }

  getExamById(patientId: string, examId: string): Observable<any> {
    return this.httpService.get(`/pacientes/${patientId}/exames/${examId}`); 
  }

  deleteExam(patientId: string, examId: string): Observable<any> {
    return this.httpService.delete(`/pacientes/${patientId}/exames/${examId}`); 
  }

  // Prontuario

  getProntuario(patientId: string): Observable<any> {
    return this.httpService.get(`/pacientes/${patientId}/prontuario`); 
  }
}