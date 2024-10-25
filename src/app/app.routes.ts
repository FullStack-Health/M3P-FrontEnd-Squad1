import { Routes } from '@angular/router';
import { SinginSignupPageComponent } from './singin-signup-page/singin-signup-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { CadastroPacienteComponent } from './cadastro-paciente/cadastro-paciente.component';
import { ExamesComponent } from './exames/exames.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ProntuariosComponent } from './prontuarios/prontuarios.component';
import { ProntuarioPacienteComponent } from './prontuario-paciente/prontuario-paciente.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home', component: HomeComponent,
        canActivate: [authGuard]
    },
    { path: 'login', component: SinginSignupPageComponent },
    { path: 'cadastro', component: SignUpComponent },
    {
        path: 'paciente', component: CadastroPacienteComponent,
        canActivate: [authGuard]
    },
    {
        path: 'paciente/edit/:id', component: CadastroPacienteComponent,
        canActivate: [authGuard]
    },
    {
        path: 'exame', component: ExamesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'exame/:examId', component: ExamesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'consulta', component: ConsultaComponent,
        canActivate: [authGuard]
    },
    {
        path: 'consulta/:consultaId', component: ConsultaComponent,
        canActivate: [authGuard]
    },
    {
        path: 'prontuarios', component: ProntuariosComponent,
        canActivate: [authGuard]
    },
    {
        path: 'prontuarios/:id', component: ProntuarioPacienteComponent,
        canActivate: [authGuard]
    }
];
