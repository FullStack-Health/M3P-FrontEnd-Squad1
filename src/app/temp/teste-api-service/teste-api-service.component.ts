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
  data = {
    newPassword: "admin12345",
  };

  teste(): void {
    //
    // this.apiService.testGetUsuarios;
    // this.apiService.testPost("").subscribe({
    //   next(response) {
    //     console.log(response);
    //   },
    //   error(err) {
    //     console.error(err);
    //   },
    // });
    // this.apiService
    //   .postData("api/usuarios/pre-registro", {
    //     email: "ricrvs1@example.com",
    //     password: "senha123",
    //     role: "ADMIN",
    //   })
    //   .subscribe({
    //     next(response) {
    //       console.log(response);
    //     },
    //     error(err) {
    //       console.error(err);
    //     },
    //   });
  }
}
