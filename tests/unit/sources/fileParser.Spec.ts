import { fileParser } from '@app/utils/sources/fileParser';
import * as mockReaderModule from '@app/utils/sources/fileReader';
import { TsExpectedError } from '@app/utils/ts/tsOutputParser';

jest.mock('@app/utils/sources/fileReader');
jest.mock('@app/utils/ts/isTsCode');

describe('fileParser', (): void => {
  const fileReaderMock = jest.spyOn(mockReaderModule, 'fileReader');

  it('should parse file and return expected errors', async (): Promise<void> => {
    fileReaderMock.mockImplementationOnce(
      async function* (): AsyncGenerator<string> {
        yield `// @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number', TS6133 - 'num' is declared but its value is never read]`;

        yield `const num: number = 'test';`;

        yield '// this line should be ignored';

        yield 'console.log("Hello, world!");';
      },
    );

    const filePath = '/path/to/file.ts';
    const tsExpectedErrors: readonly TsExpectedError[] = [
      {
        filePath,
        errorLine: 2,
        tsCode: 'TS2322',
        message: `Type 'string' is not assignable to type 'number'`,
      },
      {
        filePath,
        errorLine: 2,
        tsCode: 'TS6133',
        message: `'num' is declared but its value is never read`,
      },
    ];

    const result = await fileParser(filePath);

    expect(fileReaderMock).toHaveBeenCalledWith(filePath);
    expect(result).toStrictEqual(tsExpectedErrors);
  });

  it('should return empty array when file does not contain any @ts-expect-error comments', async (): Promise<void> => {
    fileReaderMock.mockImplementationOnce(
      async function* (): AsyncGenerator<string> {
        yield 'const foo: number = "bar";';

        yield 'console.log("Hello, world!");';

        yield 'const bar: string = 123;';
      },
    );

    const filePath = '/path/to/file.ts';
    const result = await fileParser(filePath);

    expect(fileReaderMock).toHaveBeenCalledWith(filePath);
    expect(result).toEqual([]);
  });

  it("should return empty array when ts-expect-error doesn't related to any code line", async (): Promise<void> => {
    fileReaderMock.mockImplementationOnce(
      async function* (): AsyncGenerator<string> {
        yield 'const bar: string = 123;';

        yield `// @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number']`;
      },
    );

    const filePath = '/path/to/file.ts';
    const result = await fileParser(filePath);

    expect(fileReaderMock).toHaveBeenCalledWith(filePath);
    expect(result).toEqual([]);
  });

  it('should merge info from several ts-expect-error lines for one code line. The line starts with ts-expect-error only', async (): Promise<void> => {
    fileReaderMock.mockImplementationOnce(
      async function* (): AsyncGenerator<string> {
        yield `// @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number']`;

        yield `// @ts-expect-error [TS6133 - 'num' is declared but its value is never read]`;

        yield `const num: number = 'test';`;
      },
    );

    const filePath = '/path/to/file.ts';
    const tsExpectedErrors: readonly TsExpectedError[] = [
      {
        filePath,
        errorLine: 3,
        tsCode: 'TS2322',
        message: `Type 'string' is not assignable to type 'number'`,
      },
      {
        filePath,
        errorLine: 3,
        tsCode: 'TS6133',
        message: `'num' is declared but its value is never read`,
      },
    ];

    const result = await fileParser(filePath);

    expect(fileReaderMock).toHaveBeenCalledWith(filePath);
    expect(result).toStrictEqual(tsExpectedErrors);
  });

  it('should merge info from several ts-expect-error lines for one code line. The line ends and starts with ts-expect-error', async (): Promise<void> => {
    fileReaderMock.mockImplementationOnce(
      async function* (): AsyncGenerator<string> {
        yield `// @ts-expect-error [TS6133 - 'num' is declared but its value is never read]`;

        yield `const num: number = 'test'; // @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number']`;
      },
    );

    const filePath = '/path/to/file.ts';
    const tsExpectedErrors: readonly TsExpectedError[] = [
      {
        filePath,
        errorLine: 2,
        tsCode: 'TS6133',
        message: `'num' is declared but its value is never read`,
      },
      {
        filePath,
        errorLine: 2,
        tsCode: 'TS2322',
        message: `Type 'string' is not assignable to type 'number'`,
      },
    ];

    const result = await fileParser(filePath);

    expect(fileReaderMock).toHaveBeenCalledWith(filePath);
    expect(result).toEqual(tsExpectedErrors);
  });
});
