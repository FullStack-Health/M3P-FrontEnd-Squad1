import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../shared/services/usuario.service';
import Swal from 'sweetalert2';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, SidebarComponent, ToolbarComponent, CommonModule, NgxMaskDirective,
    NgxMaskPipe,],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  editarUsuarioForm!: FormGroup;
  usuarioId!: string;
  password!: string;
  role!: string; 
  isMenuRetracted = false; // Adicione esta linha
  pageTitle: string = "Editar Usuário"; // Adicione esta linha

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id')!;

    // Inicializa o formulário
    this.editarUsuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      birthDate: ['', Validators.required],
    });

    // Buscar os dados do usuário
    this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
      next: (response) => {
        const usuario = response.user; // Acessa a propriedade "user"
        console.log(usuario); // Verificar os dados recebidos

        // Armazena a senha (mascarada) e a role
        this.password = usuario.maskedPassword; // Aqui você captura a senha mascarada
        this.role = usuario.role; // Aqui você captura a role

        // Atualiza o formulário com os dados do usuário
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
    console.log(this.editarUsuarioForm.value);
    console.log(this.editarUsuarioForm.valid);
    console.log(this.editarUsuarioForm.errors);
    
    if (this.editarUsuarioForm.valid) {
      const usuarioAtualizado = {
        ...this.editarUsuarioForm.value,
        id: this.usuarioId,  // Atribuindo o ID corretamente
        role: this.role, // Mantém a role existente
        password: this.password, // Incluindo a senha armazenada
      };      
  
      // Verifique a estrutura do objeto antes de enviar
      console.log('Dados a serem enviados:', usuarioAtualizado);
  
      this.usuarioService.updateUsuario(usuarioAtualizado).subscribe({
        next: () => {
          Swal.fire({
            text: 'Usuário atualizado com sucesso!',
            icon: 'success',
            confirmButtonColor: '#0A7B73',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/admin']);
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar o usuário:', err); // Mostre o erro no console
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
    // Confirmação de exclusão
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
        // Chama o serviço para deletar o usuário
        this.usuarioService.deleteUsuario(this.usuarioId).subscribe({
          next: () => {
            Swal.fire({
              text: 'Usuário deletado com sucesso!',
              icon: 'success',
              confirmButtonColor: '#0A7B73',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/admin']); // Redireciona após a exclusão
            });
          },
          error: () => {
            Swal.fire({
              text: 'Erro ao deletar o usuário.',
              icon: 'error',
              confirmButtonColor: '#FF0000',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  // Método para alternar a visibilidade do menu
  onSidebarRetracted() {
    this.isMenuRetracted = !this.isMenuRetracted;
  }
}
