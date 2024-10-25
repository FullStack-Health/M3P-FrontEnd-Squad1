import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PacienteService } from '../services/paciente.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta',
  standalone: true,
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  form: FormGroup;
  selectedPatientId: string | null = null;
  isEdit: boolean = false;
  selectedConsultaId: string | null = null;

  constructor(private pacienteService: PacienteService) {
    this.form = new FormGroup({
      motive: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(1024)]),
      medication: new FormControl(''),
      dosage: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(256)]),
    });
  }

  ngOnInit() {
    if (this.selectedConsultaId) {
      const consulta = this.pacienteService.getConsultaById(this.selectedPatientId!, this.selectedConsultaId);
      if (consulta) {
        this.form.patchValue(consulta); 
        this.isEdit = true;
      }
    }
  }

  cadastrar() {
    if (this.form.valid) {
      const consultaData = this.form.value;
      if (this.isEdit) {
        this.pacienteService.updateConsulta(this.selectedPatientId!, consultaData).subscribe({
          next: () => this.showSuccessAlert('Consulta atualizada com sucesso!'),
          error: () => this.showErrorAlert('Erro ao atualizar consulta.')
        });
      } else {
        this.pacienteService.addConsulta(this.selectedPatientId!, consultaData).subscribe({
          next: () => this.showSuccessAlert('Consulta cadastrada com sucesso!'),
          error: () => this.showErrorAlert('Erro ao cadastrar consulta.')
        });
      }
    }
  }

  showSuccessAlert(message: string) {
    Swal.fire({ text: message, icon: 'success', confirmButtonColor: '#0A7B73' });
  }

  showErrorAlert(message: string) {
    Swal.fire({ text: message, icon: 'error', confirmButtonColor: '#0A7B73' });
  }

  deleteConsulta() {
    if (this.selectedConsultaId) {
      this.pacienteService.deleteConsulta(this.selectedPatientId!, this.selectedConsultaId).subscribe({
        next: () => {
          this.showSuccessAlert('Consulta excluída com sucesso!');
          //FALTA LOGICA PARA O QUE ACONTECE DEPOIS DE EXCLUIR
        },
        error: () => {
          this.showErrorAlert('Erro ao excluir consulta.');
        }
      });
    }
  }
}