import { DateFormatPipe } from '../../pipes/date-format.pipe';

describe('DateFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new DateFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
