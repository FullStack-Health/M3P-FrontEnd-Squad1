import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";
import { PreUser } from "../interfaces/pre-user";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiService = inject(ApiService);
  private usuarioUrl = "usuarios";

  constructor() {}

  // usuario pré-registro
  addPreRegistro(newUser: PreUser): Observable<any> {
    return this.apiService.post(`${this.usuarioUrl}/pre-registro`, newUser);
  }

  updateSenha(credentials: any): Observable<any> {
    const email = credentials.email;
    const body = {
      newPassword: credentials.newPassword,
    };
    return this.apiService.put(
      `${this.usuarioUrl}/email/${email}/redefinir-senha`,
      null,
      body
    );
  }

  getAllUsuarios(): Observable<any> {
    return this.apiService.get(this.usuarioUrl);
  }

  getUsuarioById(usuarioId: string): Observable<any> {
    return this.apiService.get(`${this.usuarioUrl}/${usuarioId}`);
  }

  // usuario completo
  addUsuario(newUsuario: any): Observable<any> {
    return this.apiService.post(this.usuarioUrl, newUsuario);
  }

  updateUsuario(updatedUsuario: any): Observable<any> {
    return this.apiService.put(
      this.usuarioUrl,
      updatedUsuario.id,
      updatedUsuario
    );
  }

  deleteUsuario(usuarioId: string): Observable<any> {
    return this.apiService.delete(this.usuarioUrl, usuarioId);
  }
}
