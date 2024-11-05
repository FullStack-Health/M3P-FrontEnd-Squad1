import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../shared/services/usuario.service';
import Swal from 'sweetalert2';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { LoggedUserService } from '../../core/services/logged-user.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SidebarComponent,
    ToolbarComponent,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  editarUsuarioForm!: FormGroup;
  usuarioId!: string;
  isMenuRetracted = false; 
  pageTitle: string = "Editar Usuário"; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private loggedUserService: LoggedUserService // Injeção do serviço
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id')!;

    this.editarUsuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      birthDate: ['', Validators.required],
    });

    this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
      next: (response) => {
        const usuario = response.user;
          this.editarUsuarioForm.patchValue({
          name: usuario.name,
          phone: usuario.phone,
          email: usuario.email,
          cpf: usuario.cpf,
          birthDate: usuario.birthDate,
        });
      },
      error: () => {
        Swal.fire({
          text: 'Erro ao carregar os dados do usuário.',
          icon: 'error',
          confirmButtonColor: '#FF0000',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.editarUsuarioForm.valid) {
      const usuarioAtualizado = {
        ...this.editarUsuarioForm.value,
        id: this.usuarioId,
      };

      this.usuarioService.updateUsuario(usuarioAtualizado).subscribe({
        next: () => {
          const role = this.loggedUserService.getUserRole() || 'DEFAULT_ROLE'; 
          const updatedUser = {
            name: usuarioAtualizado.name,
            role: role, // Manter a mesma role
            exp: this.loggedUserService.getLoggedUser()?.exp, 
          };
          this.loggedUserService.updateUser(updatedUser); 
          Swal.fire({
            text: 'Usuário atualizado com sucesso!',
            icon: 'success',
            confirmButtonColor: '#0A7B73',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/usuarios']);
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar o usuário:', err);
          Swal.fire({
            text: 'Erro ao atualizar o usuário.',
            icon: 'error',
            confirmButtonColor: '#FF0000',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        text: 'Por favor, preencha corretamente todos os campos obrigatórios.',
        icon: 'warning',
        confirmButtonColor: '#FF8C00',
        confirmButtonText: 'OK'
      });
    }
  }

  onDelete(): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente deletar este usuário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(this.usuarioId).subscribe({
          next: () => {
            Swal.fire({
              text: 'Usuário deletado com sucesso!',
              icon: 'success',
              confirmButtonColor: '#0A7B73',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/usuarios']); 
            });
          },
          error: (err) => {
            Swal.fire({
              text: err.message,
              icon: 'error',
              confirmButtonColor: '#FF0000',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  onSidebarRetracted() {
    this.isMenuRetracted = !this.isMenuRetracted;
  }
}
