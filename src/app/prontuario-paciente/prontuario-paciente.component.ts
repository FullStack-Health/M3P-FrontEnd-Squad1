import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service'; 

@Component({
  selector: 'app-prontuario-paciente',
  standalone: true,
  templateUrl: './prontuario-paciente.component.html',
  styleUrls: ['./prontuario-paciente.component.scss']
})
export class ProntuarioPacienteComponent implements OnInit {
  isMenuRetracted = false;
  pageTitle: string = 'Prontuário do Paciente';
  patient: any; 

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectScreenSize();
  }

  detectScreenSize() {
    const screenWidth = window.innerWidth;
    const smallScreenBreakpoint = 768;
    this.isMenuRetracted = screenWidth < smallScreenBreakpoint;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const pacienteId = params['id'];
      if (pacienteId) {
        this.pacienteService.getProntuario(pacienteId).subscribe(patient => {
          this.patient = patient; 
        });
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
  ){
    this.detectScreenSize();
  }

  editarExame(examId: string): void {
    this.router.navigate(['/exame', examId]);
  }

  editarConsulta(consultaId: string): void {
    this.router.navigate(['/consulta', consultaId]);
  }
}