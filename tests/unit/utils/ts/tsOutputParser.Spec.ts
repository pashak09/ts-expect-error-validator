import { BaseTsExpectedError } from '@app/types/BaseTsExpectedError';
import { tsExpectedErrorKeyMapGenerator } from '@app/utils/ts/tsExpectedErrorKeyMapGenerator';
import {
  TsOutputErrorsMap,
  tsOutputParser,
} from '@app/utils/ts/tsOutputParser';

describe('tsOutputParser', (): void => {
  it('parses the output correctly', (): void => {
    const sampleOutput = `
    file.ts(1,2): error TS1234: Something went wrong
    anotherFile.ts(10,1): error TS5678: Something else went wrong
  `;

    const parsedErrors = tsOutputParser(sampleOutput);
    const expectedErrors: readonly BaseTsExpectedError[] = [
      {
        errorLine: 1,
        filePath: 'file.ts',
        message: 'Something went wrong',
        tsCode: 'TS1234',
      },
      {
        errorLine: 10,
        filePath: 'anotherFile.ts',
        message: 'Something else went wrong',
        tsCode: 'TS5678',
      },
    ];

    for (const expectedError of expectedErrors) {
      const key = tsExpectedErrorKeyMapGenerator(expectedError);

      expect(parsedErrors.has(key)).toEqual(true);
      expect(parsedErrors.get(key)).toEqual(expectedError);
    }
  });

  it('should remove a dot at the end of error description', (): void => {
    const sampleOutput = `
    file.ts(1,2): error TS1234: Something went wrong.
  `;

    const parsedErrors = tsOutputParser(sampleOutput);
    const expectedError: BaseTsExpectedError = {
      errorLine: 1,
      filePath: 'file.ts',
      message: 'Something went wrong',
      tsCode: 'TS1234',
    };

    expect(parsedErrors.size).toEqual(1);
    const key = tsExpectedErrorKeyMapGenerator(expectedError);

    expect(parsedErrors.has(key)).toEqual(true);
    expect(parsedErrors.get(key)).toEqual(expectedError);
  });

  it('should not to throw an exception if there is not Ts error', (): void => {
    const badOutput = `
      file.ts(1,2): error Something went wrong
    `;

    expect((): TsOutputErrorsMap => tsOutputParser(badOutput)).not.toThrow(
      'Cannot parse the error message line:',
    );
  });
});
