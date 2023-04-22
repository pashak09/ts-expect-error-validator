import { tsExpectedErrorKeyMapGenerator } from '@app/utils/ts/tsExpectedErrorKeyMapGenerator';
import { TsExpectedError } from '@app/utils/ts/tsOutputParser';

describe('tsExpectedErrorKeyMapGenerator', (): void => {
  it('should concatenate errorLine, filePath, and tsCode with "-"', (): void => {
    const error: TsExpectedError = {
      errorLine: 10,
      filePath: 'path/to/file.ts',
      message: `Type 'string' is not assignable to type 'number'`,
      tsCode: 'TS2322',
    };
    const result = tsExpectedErrorKeyMapGenerator(error);

    expect(result).toBe('path/to/file.ts-10-TS2322');
  });

  it('should handle file paths with "-"', (): void => {
    const error: TsExpectedError = {
      errorLine: 5,
      filePath: 'path/with-dash/file.ts',
      message: `Type 'string' is not assignable to type 'number'`,
      tsCode: 'TS2322',
    };
    const result = tsExpectedErrorKeyMapGenerator(error);

    expect(result).toBe('path/with-dash/file.ts-5-TS2322');
  });

  it('should handle tsCodes with "-"', (): void => {
    const error: TsExpectedError = {
      errorLine: 10,
      filePath: 'path/to/file.ts',
      message: `Type 'string' is not assignable to type 'number'`,
      tsCode: 'TS-2322',
    };
    const result = tsExpectedErrorKeyMapGenerator(error);

    expect(result).toBe('path/to/file.ts-10-TS-2322');
  });
});
