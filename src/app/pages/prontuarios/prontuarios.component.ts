import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { PacienteService } from "../../shared/services/paciente.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GenderPicturePipe } from "../../shared/pipes/gender-picture.pipe";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";


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
    NgxMaskDirective,
    NgxMaskPipe,
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
  currentPage: number = 0;
  pageSize: number = 12;
  totalElements: number = 0;
  isSearching: boolean = false;
  userRole: string | null = null;
  patientId: string | null = null; 
  loggedUserService: any;

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
    this.userRole = this.loggedUserService.getUserRole(); 
    this.patientId = this.loggedUserService.getPacienteId(); 
  }

  isPaciente(): boolean {
    return this.userRole === 'PACIENTE'; 
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  loadPacientes() {
    this.pacienteService.getAllPacientes(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.pacienteData = response.patients;
      this.filteredPacienteData = [...this.pacienteData];
      this.totalElements = response.page.totalElements;
    });
  }

  loadAllPacientes() {
    this.pacienteService.getAllPacientes(0, this.totalElements).subscribe((response: any) => {
      this.pacienteData = response.patients;
      this.applyFilter();
    });
  }

  filterPatients() {
    if (this.searchQuery.trim() === "") {
      this.isSearching = false;
      this.loadPacientes();
      return;
    }
    this.isSearching = true;
    this.loadAllPacientes();
  }

  applyFilter() {
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
    this.router.navigate(["/paciente/edit", patientId]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.isSearching) {
      this.applyFilter();
    } else {
      this.loadPacientes();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}