import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PacienteService } from '../services/paciente.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.scss']
})
export class CadastroPacienteComponent implements OnInit {
  isMenuRetracted = false;
  pageTitle: string = 'Cadastro de Pacientes';
  form: FormGroup;
  isEdit: boolean = false;

  constructor(private router: Router, private pacienteService: PacienteService, private route: ActivatedRoute) {
    this.form = new FormGroup({
      id: new FormControl(''), 
      name: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      gender: new FormControl('', Validators.required),
      dataNascimento: new FormControl('', Validators.required),
      cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]), 
      rg: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      civil: new FormControl('', Validators.required),
      natural: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      emergencyContact: new FormControl('', Validators.required),
      contactPhone: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]), 
      alergies: new FormControl(''),
      care: new FormControl(''),
      convenio: new FormControl(''),
      convenioNum: new FormControl(''),
      convenioVal: new FormControl('', Validators.pattern(/^\d{2}\/\d{2}$/)), 
      cep: new FormControl(''),
      state: new FormControl({ value: '', disabled: true }), 
      city: new FormControl({ value: '', disabled: true }), 
      street: new FormControl({ value: '', disabled: true }), 
      streetNum: new FormControl(''),
      streetExtra: new FormControl(''),
      hood: new FormControl({ value: '', disabled: true }), 
      reference: new FormControl('')
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const pacienteId = params['id'];
      if (pacienteId) {
        this.isEdit = true; 
        this.pacienteService.getPatientById(pacienteId).subscribe((patient: { [key: string]: any; }) => {
          this.form.patchValue(patient); 
        });
      }
    });
  }

  cadastrar() {
    if (this.form.valid) {
      const pacienteData = this.form.value;

      if (this.isEdit) {
        this.pacienteService.updatePatient(pacienteData).subscribe({
          next: () => this.showSuccessAlert('Paciente atualizado com sucesso!'),
          error: () => this.showErrorAlert('Erro ao atualizar paciente.')
        });
      } else {
        this.pacienteService.addPatient(pacienteData).subscribe({
          next: () => this.showSuccessAlert('Paciente cadastrado com sucesso!'),
          error: () => this.showErrorAlert('Erro ao cadastrar paciente.')
        });
      }

      this.router.navigate(['/home']);
    } else {
      this.showErrorAlert('Por favor, preencha todos os campos corretamente.');
    }
  }

  showSuccessAlert(message: string) {
    Swal.fire({ text: message, icon: 'success', confirmButtonColor: '#0A7B73' });
  }

  showErrorAlert(message: string) {
    Swal.fire({ text: message, icon: 'error', confirmButtonColor: '#0A7B73' });
  }

  deletePatient() {
    const pacienteId = this.form.get('id')?.value;
    if (pacienteId) {
      this.pacienteService.deletePatient(pacienteId).subscribe({
        next: () => {
          this.showSuccessAlert('Paciente excluído com sucesso!');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.showErrorAlert('Erro ao excluir paciente.');
        }
      });
    }
  }
}