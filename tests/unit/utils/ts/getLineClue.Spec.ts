import { getLineClue, LineClue } from '@app/utils/ts/getLineClue';

describe('getLineClue', (): void => {
  it.each([
    [
      "// @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number']",
      {
        tsExpectErrorIndex: 3,
        hasTsError: true,
        isComment: true,
        lineStartsWithTsError: true,
        lineEndsWithTsError: false,
        tsExpectedLineErrorsInfo:
          "TS2322 - Type 'string' is not assignable to type 'number'",
      },
    ],
    [
      "const num: number = 'test'; // @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number']",
      {
        tsExpectErrorIndex: 31,
        hasTsError: true,
        isComment: false,
        lineStartsWithTsError: false,
        lineEndsWithTsError: true,
        tsExpectedLineErrorsInfo:
          "TS2322 - Type 'string' is not assignable to type 'number'",
      },
    ],
    [
      '',
      {
        tsExpectErrorIndex: -1,
        hasTsError: false,
        isComment: false,
        lineStartsWithTsError: false,
        lineEndsWithTsError: false,
        tsExpectedLineErrorsInfo: null,
      },
    ],
    [
      '//an empty comment',
      {
        tsExpectErrorIndex: -1,
        hasTsError: false,
        isComment: true,
        lineStartsWithTsError: false,
        lineEndsWithTsError: false,
        tsExpectedLineErrorsInfo: null,
      },
    ],
    [
      "// my comment before ts-expect-error @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number']",
      {
        hasTsError: true,
        isComment: true,
        lineEndsWithTsError: true,
        lineStartsWithTsError: false,
        tsExpectErrorIndex: 37,
        tsExpectedLineErrorsInfo:
          "TS2322 - Type 'string' is not assignable to type 'number'",
      },
    ],
    [
      ' ? // @ts-expect-error[TS18046]',
      {
        hasTsError: true,
        isComment: false,
        lineEndsWithTsError: false,
        lineStartsWithTsError: true,
        tsExpectErrorIndex: 6,
        tsExpectedLineErrorsInfo: 'TS18046',
      },
    ],
    [
      '// @ts-expect-error[TS18046]',
      {
        hasTsError: true,
        isComment: true,
        lineEndsWithTsError: false,
        lineStartsWithTsError: true,
        tsExpectErrorIndex: 3,
        tsExpectedLineErrorsInfo: 'TS18046',
      },
    ],
  ])(
    'should return correct LineClue for line: %s',
    (line: string, expected: LineClue): void => {
      const result = getLineClue(line);

      expect(result).toStrictEqual(expected);
    },
  );
});
