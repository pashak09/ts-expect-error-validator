import { TS_EXPECT_ERROR } from '@app/main/constants';

export type LineClue = {
  readonly tsExpectErrorIndex: number;
  readonly hasTsError: boolean;
  readonly isComment: boolean;
  readonly lineStartsWithTsError: boolean;
  readonly lineEndsWithTsError: boolean;
  readonly tsExpectedLineErrorsInfo: string | null;
};

export function getLineClue(line: string): LineClue {
  const tsExpectErrorIndex = line.indexOf(TS_EXPECT_ERROR);
  const trimmedLine = line.replaceAll(' ', '');
  const isComment =
    trimmedLine.startsWith('#') ||
    trimmedLine.startsWith('//') ||
    trimmedLine.startsWith('/**') ||
    trimmedLine.startsWith('*');

  if (tsExpectErrorIndex === -1) {
    return {
      hasTsError: false,
      tsExpectErrorIndex,
      lineEndsWithTsError: false,
      lineStartsWithTsError: false,
      isComment,
      tsExpectedLineErrorsInfo: null,
    };
  }

  const cleanedLine = trimmedLine.replaceAll('//', '').replaceAll('*', '');

  const lineStartsWithTsError =
    cleanedLine.startsWith(TS_EXPECT_ERROR) ||
    cleanedLine.substring(1).startsWith(TS_EXPECT_ERROR);
  const tsExpectedErrorInfo = line
    .substring(tsExpectErrorIndex)
    .split('[')[1]
    ?.split(']')[0]
    ?.trim();

  return {
    lineStartsWithTsError,
    tsExpectErrorIndex,
    lineEndsWithTsError: lineStartsWithTsError === false,
    hasTsError: true,
    isComment,
    tsExpectedLineErrorsInfo: tsExpectedErrorInfo ?? null,
  };
}
