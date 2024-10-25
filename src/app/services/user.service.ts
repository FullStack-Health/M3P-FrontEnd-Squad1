import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) {}

  registerUser(userData: any): Observable<any> {
    return this.httpService.post('/usuarios/pre-registro', userData);
  }

  getUserById(id: string): Observable<any> {
    return this.httpService.get(`/usuarios/${id}`);
  }

  getUsers(): Observable<any> {
    return this.httpService.get('/usuarios');
  }
}