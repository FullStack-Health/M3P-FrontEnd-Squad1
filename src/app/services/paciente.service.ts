import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacienteList: any[] = [];

  constructor() {
    const localData = localStorage.getItem('pacienteData');
    if (localData) {
      this.pacienteList = JSON.parse(localData);
    }
  }

  getAllPatients(): any[] {
    return this.pacienteList;
  }

  getPatientById(patientId: string): any {
    return this.pacienteList.find(p => p.id === patientId);
  }

  addPatient(patient: any): void {
    const patientId = Math.floor(1000 + Math.random() * 9000);
    patient.id = patientId.toString();
    this.pacienteList.push(patient);
    this.saveToLocalStorage();
  }

  updatePatient(updatedPatient: any): void {
    const index = this.pacienteList.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      const existingExams = this.pacienteList[index].exams;
      const existingConsultas = this.pacienteList[index].consultas;
      this.pacienteList[index] = { ...updatedPatient, exams: existingExams, consultas: existingConsultas };
      this.saveToLocalStorage();
    }
  }


  deletePatient(patientId: string): void {
    const index = this.pacienteList.findIndex(p => p.id === patientId);
    if (index !== -1) {
      this.pacienteList.splice(index, 1);
      this.saveToLocalStorage(); 
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('pacienteData', JSON.stringify(this.pacienteList));
  }


  addExam(patientId: string, exam: any): void {   
    const patient = this.getPatientById(patientId);
    
    if (patient) {
        if (!patient.exams) {
            patient.exams = [];
        }
        const examId = uuidv4();
        exam.id = examId;
        patient.exams.push(exam);
        patient.exams.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.saveToLocalStorage();
    }
}

  updateExam(patientId: string, updatedExam: any): void {
    const patient = this.getPatientById(patientId);
    if (patient && patient.exams) {
      const index = patient.exams.findIndex((e: any) => e.id === updatedExam.id);
      if (index !== -1) {
        patient.exams[index] = { ...updatedExam };
        patient.exams.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.saveToLocalStorage();
      }
    }
  }
  
  deleteExam(patientId: string, examId: string): void {
    const patient = this.getPatientById(patientId);
    if (patient && patient.exams) {
      const index = patient.exams.findIndex((e: any) => e.id === examId);
      if (index !== -1) {
        patient.exams.splice(index, 1);
        this.saveToLocalStorage();
      }
    }
  }

  addConsulta(patientId: string, consulta: any): void {
    const patient = this.getPatientById(patientId);
    if (patient) {
      if (!patient.consultas) {
        patient.consultas = [];
      }
      const consultaId = uuidv4();
      consulta.id = consultaId;
      patient.consultas.push(consulta);
      patient.consultas.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.saveToLocalStorage();
    }
  }

  updateConsulta(patientId: string, updatedConsulta: any): void {
    const patient = this.getPatientById(patientId);
    if (patient && patient.consultas) {
      const index = patient.consultas.findIndex((c: any) => c.id === updatedConsulta.id);
      if (index !== -1) {
        patient.consultas[index] = { ...updatedConsulta };
        patient.consultas.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.saveToLocalStorage();
      }
    }
  }
  
  deleteConsulta(patientId: string, consultaId: string): void {
    const patient = this.getPatientById(patientId);
    if (patient && patient.consultas) {
      const index = patient.consultas.findIndex((c: any) => c.id === consultaId);
      if (index !== -1) {
        patient.consultas.splice(index, 1);
        this.saveToLocalStorage();
      }
    }
  }

}