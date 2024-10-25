import { CommonModule, formatDate } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, FormsModule, ToolbarComponent, SweetAlert2Module, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent implements OnInit {

  containerSearch: boolean = true; 
  isMenuRetracted = false;
  pageTitle: string = 'Cadastro de consultas';
  form: FormGroup;
  isEdit: boolean = false;
  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];
  searchQuery: string = '';
  selectedPatientId: string | null = null;
  selectedConsultaId: string = '';
  isFormVisible: boolean = false; 


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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedConsultaId = params['consultaId'];
      this.containerSearch = !this.selectedConsultaId;

      if (this.selectedConsultaId) {
        const patient = this.pacienteData.find(patient => 
          patient.consultas.some((consulta: { id: string; }) => consulta.id === this.selectedConsultaId)
        );
        if (patient) {
          this.selectPatient(patient.id);
          this.editar(this.selectedConsultaId);
        }
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
  ) {
    this.detectScreenSize();

    this.pacienteData = this.pacienteService.getAllPatients();
    this.filteredPacienteData = [...this.pacienteData];

    this.form = new FormGroup({
      motive: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      date: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]),
    time: new FormControl(formatDate(new Date(), 'HH:mm', "en"), [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024)
      ]),
      medication: new FormControl(''),
      dosage: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(256)
      ]),
      id: new FormControl('')
    });

  }

  filterPatients(): void {
    const lowercaseSearchQuery = this.searchQuery.trim().toLowerCase();
    if (lowercaseSearchQuery !== '') {
      this.filteredPacienteData = this.pacienteData.filter(patient =>
        patient.name.toLowerCase().includes(lowercaseSearchQuery) ||
        patient.email.toLowerCase().includes(lowercaseSearchQuery) ||
        patient.phone.toLowerCase().includes(lowercaseSearchQuery)
      );
    } else {
      this.filteredPacienteData = [...this.pacienteData];
    }
  }

  get patientConsultas(): any[] {
    const patient = this.pacienteService.getPatientById(this.selectedPatientId!);
    return patient ? patient.consultas : [];
  }

  cadastrar(): void {
    if (this.form.valid) {
      const consulta = this.form.value;
      if (this.isEdit) {
        this.pacienteService.updateConsulta(this.selectedPatientId!, consulta);
      } else {
        this.pacienteService.addConsulta(this.selectedPatientId!, consulta);
      }
      Swal.fire({
        text: "Consulta salva com sucesso!",
        icon: "success",
        confirmButtonColor: "#0A7B73",
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  }

  editar(consultaId: string): void {
    const patient = this.pacienteService.getPatientById(this.selectedPatientId!);
    const consulta = patient.consultas.find((e: any) => e.id === consultaId);
    if (consulta) {
      this.form.patchValue(consulta);
      this.isEdit = true;
      this.selectedConsultaId = consultaId;
    }
  }

  deletar(consultaId: string): void {
    this.pacienteService.deleteConsulta(this.selectedPatientId!, consultaId);
    Swal.fire({
      text: "Consulta excluída com sucesso!",
      icon: "success",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK"
    });
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset();
    this.isEdit = false;
    this.selectedConsultaId = "";
  }

  selectPatient(patientId: string): void {
    this.selectedPatientId = patientId;
    this.isFormVisible = true;
  }

}
