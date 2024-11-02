import { CommonModule, formatDate } from "@angular/common";
import { Component, HostListener, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { ActivatedRoute, Router } from "@angular/router";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ConsultaService } from "../../shared/services/consulta.service";
import { PacienteService } from "../../shared/services/paciente.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-consulta",
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
  styleUrl: "./consulta.component.scss",
})
export class ConsultaComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pacienteService = inject(PacienteService);
  private consultaService = inject(ConsultaService);

  containerSearch: boolean = true;
  isMenuRetracted = false;
  pageTitle: string = "Cadastro de consultas";
  form: FormGroup;
  isEdit: boolean = false;
  pacienteData: any[] = [];
  consultaData: any;
  filteredPacienteData: any[] = [];
  searchQuery: string = "";
  selectedPatientId: string | null = null;
  selectedConsultaId: string = "";
  isFormVisible: boolean = false;


  constructor(

  ) {
    this.detectScreenSize();

    this.form = new FormGroup({
      motive: new FormControl("", [
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
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024),
      ]),
      medication: new FormControl(""),
      dosage: new FormControl("", [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(256),
      ]),
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedConsultaId = params["consultaId"];
      this.containerSearch = !this.selectedConsultaId;

      if (this.selectedConsultaId) {
        this.consultaService.getConsultaById(this.selectedConsultaId).subscribe({
          next: (response) => {

            this.selectPatient(response.appointment.patientId);
            this.editar(response.appointment)
          },
          error: (error: Error) => {

            this.mensagemErro(error.message);
          },
        });
      }
    });
  }

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


  searchPacientes(): void {
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
      searchObservable.subscribe({
        next: (response) => {
          console.log(response);
          this.filteredPacienteData = response.patients || [];

        },
        error: (error: Error) => {
          console.error("Erro ao buscar paciente:", error.message);
          this.mensagemErro(error.message);
        }

        
      });
  }
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

  editar(consultaData: any): void {
    this.isEdit = true;
    this.consultaData = consultaData;

    this.form.patchValue({
      motive: this.consultaData.appointmentReason,
      date: this.consultaData.appointmentDate,
      time: this.consultaData.appointmentTime,
      description: this.consultaData.problemDescription,
      medication: this.consultaData.prescribedMedication,
      dosage: this.consultaData.observations,
      id: this.consultaData.id,
    });
  }

  cadastrar(): void {

    if (this.form.valid) {

      const consulta = {
        id: "",
        appointmentReason: this.form.value.motive,
        appointmentDate: this.form.value.date,
        appointmentTime: this.form.value.time,
        problemDescription: this.form.value.description,
        prescribedMedication: this.form.value.medication,
        observations: this.form.value.dosage,
        patientId: this.selectedPatientId,
      };

      if (this.isEdit) {
        consulta.id = this.selectedConsultaId;
        this.consultaService.updateConsulta(consulta).subscribe({
          next: (response) => {
            this.mensagemSucesso(response.messagem, false);
            this.router.navigate(["/consulta/"+this.selectedConsultaId]);

          },
          error: (error: Error) => {

            this.mensagemErro(error.message);
          },
        });
      } else {
        //salvar nova consulta
        this.consultaService.addConsulta(consulta).subscribe({
          next: (response) => {
            this.mensagemSucesso(response.message, true);
            this.router.navigate(["/consulta"]);
            // window.location.reload();

          },
          error: (error: Error) => {

            this.mensagemErro(error.message);
          },
        });
      }
    }
  }


  deletar(consultaId: string): void {
    this.consultaData;
    this.consultaService.deleteConsulta(this.consultaData.id).subscribe({
      next: (response) => {
        this.mensagemSucesso(response.message,false);
        this.resetForm();
        this.router.navigate(["/consulta"]);
      },
      error: (error: Error) => {
        this.mensagemErro(error.message);
      },
    });
  }

  selectPatient(patientId: string): void {
    this.selectedPatientId = patientId;
    this.isFormVisible = true;
    this.containerSearch = false;
  }

  resetForm(): void {
    this.form.reset();
    this.isEdit = false;
    this.selectedConsultaId = "";
  }



  mensagemSucesso(mensagem: string, reload: boolean): void {
    Swal.fire({
      text: mensagem,
      icon: "success",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK",
    }).then((result) => {
    if (reload) {
      window.location.reload();
    } 
  });
  }

  mensagemErro(mensagem: string): void {
    Swal.fire({
      text: mensagem,
      icon: "error",
      confirmButtonColor: "#0A7B73",
      confirmButtonText: "OK",
    });
    console.error("Erro:", mensagem);
  }

}

