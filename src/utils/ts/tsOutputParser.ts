import { TsParserException } from '@app/exceptions/TsParserException';
import { BaseTsExpectedError, TsFilePathLineCodeErrorKey } from '@app/main';
import { isTsCode } from '@app/utils/ts/isTsCode';
import { tsExpectedErrorKeyMapGenerator } from '@app/utils/ts/tsExpectedErrorKeyMapGenerator';

export type TsExpectedError = BaseTsExpectedError & {
  readonly message: string;
  readonly tsCode: string;
};

export type TsOutputErrorsMap = Map<
  TsFilePathLineCodeErrorKey,
  TsExpectedError
>;

export function tsOutputParser(output: string): TsOutputErrorsMap {
  const tsOutputErrorsMap: Map<TsFilePathLineCodeErrorKey, TsExpectedError> =
    new Map();
  const lines: readonly string[] = output.split('\n');

  for (const line of lines) {
    if (line.indexOf('error TS') === -1) {
      continue;
    }

    const [filePathInfo, tsError] = line.trim().split(' error ', 2);

    if (filePathInfo === undefined || tsError === undefined) {
      throw new TsParserException(
        `Cannot parse the error message line: \n ${line}`,
      );
    }

    const separator = tsError.indexOf(':');
    const message = tsError.substring(separator + 1).trim();
    const code = tsError.substring(0, separator).trim();

    if (isTsCode(code) === false) {
      throw new TsParserException(
        `Cannot parse the error message line: \n ${line}`,
      );
    }

    const braceLastIndexOf = filePathInfo.lastIndexOf('(');
    const filePath = filePathInfo.substring(0, braceLastIndexOf);
    const [errorLine] = filePathInfo
      .substring(braceLastIndexOf + 1, filePathInfo.length - 1)
      .split(',');

    if (errorLine === undefined) {
      throw new TsParserException(
        `Cannot parse the error message line from a filePath: "${filePathInfo}"`,
      );
    }

    const newTsError: TsExpectedError = {
      filePath,
      errorLine: parseInt(errorLine),
      tsCode: code.trim(),
      message: message.endsWith('.')
        ? message.substring(0, message.length - 1)
        : message,
    };

    tsOutputErrorsMap.set(
      tsExpectedErrorKeyMapGenerator(newTsError),
      newTsError,
    );
  }

  return tsOutputErrorsMap;
}
