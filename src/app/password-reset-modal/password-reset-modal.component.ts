import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service'; 

@Component({
  selector: 'app-password-reset-modal',
  templateUrl: './password-reset-modal.component.html',
  styleUrls: ['./password-reset-modal.component.scss']
})
export class PasswordResetModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  resetForm: FormGroup;

  constructor(private authService: AuthenticationService) {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]), 
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { email, newPassword } = this.resetForm.value;
      this.authService.updatePassword(email, newPassword).subscribe({
        next: () => {
          alert('Senha atualizada com sucesso!');
          this.closeModal.emit();
        },
        error: () => {
          alert('Erro ao atualizar a senha. Usuário não encontrado.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  close() {
    this.closeModal.emit(); 
  }
}