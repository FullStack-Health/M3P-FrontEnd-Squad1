import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgePipe } from '../pipes/age.pipe';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { GenderPicturePipe } from '../pipes/gender-picture.pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FontAwesomeModule, AgePipe, NgxMaskDirective, NgxMaskPipe, GenderPicturePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() patient: any;

  @Output() editPatient: EventEmitter<string> = new EventEmitter<string>();

  editarCadastro(patientId: string) {
    this.editPatient.emit(patientId);
  }
  
}
