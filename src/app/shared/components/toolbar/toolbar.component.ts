import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-toolbar",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./toolbar.component.html",
  styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  @Input() isMenuRetracted: boolean = false;
  @Input() pageTitle: string = "Default Title";

  userData: any;
  ngOnInit(): void {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    this.userData = loggedUser;
  }

  constructor() {}

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
