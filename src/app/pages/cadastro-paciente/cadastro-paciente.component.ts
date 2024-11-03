import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { PacienteService } from "../../shared/services/paciente.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ViaCepService } from "../../shared/services/via-cep.service";
import { DateFormatPipe } from "../../shared/pipes/date-format.pipe";

@Component({
  selector: "app-cadastro-paciente",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    ToolbarComponent,
    SweetAlert2Module,
    NgxMaskDirective,
    NgxMaskPipe,
    DateFormatPipe,
  ],
  templateUrl: "./cadastro-paciente.component.html",
  styleUrl: "./cadastro-paciente.component.scss",
})
export class CadastroPacienteComponent implements OnInit {
  isMenuRetracted = false;
  pageTitle: string = "Cadastro de Pacientes";
  showAddress: boolean = false;
  form: FormGroup;
  isEdit: boolean = false;
  isSubmitting: boolean = false;
  pacienteId: string | null = null; 

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private viaCepService: ViaCepService
  ) {
    this.detectScreenSize();
    this.form = new FormGroup({
      fullName: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      gender: new FormControl("", Validators.required),
      birthDate: new FormControl("", Validators.required),
      cpf: new FormControl("", Validators.required),
      rg: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      rgIssuer: new FormControl("", Validators.required),
      maritalStatus: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      placeOfBirth: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      emergencyContact: new FormControl("", Validators.required),
      allergies: new FormControl("", Validators.required),
      specificCare: new FormControl(""),
      healthInsurance: new FormControl(""),
      healthInsuranceNumber: new FormControl(""),
      healthInsuranceValidity: new FormControl(""),
      zipCode: new FormControl("", Validators.required),
      state: new FormControl({ value: "", disabled: true }),
      city: new FormControl({ value: "", disabled: true }),
      street: new FormControl({ value: "", disabled: true }),
      number: new FormControl("", Validators.required),
      complement: new FormControl(""),
      neighborhood: new FormControl({ value: "", disabled: true }),
      referencePoint: new FormControl("")
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.pacienteId = params["id"]; 
      if (this.pacienteId) {
        this.pacienteService.getPacienteById(this.pacienteId).subscribe((response) => {
          if (response && response.patient) {
            this.isEdit = true;
            this.form.patchValue({
              ...response.patient,
              birthDate: this.formatDate(response.patient.birthDate),
              allergies: response.patient.allergies.join(', '),
              specificCare: response.patient.specificCare.join(', ')
            });
          }
        });
      }
    });

    this.form.get("zipCode")?.valueChanges.subscribe((cep) => {
      const sanitizedCep = cep.replace("-", "");
      if (sanitizedCep.length === 8) {
        this.viaCepService.get(sanitizedCep).subscribe((address) => {
          this.form.patchValue({
            state: address.uf,
            city: address.localidade,
            street: address.logradouro,
            neighborhood: address.bairro,
          });
        });
      } else if (cep === null || cep === "") {
        this.form.patchValue({
          state: null,
          city: null,
          street: null,
          neighborhood: null,
        });
      }
    });
  }

  cadastrar() {
    if (this.isSubmitting) {
      return;
    }
  
    if (this.form.valid) {
      this.isSubmitting = true;
      const pacienteData: any = {
        ...this.form.value,
        birthDate: this.formatDate(this.form.value.birthDate),
        allergies: this.form.value.allergies.split(',').map((allergy: string) => allergy.trim()),
        specificCare: this.form.value.specificCare.split(',').map((care: string) => care.trim()),
        cpf: this.form.value.cpf.replace(/\D/g, ''), 
        zipCode: this.form.value.zipCode.replace(/\D/g, ''), 
        state: this.form.get('state')?.value,
        city: this.form.get('city')?.value,
        street: this.form.get('street')?.value,
        neighborhood: this.form.get('neighborhood')?.value
      };
  
      if (this.form.value.healthInsuranceValidity) {
        pacienteData.healthInsuranceValidity = this.formatDate(this.form.value.healthInsuranceValidity);
      }
  
      if (this.isEdit) {
        pacienteData.id = this.pacienteId;
        this.pacienteService.updatePaciente(pacienteData).subscribe({
          next: (response) => {
            Swal.fire({
              text: response.message || "Cadastro atualizado com sucesso!",
              icon: "success",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            });
            this.router.navigate(["/home"]);
          },
          error: (error) => {
            this.isSubmitting = false;
          }
        });
      } else {
        this.pacienteService.addPaciente(pacienteData).subscribe({
          next: (response) => {
            Swal.fire({
              text: response.message || "Paciente cadastrado com sucesso!",
              icon: "success",
              confirmButtonColor: "#0A7B73",
              confirmButtonText: "OK",
            });
            this.router.navigate(["/home"]);
          },
          error: (error) => {
            this.isSubmitting = false;
          }
        });
      }
    } else {
      Swal.fire({
        text: "Por favor, preencha todos os campos corretamente.",
        icon: "error",
        confirmButtonColor: "#0A7B73",
      });
    }
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  hasConsultasOrExams(patientId: string): boolean {
    // Implementar lógica para verificar consultas ou exames
    return false;
  }

  deletePatient() {
    if (this.isEdit && this.pacienteId) {
      const hasConsultasOrExams = this.hasConsultasOrExams(this.pacienteId);
  
      if (hasConsultasOrExams) {
        Swal.fire({
          text: "Paciente não pode ser excluído. Para excluir, exclua exames e consultas relacionadas a esse paciente!",
          icon: "error",
          confirmButtonColor: "#0A7B73",
          confirmButtonText: "OK",
        });
        this.router.navigate(["/home"]);
        return;
      } else {
        this.pacienteService.deletePaciente(this.pacienteId).subscribe(() => {
          Swal.fire({
            text: "Paciente excluído com sucesso!",
            icon: "success",
            confirmButtonColor: "#0A7B73",
            confirmButtonText: "OK",
          });
          this.router.navigate(["/home"]);
        });
      }
    }
  }
}