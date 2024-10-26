import { Component } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-teste-api-service",
  standalone: true,
  imports: [],
  templateUrl: "./teste-api-service.component.html",
  styleUrl: "./teste-api-service.component.scss",
})
export class TesteApiServiceComponent {
  constructor(private apiService: ApiService, private http: HttpClient) {}
  email: string = "admin@example.com";
  password: string = "admin12345";

  teste(): void {
    this.apiService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log("Login bem-sucedido!", response);
        localStorage.setItem("authToken", response.token);
      },
      error: (error) => {
        console.error("Erro no login:", error);
      },
    });
  }
}
