import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private httpService: HttpService) {}

  authenticateUser(email: string, password: string): Observable<any> {
    return this.httpService.post('/usuarios/login', { email, password });
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.httpService.put(`/usuarios/reset-password`, { email, newPassword });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.httpService.post('/usuarios/reset-password', { email });
  }
}