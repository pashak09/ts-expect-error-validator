import { rm, writeFile } from 'fs/promises';
import { resolve } from 'path';

import tsConfig from '@app/../tsconfig.json';
import { OutputFormat } from '@app/enums/OutputFormat';
import { ValidationMode } from '@app/enums/ValidationMode';
import { run } from '@app/main';
import { expectedErrorsFinder } from '@app/main/expectedErrorsFinder';
import { fileReplacer } from '@app/main/fileReplacer';
import { reportAggregator } from '@app/main/reportAggregator';

import { DummyLogger } from '../DummyLogger';
import { shortStringGenerator } from '../shortStringGenerator';

describe('Tests files with wrong ts expected errors', (): void => {
  const tsTestConfigFile = resolve(
    __dirname,
    '../../',
    `tsconfig.${shortStringGenerator()}.json`,
  );
  const sourcePath = 'tests/integration/src/wrongExpectedErrors';

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

  it('should find all wrong ts expected errors', async (): Promise<void> => {
    const { hasTsErrors, reportData } = await run(
      {
        validationMode: ValidationMode.STRICT,
        quiet: true,
        outputFormat: OutputFormat.HUMAN,
        debug: false,
        restore: true,
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
      invalidTsExpectedMessages: [
        {
          actualTsError: {
            errorLine: 14,
            filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
            message: "Type 'number' is not assignable to type 'string'",
            tsCode: 'TS2322',
          },
          expectedTsError: {
            errorLine: 14,
            filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
            message: 'teere',
            tsCode: 'TS2322',
          },
        },
        {
          actualTsError: {
            errorLine: 37,
            filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
            message:
              "Argument of type 'Admin' is not assignable to parameter of type 'User'",
            tsCode: 'TS2345',
          },
          expectedTsError: {
            errorLine: 37,
            filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
            message: 'invalid',
            tsCode: 'TS2345',
          },
        },
      ],
      missingTsExpectedErrors: [
        {
          errorLine: 7,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: "'object' is declared but its value is never read",
          tsCode: 'TS6133',
        },
        {
          errorLine: 9,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: "Type 'number' is not assignable to type 'string'",
          tsCode: 'TS2322',
        },
        {
          errorLine: 14,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: "'array' is declared but its value is never read",
          tsCode: 'TS6133',
        },
        {
          errorLine: 18,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: "Type 'string' is not assignable to type 'number'",
          tsCode: 'TS2322',
        },
        {
          errorLine: 18,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: "'myNumber2' is declared but its value is never read",
          tsCode: 'TS6133',
        },
      ],
      notRelevantTsExpectedErrors: [
        {
          errorLine: 7,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: "'object' is declared but its value is never read",
          tsCode: 'TSInvalidCode',
        },
        {
          errorLine: 9,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: 'invalid message',
          tsCode: 'TS123',
        },
        {
          errorLine: 18,
          filePath: 'tests/integration/src/wrongExpectedErrors/index.ts',
          message: null,
          tsCode: null,
        },
      ],
    });
    expect(hasTsErrors).toEqual(true);
  }, 70000);
});
