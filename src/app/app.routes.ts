import { Routes } from "@angular/router";
import { SinginSignupPageComponent } from "./pages/signin-signup-page/signin-signup-page.component";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import { CadastroPacienteComponent } from "./pages/cadastro-paciente/cadastro-paciente.component";
import { ConsultaComponent } from "./pages/consulta/consulta.component";
import { ProntuariosComponent } from "./pages/prontuarios/prontuarios.component";
import { ProntuarioPacienteComponent } from "./pages/prontuario-paciente/prontuario-paciente.component";
import { HomeComponent } from "./pages/home/home.component";
import { ExamesComponent } from "./pages/exames/exames.component";
import { TesteApiServiceComponent } from "./temp/teste-api-service/teste-api-service.component";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "testeApi",
    component: TesteApiServiceComponent,
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
  },
  {
    path: "login",
    component: SinginSignupPageComponent,
  },
  {
    path: "cadastro",
    component: SignUpComponent,
  },
  {
    path: "paciente",
    component: CadastroPacienteComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
  },
  {
    path: "paciente/edit/:id",
    component: CadastroPacienteComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
  },
  {
    path: "exame",
    component: ExamesComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
    children: [
      {
        path: ":examId",
        component: ExamesComponent,
        canActivate: [authGuard],
        data: { roles: ["ADMIN", "MEDICO"] },
      },
    ],
  },
  {
    path: "exame/edit/:id",
    component: ExamesComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
  },
  {
    path: "consulta",
    component: ConsultaComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
    children: [
      {
        path: ":consultaId",
        component: ConsultaComponent,
        canActivate: [authGuard],
        data: { roles: ["ADMIN", "MEDICO"] },
      },
      {
        path: "edit/:id",
        component: ConsultaComponent,
        canActivate: [authGuard],
        data: { roles: ["ADMIN", "MEDICO"] },
      },
    ],
  },
  {
    path: "prontuarios",
    component: ProntuariosComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO"] },
  },
  {
    path: "prontuarios/:id",
    component: ProntuarioPacienteComponent,
    canActivate: [authGuard],
    data: { roles: ["ADMIN", "MEDICO", "PACIENTE"] },
  },
];