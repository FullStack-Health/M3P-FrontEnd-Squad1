import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoggedUserService } from '../../../core/services/logged-user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  @Output() sidebarRetracted = new EventEmitter<boolean>();
  @Input() isRetracted: boolean = false;

  isMenuRetracted = false;
  userRole: string | null = null;
  patientId: string | null = null; 

  constructor(private loggedUserService: LoggedUserService) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.userRole = this.loggedUserService.getUserRole(); 
    this.patientId = this.loggedUserService.getPacienteId(); 
  }

  toggleMenuRetraction() {
    this.isMenuRetracted = !this.isMenuRetracted;
    this.sidebarRetracted.emit(this.isMenuRetracted);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const screenWidth = window.innerWidth;
    const smallScreenBreakpoint = 768;

    this.isMenuRetracted = screenWidth < smallScreenBreakpoint;
    this.sidebarRetracted.emit(this.isMenuRetracted);
  }

  isPaciente(): boolean {
    return this.userRole === 'PACIENTE'; 
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }
}