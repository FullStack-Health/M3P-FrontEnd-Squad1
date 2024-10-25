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
  selector: 'app-exames',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, FormsModule, ToolbarComponent, SweetAlert2Module, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './exames.component.html',
  styleUrl: './exames.component.scss'
})
export class ExamesComponent implements OnInit{

  containerSearch: boolean = true; 
  isMenuRetracted = false;
  pageTitle: string = 'Cadastro de Exames';
  form: FormGroup;
  isEdit: boolean = false;
  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];
  searchQuery: string = '';
  selectedPatientId: string | null = null;
  selectedExamId: string = '';
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
      this.selectedExamId = params['examId'];
      this.containerSearch = !this.selectedExamId;
      if (this.selectedExamId) {
        const patient = this.pacienteData.find(patient => 
          patient.exams.some((exam: { id: string; }) => exam.id === this.selectedExamId)
        );
        if (patient) {
          this.selectPatient(patient.id);
          this.editar(this.selectedExamId);
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
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64)
      ]),
      date: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]),
    time: new FormControl(formatDate(new Date(), 'HH:mm', "en"), [Validators.required]),
      type: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32)
      ]),
      url: new FormControl(''),
      lab: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32)
      ]),
      results: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024)
      ]),
      id: new FormControl('')
    });

  }

  getCurrentDate(): string {
    const date = new Date();
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getCurrentTime(): string {
    const currentTime = new Date().toTimeString().split(' ')[0];
    return currentTime;
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
  
  get patientExams(): any[] {
    const patient = this.pacienteService.getPatientById(this.selectedPatientId!);
    return patient ? patient.exams : [];
  }

  cadastrar(): void {
    if (this.form.valid) {
      const exam = this.form.value;
      if (this.isEdit) {
        this.pacienteService.updateExam(this.selectedPatientId!, exam);
      } else {
        this.pacienteService.addExam(this.selectedPatientId!, exam);
      }
      Swal.fire({
        text: "Exame salvo com sucesso!",
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

  editar(examId: string): void {
    const patient = this.pacienteService.getPatientById(this.selectedPatientId!);
    const exam = patient.exams.find((e: any) => e.id === examId);
    if (exam) {
      this.form.patchValue(exam);
      this.isEdit = true;
      this.selectedExamId = examId;
    }
  }

  deletar(examId: string): void {
    this.pacienteService.deleteExam(this.selectedPatientId!, examId);
    Swal.fire({
      text: "Exame excluído com sucesso!",
      icon: "success",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK"
    });
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset();
    this.isEdit = false;
    this.selectedExamId = "";
  }

  selectPatient(patientId: string): void {
    this.selectedPatientId = patientId;
    this.isFormVisible = true;
  }

}