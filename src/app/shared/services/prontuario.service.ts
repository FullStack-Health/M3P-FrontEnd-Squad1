import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProntuarioService {
  private apiService = inject(ApiService);
  private pacienteUrl = "pacientes";
  private prontuarioUrl = "prontuarios";
  constructor() {}

  getAllProntuarios(): Observable<any> {
    return this.apiService
      .get(`${this.pacienteUrl}/${this.prontuarioUrl}`)
      .pipe(
        tap((response: any) => {
          // isolar listas da resposta paginada
          // console.log(response);
        })
      );
  }

  getProntuarioByPacienteId(pacienteId: string): Observable<any> {
    return this.apiService
      .get(`${this.pacienteUrl}/${pacienteId}/${this.prontuarioUrl}`)
      .pipe(
        tap((response: any) => {
          // console.log(response);
        })
      );
  }
}