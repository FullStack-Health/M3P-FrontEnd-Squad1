import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoggedUserService {
  private loggedUserKey = "loggedUser";

  constructor() {}

  saveUser(user: any) {
    localStorage.setItem(this.loggedUserKey, JSON.stringify(user));
  }
  saveToken(token: string) {
    localStorage.setItem("authToken", token);
  }
  clearLoggedUser() {
    localStorage.removeItem(this.loggedUserKey);
  }

  getLoggedUser() {
    return JSON.parse(localStorage.getItem(this.loggedUserKey) || "{}");
  }

  isLoggedIn(): boolean {
    const user = this.getLoggedUser();
    return !!user.name && !this.isTokenExpired(user.exp);
  }

  private isTokenExpired(expirationTime: number): boolean {
    return Date.now() >= expirationTime * 1000; // O tempo de expiração é geralmente em segundos
  }
}
