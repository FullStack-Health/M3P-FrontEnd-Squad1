import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderPicture',
  standalone: true
})
export class GenderPicturePipe implements PipeTransform {

  transform(gender: string): string {
    switch (gender) {
      case 'Homem cis':
        return 'assets/pictures/homem-cis.png';
      case 'Mulher cis':
        return 'assets/pictures/mulher-cis.png';
      case 'Mulher trans':
        return 'assets/pictures/mulher-trans.png';
      case 'Homem trans':
        return 'assets/pictures/homem-trans.png';
      case 'Não binário':
        return 'assets/pictures/nao-binario.png';
      case 'Prefiro não informar':
        return 'assets/pictures/nao-informado.png';
      default:
        return 'assets/pictures/nao-informado.png';
    }
  }

}
