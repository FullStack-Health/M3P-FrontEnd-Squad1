import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { LoggedUserService } from "../services/logged-user.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedUserService = inject(LoggedUserService);

  const isLogged = loggedUserService.isLoggedIn();

  if (isLogged) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
