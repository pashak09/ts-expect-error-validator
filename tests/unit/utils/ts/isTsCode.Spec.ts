import { isTsCode } from '@app/utils/ts/isTsCode';

describe('isTsCode', (): void => {
  it('should return true when code starts with "TS"', (): void => {
    const code = 'TS1234';
    const result = isTsCode(code);

    expect(result).toBe(true);
  });

  it('should return false when code does not start with "TS"', (): void => {
    const code = 'JS1234';
    const result = isTsCode(code);

    expect(result).toBe(false);
  });
});
