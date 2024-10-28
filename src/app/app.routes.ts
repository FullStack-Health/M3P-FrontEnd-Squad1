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
