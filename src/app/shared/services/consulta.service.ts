// import { inject, Injectable } from "@angular/core";
// import { ApiService } from "../../core/services/api.service";
// import {  Observable } from "rxjs";

// @Injectable({
//   providedIn: "root",
// })
// export class ConsultaService {
//   private apiService = inject(ApiService);
//   private consultaUrl = "consultas";
//   private consultaList: any[] = [];
//   constructor() {}

// <<<<<<< feat/consultas
//   getAllConsultas(page: number = 0, size: number = 1000000): Observable<any> {
// =======
//   getAllConsultas(): Observable<any> {
// >>>>>>> developer
//     return this.apiService.get(this.consultaUrl);
//   }

//   getConsultaById(consultaId: string): Observable<any> {
//     return this.apiService.get(`${this.consultaUrl}/${consultaId}`);
//   }

//   addConsulta(newConsulta: any): Observable<any> {
//     return this.apiService.post(this.consultaUrl, newConsulta);
//   }

//   updateConsulta(updatedConsulta: any): Observable<any> {
//     return this.apiService
//       .put(this.consultaUrl, updatedConsulta.id, updatedConsulta);
//   }

//   deleteConsulta(consultaId: string): Observable<any> {
//     return this.apiService.delete(this.consultaUrl, consultaId);
//   }
// }
