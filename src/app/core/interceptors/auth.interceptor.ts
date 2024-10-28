import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes("/api/usuarios/login")) {
    return next(req);
  }

  const authToken = localStorage.getItem("authToken");
  console.log(authToken);

  if (authToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
