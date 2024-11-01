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
      this.selectedExamId = params["examId"];
      this.containerSearch = !this.selectedExamId;
      if (this.selectedExamId) {
        this.exameService.getExameById(this.selectedExamId).subscribe(
          (exam) => {
            const patient = this.pacienteData.find((patient) =>
              patient.exams.some((e: { id: string }) => e.id === this.selectedExamId)
            );
            if (patient) {
              this.selectPatient(patient.id);
              this.editar(exam);
            }
          },
          (error) => {
            console.error("Erro ao carregar exame", error);
          }
        );
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private exameService: ExameService
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
    const lowercaseSearchQuery = this.searchQuery.trim().toLowerCase();
    if (lowercaseSearchQuery !== "") {
      this.pacienteService.getPacientesByName(lowercaseSearchQuery).subscribe(
        (data) => {
          if (data && Array.isArray(data.patients)) {
            this.filteredPacienteData = data.patients;
            if (this.filteredPacienteData.length === 1) {
              const patientId = this.filteredPacienteData[0].id;
              this.selectPatient(patientId);
            } else {
              this.resetSearch();
            }
          } else {
            console.error("Formato de resposta inesperado", data);
            this.resetSearch();
          }
        },
        (error) => {
          if (error.message === "Paciente não encontrado.") {
            Swal.fire({
              text: "Paciente não encontrado.",
              icon: "warning",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload();
            });
          } else {
            console.error("Erro ao filtrar pacientes", error);
            this.resetSearch();
          }
        }
      );
    } else {
      this.resetSearch();
    }
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
      this.exameService.getExamesByPatientId(this.selectedPatientId).subscribe(
        (response) => {
          if (response && Array.isArray(response.exams)) {
            this.patientExams = response.exams.filter((exam: { patientId: string | null; }) => exam.patientId === this.selectedPatientId);
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