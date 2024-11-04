import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgePipe } from "../../pipes/age.pipe";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { GenderPicturePipe } from "../../pipes/gender-picture.pipe";
import { RouterOutlet } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [
    FontAwesomeModule,
    AgePipe,
    NgxMaskDirective,
    NgxMaskPipe,
    GenderPicturePipe,
    RouterOutlet
  ],
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})

export class CardComponent {

  constructor(private router: Router) {}

  @Input() patient: any;

  @Output() editPatient: EventEmitter<string> = new EventEmitter<string>();

  editarCadastro(patientId: string) {
    this.router.navigate(["/prontuarios", patientId]);
  }
}