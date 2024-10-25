import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../services/paciente.service';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToolbarComponent, FontAwesomeModule, CommonModule, CardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];
  searchQuery: string = '';
  totalPatients: number = 0;
  totalExams: number = 0;
  totalConsultas: number = 0;
  isMenuRetracted = false;
  pageTitle: string = 'Página Inicial';

  constructor(private pacienteService: PacienteService, private router: Router){
    this.pacienteData = this.pacienteService.getAllPatients();
    this.filteredPacienteData = [...this.pacienteData];
    this.calculateTotals();
    this.detectScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectScreenSize();
  }

  detectScreenSize() {
    const screenWidth = window.innerWidth;
    const smallScreenBreakpoint = 768;
    this.isMenuRetracted = screenWidth < smallScreenBreakpoint;
  }

  onSidebarRetracted(isRetracted: boolean) {
    this.isMenuRetracted = isRetracted;
  }

  editarPaciente(event: any) {
    const patientId = event;
    const paciente = this.pacienteData.find(p => p.id === patientId);
      this.router.navigate(['/paciente/edit', patientId]);
  }

  filterPatients() {
    if (this.searchQuery.trim() === '') {
      this.filteredPacienteData = [...this.pacienteData];
      return;
    }
    this.filteredPacienteData = this.pacienteData.filter(patient =>
      patient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      patient.phone.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  calculateTotals(): void {
    const pacientes = this.pacienteService.getAllPatients();
    this.totalPatients = pacientes.length;

    let totalExams = 0;
    let totalConsultas = 0;

    pacientes.forEach(paciente => {
      if (paciente.exams) {
        totalExams += paciente.exams.length;
      }
      if (paciente.consultas) {
        totalConsultas += paciente.consultas.length;
      }
    });

    this.totalExams = totalExams;
    this.totalConsultas = totalConsultas;
  }
}
