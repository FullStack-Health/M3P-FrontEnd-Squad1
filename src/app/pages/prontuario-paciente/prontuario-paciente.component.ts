import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { ProntuarioService } from "../../shared/services/prontuario.service";
import { GenderPicturePipe } from "../../shared/pipes/gender-picture.pipe";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-prontuario-paciente",
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    ToolbarComponent,
    FontAwesomeModule,
    CommonModule,
    GenderPicturePipe,
  ],
  templateUrl: "./prontuario-paciente.component.html",
  styleUrls: ["./prontuario-paciente.component.scss"],
})
export class ProntuarioPacienteComponent implements OnInit {
  isMenuRetracted = false;
  pageTitle: string = "Prontuário do Paciente";
  patient: any;

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
      const pacienteId = params["id"];
      if (pacienteId) {
        this.loadProntuario(pacienteId);
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prontuarioService: ProntuarioService
  ) {
    this.detectScreenSize();
  }

  loadProntuario(pacienteId: string) {
    this.prontuarioService.getProntuarioByPacienteId(pacienteId).subscribe(
      (response: any) => {
        this.patient = response.record.patient;
        this.patient.exams = response.record.exams;
        this.patient.consultas = response.record.appointments;
      },
      (error) => {
        console.error("Erro ao carregar prontuário", error);
      }
    );
  }

  editarExame(examId: string): void {
    this.router.navigate(["/exame", examId]);
  }

  editarConsulta(consultaId: string): void {
    this.router.navigate(["/consulta", consultaId]);
  }
}