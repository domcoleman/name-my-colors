// not tesing extensively as the library was not written by me
// just making sure it's been adapted properly
import { nameThatColor } from '@/store/helpers/ntc';

describe('nameThatColor', () => {
  it('returns with a perfect match when it exists', () => {
    const result = nameThatColor('000000');
    expect(result).toBe('Black');
  });

  it('returns the closest color when exact does not exist', () => {
    const result = nameThatColor('436193');
    expect(result).toBe('Kashmir Blue');
  });
});
