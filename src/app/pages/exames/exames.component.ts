import { CommonModule, formatDate } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { ExameService } from "../../shared/services/exame.service";
import { PacienteService } from "../../shared/services/paciente.service";
import { Observable } from "rxjs";
import { Location } from '@angular/common';

@Component({
  selector: "app-exames",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    FormsModule,
    ToolbarComponent,
    SweetAlert2Module,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: "./exames.component.html",
  styleUrl: "./exames.component.scss",
})
export class ExamesComponent implements OnInit {
  containerSearch: boolean = true;
  isMenuRetracted = false;
  pageTitle: string = "Cadastro de Exames";
  form: FormGroup;
  isEdit: boolean = false;
  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];
  searchQuery: string = "";
  selectedPatientId: string | null = null;
  selectedExamId: string = "";
  isFormVisible: boolean = false;
  patientExams: any[] = [];
  searchPerformed: boolean = false;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  @HostListener("window:resize", ["$event"])
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
    this.route.params.subscribe((params) => {
      this.selectedExamId = params["id"];
      this.containerSearch = !this.selectedExamId;
      if (this.selectedExamId) {
        this.exameService.getExameById(this.selectedExamId).subscribe(
          (response) => {
            const exam = response.exam;
            this.form.patchValue({
              name: exam.name,
              date: exam.examDate,
              time: exam.examTime,
              type: exam.type,
              url: exam.documentUrl,
              lab: exam.laboratory,
              results: exam.results,
              id: exam.id,
              patientId: exam.patientId 
            });
            this.selectedPatientId = exam.patientId;
            this.isEdit = true;
            this.isFormVisible = true;
            this.loadPatientData(exam.patientId);
          },
          (error) => {
            console.error("Erro ao carregar exame", error);
          }
        );
      }
    });
  }
  
  loadPatientData(patientId: string): void {
    this.pacienteService.getPacienteById(patientId).subscribe(
      (patient) => {
        this.selectedPatientId = patient.id;
        this.filteredPacienteData = [patient];
      },
      (error) => {
        console.error("Erro ao carregar dados do paciente", error);
      }
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private exameService: ExameService,
    private location: Location
  ) {
    this.detectScreenSize();
    this.loadPacientes();
    this.form = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      date: new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en"), [
        Validators.required,
      ]),
      time: new FormControl(formatDate(new Date(), "HH:mm", "en"), [
        Validators.required,
      ]),
      type: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
      url: new FormControl(""),
      lab: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
      results: new FormControl("", [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024),
      ]),
      id: new FormControl(""),
      patientId: new FormControl("", Validators.required)
    });
  }

  loadPacientes(): void {
    this.pacienteService.getAllPacientes().subscribe(
      (data) => {
        if (data && Array.isArray(data.patients)) {
          this.pacienteData = data.patients;
          this.filteredPacienteData = [...this.pacienteData];
        } else {
          console.error("Formato de resposta inesperado", data);
          this.pacienteData = [];
          this.filteredPacienteData = [];
        }
      },
      (error) => {
        console.error("Erro ao carregar pacientes", error);
        this.pacienteData = [];
        this.filteredPacienteData = [];
      }
    );
  }

  getCurrentDate(): string {
    const date = new Date();
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getCurrentTime(): string {
    const currentTime = new Date().toTimeString().split(" ")[0];
    return currentTime;
  }

  filterPatients(): void {
    const searchQuery = this.searchQuery.trim().toLowerCase();
    if (searchQuery !== "") {
        let searchObservable: Observable<any>;

        if (this.isValidEmail(searchQuery)) {
            searchObservable = this.pacienteService.getPacientesByEmail(searchQuery);
        } else if (this.isValidPhone(searchQuery)) {
            const cleanedPhone = this.cleanString(searchQuery);
            searchObservable = this.pacienteService.getPacientesByPhone(cleanedPhone);
        } else {
            searchObservable = this.pacienteService.getPacientesByName(searchQuery);
        }

        searchObservable.subscribe(
            (data) => {
                if (data && Array.isArray(data.patients)) {
                    this.filteredPacienteData = data.patients;
                    if (this.filteredPacienteData.length === 1) {
                        const patientId = this.filteredPacienteData[0].id;
                        this.selectPatient(patientId);
                    } else if (this.filteredPacienteData.length === 0) {
                        this.showPatientNotFoundAlert();
                    } else {
                        this.resetSearch();
                    }
                } else if (data && data.patient) {
                    this.filteredPacienteData = [data.patient];
                    const patientId = data.patient.id;
                    this.selectPatient(patientId);
                } else {
                    console.error("Formato de resposta inesperado", data);
                    this.showPatientNotFoundAlert();
                }
            },
            (error) => {
                console.error("Erro ao filtrar pacientes", error);
                this.showPatientNotFoundAlert();
            }
        );
    } else {
        this.resetSearch();
    }
}

showPatientNotFoundAlert(): void {
  Swal.fire({
      text: "Paciente não encontrado.",
      icon: "warning",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK",
  }).then(() => {
      window.location.reload();
  });
}

cleanString(value: string): string {
    return value ? value.replace(/\D/g, '') : '';
}

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isValidPhone(phone: string): boolean {
    const cleanedPhone = this.cleanString(phone);
    const phonePattern = /^\d{10,11}$/;
    const isValid = phonePattern.test(cleanedPhone);
    return isValid;
  }

  resetSearch(): void {
    this.searchQuery = "";
    this.filteredPacienteData = [];
    this.selectedPatientId = null;
    this.isFormVisible = false;
    this.form.reset();
  }

  searchPatients(): void {
    this.searchPerformed = true;
    this.filterPatients();
  }

  loadPatientExams(): void {
    if (this.selectedPatientId) {
      this.exameService.getExamesByPatientId(this.selectedPatientId, this.currentPage, this.pageSize).subscribe(
        (response) => {
          if (response && Array.isArray(response.exams)) {
            this.patientExams = response.exams.filter((exam: { patientId: string | null; }) => exam.patientId === this.selectedPatientId);
            this.totalPages = response.page.totalPages;
          } else {
            console.error("Formato de resposta inesperado", response);
            this.patientExams = [];
          }
        },
        (error) => {
          console.error("Erro ao carregar exames do paciente", error);
          this.patientExams = [];
        }
      );
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPatientExams();
    }
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPatientExams();
    }
  }

  cadastrar(): void {
    if (this.form.valid) {
      const exam = {
        name: this.form.get('name')?.value,
        examDate: this.form.get('date')?.value,
        examTime: this.form.get('time')?.value,
        type: this.form.get('type')?.value,
        laboratory: this.form.get('lab')?.value,
        documentUrl: this.form.get('url')?.value,
        results: this.form.get('results')?.value,
        patientId: this.form.get('patientId')?.value
      };
      if (this.isEdit) {
        this.exameService.updateExame(this.selectedExamId, exam).subscribe(
          () => {
            Swal.fire({
              text: "Exame atualizado com sucesso!",
              icon: "success",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            }).then(() => {
              this.loadPatientExams(); 
              this.resetForm();
              this.location.go('/exames'); // Atualiza a URL
            });
          },
          (error) => {
            console.error("Erro ao atualizar exame", error);
          }
        );
      } else {
        this.exameService.addExame(exam).subscribe(
          () => {
            Swal.fire({
              text: "Exame salvo com sucesso!",
              icon: "success",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            }).then(() => {
              this.loadPatientExams(); 
              this.resetForm();
              this.location.go('/exames');
            });
          },
          (error) => {
            console.error("Erro ao salvar exame", error);
          }
        );
      }
    }
  }

  editar(examId: string): void {
    this.router.navigate(['/exame', examId]);
    this.exameService.getExameById(examId).subscribe(
      (response) => {
        const exam = response.exam;
        this.form.patchValue({
          name: exam.name,
          date: exam.examDate,
          time: exam.examTime,
          type: exam.type,
          url: exam.documentUrl,
          lab: exam.laboratory,
          results: exam.results,
          id: exam.id,
          patientId: exam.patientId 
        });
        this.isEdit = true;
        this.selectedExamId = exam.id;
        this.isFormVisible = true;
      },
      (error) => {
        console.error("Erro ao carregar exame", error);
      }
    );
  }

  deletar(examId: string): void {
    this.exameService.deleteExame(examId).subscribe(
      () => {
        Swal.fire({
          text: "Exame excluído com sucesso!",
          icon: "success",
          confirmButtonColor: "#0A7B73",
          confirmButtonText: "OK",
        }).then(() => {
          this.patientExams = this.patientExams.filter(exam => exam.id !== examId);
        });
      },
      (error) => {
        console.error("Erro ao excluir exame", error);
      }
    );
  }

  resetForm(): void {
    this.form.reset({
      date: formatDate(new Date(), "yyyy-MM-dd", "en"),
      time: formatDate(new Date(), "HH:mm", "en")
    });
    this.isEdit = false;
    this.selectedExamId = "";
  }

  selectPatient(patientId: string): void {
    this.resetForm();
    this.selectedPatientId = patientId;
    this.form.patchValue({ patientId: patientId });
    this.isFormVisible = true;
    this.loadPatientExams();
  }
}