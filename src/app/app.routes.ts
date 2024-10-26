import { Routes } from "@angular/router";
import { SinginSignupPageComponent } from "./features/signin-signup-page/signin-signup-page.component";
import { SignUpComponent } from "./features/sign-up/sign-up.component";
import { CadastroPacienteComponent } from "./features/cadastro-paciente/cadastro-paciente.component";
import { ConsultaComponent } from "./features/consulta/consulta.component";
import { ProntuariosComponent } from "./features/prontuarios/prontuarios.component";
import { ProntuarioPacienteComponent } from "./features/prontuario-paciente/prontuario-paciente.component";
import { HomeComponent } from "./features/home/home.component";
import { ExamesComponent } from "./features/exames/exames.component";
import { TesteApiServiceComponent } from "./temp/teste-api-service/teste-api-service.component";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "testeApi",
    component: TesteApiServiceComponent,
  }, // temporario para testes em developer
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [authGuard],
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
  },
  {
    path: "paciente/edit/:id",
    component: CadastroPacienteComponent,
    canActivate: [authGuard],
  },
  {
    path: "exame",
    component: ExamesComponent,
    canActivate: [authGuard],
  },
  {
    path: "exame/:examId",
    component: ExamesComponent,
    canActivate: [authGuard],
  },
  {
    path: "consulta",
    component: ConsultaComponent,
    canActivate: [authGuard],
  },
  {
    path: "consulta/:consultaId",
    component: ConsultaComponent,
    canActivate: [authGuard],
  },
  {
    path: "prontuarios",
    component: ProntuariosComponent,
    canActivate: [authGuard],
  },
  {
    path: "prontuarios/:id",
    component: ProntuarioPacienteComponent,
    canActivate: [authGuard],
  },
];
