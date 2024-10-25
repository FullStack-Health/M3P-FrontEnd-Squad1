import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singin-signup-page',
  standalone: true,
  imports: [LoginComponent, SignUpComponent, CommonModule],
  templateUrl: './singin-signup-page.component.html',
  styleUrl: './singin-signup-page.component.scss'
})
export class SinginSignupPageComponent {
  isSignDivVisible: boolean = true;


  isMobile: boolean;

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', this.handleResize.bind(this)); 
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize); 
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768; 
  }

}
