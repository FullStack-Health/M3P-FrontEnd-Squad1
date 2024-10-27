import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  http = inject(HttpClient);

  private baseUrl = "http://localhost:4200";

  constructor() {}

  //métodos genéricos:
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  putData(endpoint: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  deleteData(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`);
  }

  testPost(data: any): Observable<any> {
    return this.http.put(
      "http://localhost:8081/api/usuarios/email/admin@example.com/redefinir-senha",
      {
        newPassword: "admin12345",
      }
    );
  }

  // testGetUsuarios() {
  //   const authToken = localStorage.getItem("authToken");
  //   console.log("testGet token: " + authToken);

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${authToken}`,
  //     Accept: "application/json",
  //   });

  //   return this.http.get(`http://localhost:4200/api/usuarios`, { headers });
  // }
}
