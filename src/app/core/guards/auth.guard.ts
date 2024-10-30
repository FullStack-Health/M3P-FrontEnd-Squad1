import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { LoggedUserService } from "../services/logged-user.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedUser = inject(LoggedUserService);
  // debugger;

  if (!loggedUser.isLoggedIn()) {
    router.navigate(["/login"]);
    return false;
  }

  const userRole = loggedUser.getUserRole();
  const allowedRoles = route.data?.["roles"] as Array<string>;

  if (userRole && allowedRoles && allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
