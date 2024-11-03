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
import { ConsultaService } from "../../shared/services/consulta.service";
import { PacienteService } from "../../shared/services/paciente.service";
import { Observable } from "rxjs";

@Component({
    selector: "app-consultas",
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
    templateUrl: "./consulta.component.html",
    styleUrls: ["./consulta.component.scss"],
})
export class ConsultaComponent implements OnInit {
    containerSearch: boolean = true;
    isMenuRetracted = false;
    pageTitle: string = "Cadastro de Consultas";
    form: FormGroup;
    isEdit: boolean = false;
    pacienteData: any[] = [];
    filteredPacienteData: any[] = [];
    searchQuery: string = "";
    selectedPatientId: string | null = null;
    selectedConsultaId: string = "";
    isFormVisible: boolean = false;
    patientConsultas: any[] = [];
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
            this.selectedConsultaId = params["consultaId"];
            this.containerSearch = !this.selectedConsultaId;
            if (this.selectedConsultaId) {
                this.consultaService.getConsultaById(this.selectedConsultaId).subscribe(
                    (consulta) => {
                        const patient = this.pacienteData.find((patient) =>
                            patient.consultas.some((c: { id: string }) => c.id === this.selectedConsultaId)
                        );
                        if (patient) {
                            this.selectPatient(patient.id);
                            this.editar(consulta);
                        }
                    },
                    (error) => {
                        console.error("Erro ao carregar consulta", error);
                    }
                );
            }
        });
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pacienteService: PacienteService,
        private consultaService: ConsultaService
    ) {
        this.detectScreenSize();
        this.loadPacientes();
        this.form = new FormGroup({
            appointmentReason: new FormControl("", [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
            ]),
            appointmentDate: new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en"), [
                Validators.required,
            ]),
            appointmentTime: new FormControl(formatDate(new Date(), "HH:mm", "en"), [
                Validators.required,
            ]),
            problemDescription: new FormControl("", [
                Validators.required,
                Validators.minLength(16),
                Validators.maxLength(1024),
            ]),
            prescribedMedication: new FormControl(""),
            observations: new FormControl(""),
            id: new FormControl(""),
            patientId: new FormControl("", Validators.required)
        });
    }

    loadPacientes(): void {
        this.pacienteService.getAllPacientes(this.currentPage, this.pageSize).subscribe(
            (data) => {
                if (data && Array.isArray(data.patients)) {
                    this.pacienteData = data.patients;
                    this.filteredPacienteData = [...this.pacienteData];
                    this.totalPages = data.totalPages;
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
    
                        this.filteredPacienteData.forEach(patient => {
                            this.consultaService.getConsultasByPatientId(patient.id).subscribe(consultasData => {
                                patient.consultas = consultasData.consultas; 
                            });
                        });
    
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

    loadPatientConsultas(): void {
        if (this.selectedPatientId) {
            this.consultaService.getConsultasByPatientId(this.selectedPatientId).subscribe(
                (response) => {
                    if (response && Array.isArray(response.consultas)) {
                        this.patientConsultas = response.consultas.filter((consulta: { patientId: string | null; }) => consulta.patientId === this.selectedPatientId);
                    } else {
                        console.error("Formato de resposta inesperado", response);
                        this.patientConsultas = [];
                    }
                },
                (error) => {
                    console.error("Erro ao carregar consultas do paciente", error);
                    this.patientConsultas = [];
                }
            );
        }
    }

    cadastrar(): void {
        if (this.form.valid) {
            const consulta = {
                appointmentReason: this.form.get('appointmentReason')?.value,
                appointmentDate: this.form.get('appointmentDate')?.value,
                appointmentTime: this.form.get('appointmentTime')?.value,
                problemDescription: this.form.get('problemDescription')?.value,
                prescribedMedication: this.form.get('prescribedMedication')?.value,
                observations: this.form.get('observations')?.value,
                patientId: this.form.get('patientId')?.value
            };
            if (this.isEdit) {
                this.consultaService.updateConsulta(consulta).subscribe(
                    () => {
                        Swal.fire({
                            text: "Consulta atualizada com sucesso!",
                            icon: "success",
                            confirmButtonColor: "#0A7B73",
                            confirmButtonText: "OK",
                        }).then(() => {
                            this.loadPatientConsultas();
                            this.resetForm();
                        });
                    },
                    (error) => {
                        console.error("Erro ao atualizar consulta", error);
                    }
                );
            } else {
                this.consultaService.addConsulta(consulta).subscribe(
                    () => {
                        Swal.fire({
                            text: "Consulta salva com sucesso!",
                            icon: "success",
                            confirmButtonColor: "#0A7B73",
                            confirmButtonText: "OK",
                        }).then(() => {
                            this.loadPatientConsultas();
                            this.resetForm();
                        });
                    },
                    (error) => {
                        console.error("Erro ao salvar consulta", error);
                    }
                );
            }
        }
    }

    editar(consultaId: string): void {
        this.consultaService.getConsultaById(consultaId).subscribe(
            (response) => {
                const consulta = response.consulta;
                this.form.patchValue({
                    appointmentReason: consulta.appointmentReason,
                    appointmentDate: consulta.appointmentDate,
                    appointmentTime: consulta.appointmentTime,
                    problemDescription: consulta.problemDescription,
                    prescribedMedication: consulta.prescribedMedication,
                    observations: consulta.observations,
                    id: consulta.id,
                    patientId: consulta.patientId
                });
                this.isEdit = true;
                this.selectedConsultaId = consulta.id;
                this.isFormVisible = true;
            },
            (error) => {
                console.error("Erro ao carregar consulta", error);
            }
        );
    }

    deletar(consultaId: string): void {
        this.consultaService.deleteConsulta(consultaId).subscribe(
            () => {
                Swal.fire({
                    text: "Consulta excluída com sucesso!",
                    icon: "success",
                    confirmButtonColor: "#0A7B73",
                    confirmButtonText: "OK",
                }).then(() => {
                    this.patientConsultas = this.patientConsultas.filter(consulta => consulta.id !== consultaId);
                });
            },
            (error) => {
                console.error("Erro ao excluir consulta", error);
            }
        );
    }

    resetForm(): void {
        this.form.reset({
            appointmentDate: formatDate(new Date(), "yyyy-MM-dd", "en"),
            appointmentTime: formatDate(new Date(), "HH:mm", "en")
        });
        this.isEdit = false;
        this.selectedConsultaId = "";
    }

    selectPatient(patientId: string): void {
        this.resetForm();
        this.selectedPatientId = patientId;
        this.form.patchValue({ patientId: patientId });
        this.isFormVisible = true;
        this.loadPatientConsultas();
    }

    goToNextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadPacientes();
        }
    }

    goToPreviousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadPacientes();
        }
    }
}