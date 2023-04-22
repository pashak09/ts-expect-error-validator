import {
  BaseTsExpectedError,
  TsFilePathLineCodeErrorKey,
} from '@app/main/index';
import { LoggerInterface } from '@app/main/logger/LoggerInterface';
import { pathNormalizer } from '@app/utils/sources/pathNormalizer';
import { sourceWalker } from '@app/utils/sources/sourceWalker';

export type SourceExpectedError = BaseTsExpectedError & {
  readonly message: string | null;
  readonly tsCode: string | null;
};

export type SourceExpectedErrorsMap = Map<
  TsFilePathLineCodeErrorKey,
  SourceExpectedError
>;

export type ExpectedErrorsFinder = (
  sourceDirectories: readonly string[],
  logger: LoggerInterface,
) => Promise<SourceExpectedErrorsMap>;

export async function expectedErrorsFinder(
  sourcePaths: readonly string[],
  logger: LoggerInterface,
): Promise<SourceExpectedErrorsMap> {
  const expectedErrorsMap: SourceExpectedErrorsMap = new Map();
  const normalizedPaths: readonly string[] = sourcePaths.map(
    pathNormalizer.normalize,
  );

  await Promise.all(
    normalizedPaths.map(
      async (sourcePath: string): Promise<void> =>
        sourceWalker(sourcePath, expectedErrorsMap, logger),
    ),
  );

  return expectedErrorsMap;
}
