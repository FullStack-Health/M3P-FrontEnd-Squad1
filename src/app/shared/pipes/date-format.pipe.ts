import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    const [year, month, day] = value.split('-');
    return `${day}-${month}-${year}`;
  }

}
