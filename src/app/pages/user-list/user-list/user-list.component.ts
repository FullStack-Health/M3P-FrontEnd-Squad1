import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../../shared/components/toolbar/toolbar.component";
import { UsuarioService } from "../../../shared/services/usuario.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PasswordMaskPipe } from "../../../shared/pipes/password-mask.pipe";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    FormsModule,
    ToolbarComponent,
    PasswordMaskPipe
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isMenuRetracted = false;
  pageTitle: string = "Lista de Usuários";
  userData: any[] = [];
  filteredUsuarioData: any[] = [];
  searchQuery: string = "";
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;

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
    this.loadUsuarios();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  loadUsuarios() {
    this.usuarioService.getAllUsuarios().subscribe(
      (response: any) => {
        console.log('Resposta da API:', response);
  
        if (Array.isArray(response.users)) {
          this.userData = response.users;
          this.filteredUsuarioData = [...this.userData];
          this.totalElements = response.page?.totalElements || this.userData.length;
        } else {
          console.error('Resposta inesperada da API');
        }
      },
      (error) => {
        console.error('Erro ao carregar os usuários', error);
      }
    );
  }
  
  


  filterUsuarios() {
    if (!Array.isArray(this.userData)) {
      console.error("userData is not an array");
      return;
    }
  
    
    if (this.searchQuery.trim() === "") {
      this.filteredUsuarioData = [...this.userData];
      return;
    }
  
    this.filteredUsuarioData = this.userData.filter((usuario) => {
      const loginMatches = usuario.login?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const idMatches = usuario.id?.toString().includes(this.searchQuery);
      const emailMatches = usuario.email?.toLowerCase().includes(this.searchQuery.toLowerCase());
  
      return loginMatches || idMatches || emailMatches;
    });
  }
  
  

  navigateToEdit(usuarioId: string) {
    this.router.navigate(["/usuarios/edit", usuarioId]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsuarios();
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }
}
