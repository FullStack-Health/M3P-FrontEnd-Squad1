import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordMask',
  standalone: true
})
export class PasswordMaskPipe implements PipeTransform {
  transform(senha: string): string {
    if (!senha) return '*******'; 
    const visivel = senha.substring(0, 7);
    return visivel;
  }
}
