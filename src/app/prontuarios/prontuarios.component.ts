import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../services/paciente.service'; // Ajuste o caminho conforme necessário
import { Router } from '@angular/router';

@Component({
  selector: 'app-prontuarios',
  standalone: true,
  templateUrl: './prontuarios.component.html',
  styleUrls: ['./prontuarios.component.scss']
})
export class ProntuariosComponent implements OnInit {
  searchQuery: string = '';
  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];

  constructor(private pacienteService: PacienteService, private router: Router) {
    this.pacienteService.getAllPatients().subscribe(data => {
      this.pacienteData = data;
      this.filteredPacienteData = [...this.pacienteData];
    });
  }

  ngOnInit() {}

  filterPatients() {
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    this.filteredPacienteData = this.pacienteData.filter(patient =>
      patient.name.toLowerCase().includes(lowerCaseQuery) ||
      patient.id.toString().includes(lowerCaseQuery)
    );
  }

  navigateToProntuario(patientId: string) {
    this.router.navigate(['/prontuario', patientId]);
  }
}