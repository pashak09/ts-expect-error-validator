import { SourceExpectedError } from '@app/main/expectedErrorsFinder';
import { fileReader } from '@app/utils/sources/fileReader';
import { pathNormalizer } from '@app/utils/sources/pathNormalizer';
import { getLineClue } from '@app/utils/ts/getLineClue';

export async function fileParser(
  filePath: string,
): Promise<readonly SourceExpectedError[]> {
  const tsExpectedErrors: SourceExpectedError[] = [];
  let tsExpectedErrorLine: string = '';
  let lineNumber = 0;

  for await (const line of fileReader(filePath)) {
    lineNumber++;

    const {
      hasTsError,
      isComment,
      lineEndsWithTsError,
      tsExpectedLineErrorsInfo,
    } = getLineClue(line);

    //skip comments
    if (hasTsError === false && isComment === true) {
      continue;
    }

    if (lineEndsWithTsError === true && tsExpectedLineErrorsInfo !== null) {
      tsExpectedErrorLine = tsExpectedLineErrorsInfo;
    }

    if (tsExpectedErrorLine.length > 0 && isComment === false) {
      const expectedErrors: readonly string[] = tsExpectedErrorLine.split(',');

      for (const expectedError of expectedErrors) {
        const [code, message] = expectedError.trim().split('-');

        tsExpectedErrors.push({
          filePath: pathNormalizer.toUnix(filePath),
          errorLine: lineNumber,
          tsCode: code?.trim() || null,
          message: message !== undefined ? message.trim() : null,
        });
      }

      tsExpectedErrorLine = '';

      continue;
    }

    if (hasTsError === true) {
      tsExpectedErrorLine = tsExpectedLineErrorsInfo ?? ' ';
    }
  }

  return tsExpectedErrors;
}
