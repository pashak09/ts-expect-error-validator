import { OutputFormat } from '@app/enums/OutputFormat';
import { ValidationMode } from '@app/enums/ValidationMode';
import { errorsComparator, ErrorReportData } from '@app/main/errorsComparator';
import { ExpectedErrorsFinder } from '@app/main/expectedErrorsFinder';
import { FileReplacer } from '@app/main/fileReplacer';
import { LoggerInterface } from '@app/main/logger/LoggerInterface';
import { ReportAggregator } from '@app/main/reportAggregator';
import { JsonReporter } from '@app/main/reporter/JsonReporter';
import { ReporterInterface } from '@app/main/reporter/ReporterInterface';
import { StdOutReporter } from '@app/main/reporter/StdOutReporter';
import { tsOutputParser } from '@app/utils/ts/tsOutputParser';
import { tsRunner } from '@app/utils/ts/tsRunner';

export type BaseTsExpectedError = {
  readonly errorLine: number;
  readonly filePath: string;
};

export type TsFilePathLineCodeErrorKey = string;

export type Options = {
  readonly tsConfigPath: string;
  readonly restore: boolean;
  readonly quiet: boolean;
  readonly debug: boolean;
  readonly outputFormat: OutputFormat;
  readonly validationMode: ValidationMode;
  readonly sourcePaths: readonly string[];
};

type RunArgs = {
  readonly expectedErrorsFinder: ExpectedErrorsFinder;
  readonly logger: LoggerInterface;
  readonly fileReplacer: FileReplacer;
  readonly reportAggregator: ReportAggregator;
};

const reporters: Record<
  OutputFormat,
  (
    LoggerInterface: LoggerInterface,
    parseMode: ValidationMode,
  ) => ReporterInterface
> = {
  [OutputFormat.JSON]: (
    _: LoggerInterface,
    parseMode: ValidationMode,
  ): ReporterInterface => new JsonReporter(parseMode),
  [OutputFormat.HUMAN]: (
    loggerInterface: LoggerInterface,
    parseMode: ValidationMode,
  ): ReporterInterface => new StdOutReporter(loggerInterface, parseMode),
};

/**
 * @throws TsParserException
 */
export async function run(
  options: Options,
  { reportAggregator, logger, fileReplacer, expectedErrorsFinder }: RunArgs,
): Promise<ErrorReportData> {
  const expectedErrorsMap = await expectedErrorsFinder(
    options.sourcePaths,
    logger,
  );

  if (expectedErrorsMap.size === 0) {
    logger.info('No ts expected errors found');

    return {
      hasTsErrors: false,
      reportData: {
        missingTsExpectedErrors: [],
        notRelevantTsExpectedErrors: [],
        invalidTsExpectedMessages: [],
      },
    };
  }

  const filePathsToChange: readonly string[] = Array.from(
    expectedErrorsMap.values(),
  ).map((expectedError: BaseTsExpectedError): string => expectedError.filePath);

  await fileReplacer.replaceTsExpectedErrors(filePathsToChange);

  let tsRunnerOutput = '';

  try {
    logger.debug('Running a build');
    tsRunnerOutput = await tsRunner(options.tsConfigPath);
  } catch (err: unknown) {
    logger.error('Cannot run build error for an analysis');
    await fileReplacer.restoreTsExpectedErrors(filePathsToChange);

    throw err;
  }

  if (options.restore === true) {
    logger.debug('Starting restore changed files');
    await fileReplacer.restoreTsExpectedErrors(filePathsToChange);
  }

  const reportData = errorsComparator(
    tsOutputParser(tsRunnerOutput),
    expectedErrorsMap,
    options.validationMode,
  );

  reportAggregator(
    reportData,
    reporters[options.outputFormat](logger, options.validationMode),
  );

  return reportData;
}
