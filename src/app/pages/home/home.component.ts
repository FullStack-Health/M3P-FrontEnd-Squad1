import { Component, HostListener, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { PacienteService } from "../../shared/services/paciente.service";
import { CardComponent } from "../../shared/components/card/card.component";
import { FormsModule } from "@angular/forms";
import { DashboardService, DashboardMetrics } from "../../shared/services/dashboard.service"; 
import { LoggedUserService } from "../../core/services/logged-user.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    ToolbarComponent,
    FontAwesomeModule,
    CommonModule,
    CardComponent,
    FormsModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  pacienteData: any[] = [];
  filteredPacienteData: any[] = [];
  searchQuery: string = "";
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  isMenuRetracted = false;
  pageTitle: string = "Página Inicial";

  totalPatients: number = 0;
  totalConsultas: number = 0;
  totalExams: number = 0;
  totalUsers: number = 0; 
  errorMessage: string | null = null;

  userRole: string | null = null; 

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private dashboardService: DashboardService,
    private loggedUserService: LoggedUserService 
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
    this.loadDashboardMetrics();
    this.userRole = this.loggedUserService.getUserRole(); 
  }

  loadPacientes() {
    this.pacienteService.getAllPacientes(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.pacienteData = response.patients;
      this.filteredPacienteData = [...this.pacienteData];
      this.totalElements = response.page.totalElements;
    });
  }

  loadDashboardMetrics() {
    this.dashboardService.getDashboardData().subscribe(
      (data: DashboardMetrics) => {
        this.totalPatients = data.statistics.patientCount;
        this.totalConsultas = data.statistics.appointmentCount;
        this.totalExams = data.statistics.examCount;
        this.totalUsers = data.statistics.userCount; 
      },
      error => {
        this.errorMessage = 'Erro ao obter dados do dashboard';
        console.error(error);
      }
    );
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

  filterPatients() {
    const cleanedSearchQuery = this.searchQuery.trim().toLowerCase(); 

    if (cleanedSearchQuery === "") {
        this.filteredPacienteData = [...this.pacienteData];
        return;
    }

    
    this.filteredPacienteData = this.pacienteData.filter((patient) => {
        const fullName = patient.fullName.toLowerCase(); 
        const email = patient.email.toLowerCase(); 
        const phone = this.cleanString(patient.phone);

        return (
            fullName.includes(cleanedSearchQuery) ||
            email.includes(cleanedSearchQuery) ||
            phone.includes(cleanedSearchQuery)
        );
    });
}

cleanString(value: string): string {
  return value ? value.replace(/[\s()\-.\+]/g, '') : '';
}

  navigateToEdit(patientId: string) {
    this.router.navigate(["/paciente/edit", patientId]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPacientes();
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}