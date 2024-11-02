import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { PacienteService } from "../../shared/services/paciente.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GenderPicturePipe } from "../../shared/pipes/gender-picture.pipe";

@Component({
  selector: "app-prontuarios",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    FormsModule,
    ToolbarComponent,
    FontAwesomeModule,
    GenderPicturePipe,
  ],
  templateUrl: "./prontuarios.component.html",
  styleUrl: "./prontuarios.component.scss",
})
export class ProntuariosComponent implements OnInit {
  isMenuRetracted = false;
  pageTitle: string = "Prontuários";
  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];
  searchQuery: string = "";

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
    this.loadPacientes();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  loadPacientes() {
    this.pacienteService.getAllPacientes().subscribe((response: any) => {
      this.pacienteData = response.patients; 
      this.filteredPacienteData = [...this.pacienteData];
    });
  }

  filterPatients() {
    if (this.searchQuery.trim() === "") {
      this.filteredPacienteData = [...this.pacienteData];
      return;
    }
    this.filteredPacienteData = this.pacienteData.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        patient.id.toString().includes(this.searchQuery)
    );
  }

  navigateToProntuario(patientId: string) {
    this.router.navigate(["/prontuarios", patientId]);
  }

  navigateToEdit(patientId: string) {
    this.router.navigate(["/editar-paciente", patientId]);
  }
}