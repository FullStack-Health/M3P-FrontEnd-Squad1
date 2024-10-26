import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Output() sidebarRetracted = new EventEmitter<boolean>();
  @Input() isRetracted: boolean = false;

  isMenuRetracted = false;

  constructor() {
    this.checkScreenSize();
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

}
