import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { ApiService } from "../../core/services/api.service";
import { LoggedUserService } from "../../core/services/logged-user.service";
import { ErrorHandlingService } from "../../core/services/error-handling.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiService = inject(ApiService);
  private loggedUserService = inject(LoggedUserService);
  private errorHandlingService = inject(ErrorHandlingService);
  private authUrl = "usuarios/login";

  constructor() {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post(this.authUrl, credentials).pipe(
      tap((response: any) => {
        this.saveLogin(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem("authToken");
    this.loggedUserService.clearLoggedUser();
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private saveLogin(token: string): void {
    const decodedToken: {
      role: string;
      sub: string;
      exp: number;
      patientId: number;
    } = this.decodeToken(token);

    const loggedUser = {
      name: decodedToken.sub,
      role: decodedToken.role.replace("ROLE_", ""),
      exp: decodedToken.exp,
      patientId: decodedToken.patientId,
    };
    this.loggedUserService.saveUser(loggedUser);
    localStorage.setItem("authToken", token);
  }

  private decodeToken(token: string): any {
    return jwtDecode(token);
  }
}
