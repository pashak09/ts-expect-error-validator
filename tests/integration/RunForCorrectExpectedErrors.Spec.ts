import { rm, writeFile } from 'fs/promises';
import path from 'path';

import tsConfig from '@app/../tsconfig.json';
import { OutputFormat } from '@app/enums/OutputFormat';
import { ValidationMode } from '@app/enums/ValidationMode';
import { run } from '@app/main';
import { expectedErrorsFinder } from '@app/main/expectedErrorsFinder';
import { fileReplacer } from '@app/main/fileReplacer';
import { reportAggregator } from '@app/main/reportAggregator';

import { DummyLogger } from '../DummyLogger';
import { shortStringGenerator } from '../shortStringGenerator';

describe('Tests files with correct ts expected errors', (): void => {
  const tsTestConfigFile = path.resolve(
    __dirname,
    '../../',
    `tsconfig.${shortStringGenerator()}.json`,
  );
  const sourcePath = 'tests/integration/src/correctExpectedErrors';

  beforeAll(async (): Promise<void> => {
    await writeFile(
      tsTestConfigFile,
      JSON.stringify({
        ...tsConfig,
        include: [`${sourcePath}/**/*`],
      }),
    );
  });

  afterAll(async (): Promise<void> => {
    await rm(tsTestConfigFile);
  });

  it('should find no missing expected errors', async (): Promise<void> => {
    const { hasTsErrors, reportData } = await run(
      {
        validationMode: ValidationMode.STRICT,
        quiet: true,
        outputFormat: OutputFormat.HUMAN,
        restore: true,
        debug: false,
        tsConfigPath: tsTestConfigFile,
        sourcePaths: [sourcePath],
      },
      {
        logger: new DummyLogger(),
        expectedErrorsFinder,
        fileReplacer,
        reportAggregator,
      },
    );

    expect(reportData).toStrictEqual({
      missingTsExpectedErrors: [],
      invalidTsExpectedMessages: [],
      notRelevantTsExpectedErrors: [],
    });
    expect(hasTsErrors).toEqual(false);
  }, 70000);
});
