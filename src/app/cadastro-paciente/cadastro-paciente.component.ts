import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ViaCepService } from '../services/via-cep.service';

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, ToolbarComponent, SweetAlert2Module, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './cadastro-paciente.component.html',
  styleUrl: './cadastro-paciente.component.scss'
})

export class CadastroPacienteComponent implements OnInit{

  isMenuRetracted = false;
  pageTitle: string = 'Cadastro de Pacientes';
  showAddress: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PacienteService,
    private viaCepService: ViaCepService,
  ) {
    this.detectScreenSize();
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      gender: new FormControl('', Validators.required),
      dataNascimento: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      rg: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20)
      ]),
      civil: new FormControl('', Validators.required),
      natural: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      emergencyContact: new FormControl('', Validators.required),
      contactPhone: new FormControl('', Validators.required),
      alergies: new FormControl(''),
      care: new FormControl(''),
      convenio: new FormControl(''),
      convenioNum: new FormControl(''),
      convenioVal: new FormControl(''),
      cep: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      street: new FormControl(''),
      streetNum: new FormControl(''),
      streetExtra: new FormControl(''),
      hood: new FormControl(''),
      reference: new FormControl(''),
      id: new FormControl('')
    });

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const pacienteId = params['id'];
      if (pacienteId) {
        const paciente = this.patientService.getPatientById(pacienteId);
        if (paciente) {
          this.isEdit = true;
          this.form.patchValue(paciente);
        }
      }
    });

    this.form.get('cep')?.valueChanges.subscribe(cep => {
      if (cep && cep.length === 8) { 
        this.viaCepService.get(cep).subscribe(address => {
          this.form.patchValue({
            state: address.uf,
            city: address.localidade,
            street: address.logradouro,
            hood: address.bairro,
          });
        });
      } else if (cep === null || cep === '') {
        this.form.patchValue({
          state: null,
          city: null,
          street: null,
          hood: null,
        });
      }
    });
  
  }

  cadastrar() {
    if (this.form.valid) {
      if (this.isEdit) {
        this.patientService.updatePatient(this.form.value);
        Swal.fire({
          text: "Cadastro atualizado com sucesso!",
          icon: "success",
          confirmButtonColor: "#0A7B73",
          confirmButtonText: "OK"
        });
      } else {
        this.patientService.addPatient(this.form.value);
        Swal.fire({
          text: "Paciente cadastrado com sucesso!",
          icon: "success",
          confirmButtonColor: "#0A7B73",
          confirmButtonText: "OK"
        });
      }
      this.router.navigate(['/home']);
    } else {
      Swal.fire({
        text: "Por favor, preencha todos os campos corretamente.",
        icon: "error",
        confirmButtonColor: "#0A7B73"
      });
    }
  }

  hasConsultasOrExams(patientId: string): boolean {
    const patient = this.patientService.getPatientById(patientId);
    
    if (patient && (patient.consultas || patient.exams)) {
      return (patient.consultas && patient.consultas.length > 0) || (patient.exams && patient.exams.length > 0);
    } else {
      return false;
    }
  }

  deletePatient() {
  
    if (this.isEdit) {
      const pacienteId = this.form.get('id')?.value;
      const hasConsultasOrExams = this.hasConsultasOrExams(pacienteId);
  
      if (hasConsultasOrExams) {
        Swal.fire({
          text: "Paciente não pode ser excluído. Para excluir, exclua exames e consultas relacionadas a esse paciente!",
          icon: "error",
          confirmButtonColor: "#0A7B73",
          confirmButtonText: "OK"
        });
        this.router.navigate(['/home']);
        return;
      } else {
        this.patientService.deletePatient(pacienteId);
  
        Swal.fire({
          text: "Paciente excluído com sucesso!",
          icon: "success",
          confirmButtonColor: "#0A7B73",
          confirmButtonText: "OK"
        });

        this.router.navigate(['/home']);
      }
    } 
  }

}