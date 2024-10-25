import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl: string = 'http://localhost:4200/api'; // URL base

  constructor(private http: HttpClient) {}

  // Método para POST
  post<T>(url: string, body: T, options?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, { headers: this.getHeaders() });
  }

  // Método para GET
  get<T>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, { headers: this.getHeaders() });
  }

  // Método para PUT
  put<T>(url: string, body: T, options?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, { headers: this.getHeaders() });
  }

  // Método para DELETE
  delete(url: string, options?: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}${url}`, { headers: this.getHeaders() });
  }

  // Método para definir cabeçalhos
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}