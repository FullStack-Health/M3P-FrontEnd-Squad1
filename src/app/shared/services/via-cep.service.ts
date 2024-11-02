import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ViaCepService {
  constructor(private http: HttpClient) {}

  get(cep: string): Observable<any> {
    const sanitizedCep = cep.replace("-", "");
    const url = `https://viacep.com.br/ws/${sanitizedCep}/json/`;
    console.log("Chamando API ViaCep com URL:", url); // Adicione este log para verificar se a URL está correta
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error("Erro ao buscar CEP:", error);
        return throwError(() => new Error("CEP inválido ou não encontrado."));
      })
    );
  }
}
