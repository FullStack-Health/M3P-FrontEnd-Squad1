import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoggedUserService {
  private readonly loggedUserKey = "loggedUser";

  constructor() {}

  saveUser(user: { name: string; role: string; exp: number }) {
    localStorage.setItem(this.loggedUserKey, JSON.stringify(user));
  }

  clearLoggedUser() {
    localStorage.removeItem(this.loggedUserKey);
  }

  getLoggedUser(): any {
    const user = localStorage.getItem(this.loggedUserKey);
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    const user = this.getLoggedUser();
    return user?.role || null;
  }

  getPacienteId(): string | null {
    const user = this.getLoggedUser();
    return user?.patientId || null;
  }

  isRoleAdmin(): boolean {
    return this.getUserRole() === "ADMIN";
  }

  isRoleMedico(): boolean {
    return this.getUserRole() === "MEDICO";
  }

  isRolePaciente(): boolean {
    return this.getUserRole() === "PACIENTE";
  }

  isLoggedIn(): boolean {
    const user = this.getLoggedUser();
    return user && !this.isTokenExpired(user.exp);
  }

  private isTokenExpired(expirationTime: number): boolean {
    return Date.now() >= expirationTime * 1000;
  }
}
