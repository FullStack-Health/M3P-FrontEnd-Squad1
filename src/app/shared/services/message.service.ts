import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private router = inject(Router);
  constructor() {}

  showSuccess(
    message: string,
    redirectTo?: string,
    reloadPage: boolean = false
  ) {
    Swal.fire({
      text: message,
      icon: "success",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK",
    }).then(() => {
      if (redirectTo) {
        this.router.navigate([redirectTo]);
      } else if (reloadPage) {
        window.location.reload();
      }
    });
  }

  showError(message: string) {
    Swal.fire({
      text: `Erro: ${message}`,
      icon: "error",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK",
    });
  }
}
