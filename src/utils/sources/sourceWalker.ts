import { readdir, stat } from 'fs/promises';
import { extname, join } from 'path';

import { SourceExpectedErrorsMap } from '@app/main/expectedErrorsFinder';
import { LoggerInterface } from '@app/main/logger/LoggerInterface';
import { fileParser } from '@app/utils/sources/fileParser';
import { tsExpectedErrorKeyMapGenerator } from '@app/utils/ts/tsExpectedErrorKeyMapGenerator';

const AVAILABLE_EXTENSIONS = new Set(['.ts', '.tsx']);

export async function sourceWalker(
  sourcePath: string,
  sourceExpectedErrorsMap: SourceExpectedErrorsMap,
  logger: LoggerInterface,
): Promise<void> {
  const stats = await stat(sourcePath);

  if (
    stats.isFile() === true &&
    AVAILABLE_EXTENSIONS.has(extname(sourcePath))
  ) {
    logger.debug(`Check the ${sourcePath}`);

    const tsExpectedErrors = await fileParser(sourcePath);

    for (const sourceTsExpectedError of tsExpectedErrors) {
      sourceExpectedErrorsMap.set(
        tsExpectedErrorKeyMapGenerator(sourceTsExpectedError),
        sourceTsExpectedError,
      );
    }
  }

  if (stats.isDirectory() === true) {
    const files: readonly string[] = await readdir(sourcePath);

    await Promise.all(
      files.map(
        async (fileName: string): Promise<void> =>
          sourceWalker(
            join(sourcePath, fileName),
            sourceExpectedErrorsMap,
            logger,
          ),
      ),
    );
  }
}
