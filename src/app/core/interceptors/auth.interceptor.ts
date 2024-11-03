import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const noAuthUrls = [
    "/api/usuarios/login",
    "/api/usuarios/pre-registro",
    "/api/usuarios/email/",
  ];

  console.log(req.url);

  const isNoAuthUrl = noAuthUrls.some((url) => req.url.includes(url));

  if (isNoAuthUrl) {
    return next(req);
  }

  const authToken = localStorage.getItem("authToken");
  // console.log(authToken);

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
