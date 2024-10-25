import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }


  onSubmit(loginForm: FormGroup) {
    const storedData = JSON.parse(localStorage.getItem('cadastroData') || '[]');
    const email = loginForm.get('email')?.value;
    const password = loginForm.get('password')?.value;
  
    const user = storedData.find((userData: any) => userData.email === email && userData.senha === password);
  
    if (user != undefined) {

      localStorage.setItem('loggedUser', JSON.stringify(user))
      this.router.navigate(['/home']); 
      
    } else {
      alert('Usuário ou senha inválidos');
    }
  }

  

  esqueciSenha(loginForm: FormGroup) {
    const storedData = JSON.parse(localStorage.getItem('cadastroData') || '[]');
    const email = loginForm.get('email')?.value;
  
    const userIndex = storedData.findIndex((userData: any) => userData.email === email);
  
    if (userIndex !== -1) {
      storedData[userIndex].senha = 'a1b2c4d4';
      localStorage.setItem('cadastroData', JSON.stringify(storedData));
      alert('Sua senha foi alterada para a senha padrão: a1b2c4d4. Por favor, prossiga utilizando essa senha.');
    } else {
      alert('Usuário não encontrado');
    }
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }

}