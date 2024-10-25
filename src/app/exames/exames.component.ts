import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PacienteService } from '../services/paciente.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exames',
  standalone: true,
  templateUrl: './exames.component.html',
  styleUrls: ['./exames.component.scss']
})
export class ExamesComponent implements OnInit {
  form: FormGroup;
  selectedPatientId: string | null = null;
  isEdit: boolean = false;
  selectedExamId: string | null = null;

  constructor(private pacienteService: PacienteService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      type: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
      lab: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
      results: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(1024)]),
    });
  }

  ngOnInit() {
    if (this.selectedExamId) {
      const exam = this.pacienteService.getExamById(this.selectedPatientId!, this.selectedExamId);
      if (exam) {
        this.form.patchValue(exam); 
        this.isEdit = true;
      }
    }
  }

  cadastrar() {
    if (this.form.valid) {
      const examData = this.form.value;
      if (this.isEdit) {
        this.pacienteService.updateExam(this.selectedPatientId!, examData).subscribe({
          next: () => this.showSuccessAlert('Exame atualizado com sucesso!'),
          error: () => this.showErrorAlert('Erro ao atualizar exame.')
        });
      } else {
        this.pacienteService.addExam(this.selectedPatientId!, examData).subscribe({
          next: () => this.showSuccessAlert('Exame cadastrado com sucesso!'),
          error: () => this.showErrorAlert('Erro ao cadastrar exame.')
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

  deleteExam() {
    if (this.selectedExamId) {
      this.pacienteService.deleteExam(this.selectedPatientId!, this.selectedExamId).subscribe({
        next: () => {
          this.showSuccessAlert('Exame excluído com sucesso!');
        },
        error: () => {
          this.showErrorAlert('Erro ao excluir exame.');
        }
      });
    }
  }
}