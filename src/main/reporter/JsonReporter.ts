import { ValidationMode } from '@app/enums/ValidationMode';
import { SourceExpectedError } from '@app/main/expectedErrorsFinder';
import { ReporterInterface } from '@app/main/reporter/ReporterInterface';
import { TsExpectedError } from '@app/utils/ts/tsOutputParser';

type MissingTsExpectedRow = {
  readonly line: number;
  readonly tsCode: string | undefined;
  readonly message: string | undefined;
};

type ReportData = {
  readonly missingExpectedErrors: MissingTsExpectedRow[];
  readonly invalidErrorMessages: string[];
  readonly irrelevantExpectedErrors: MissingTsExpectedRow[];
};

type Report = Record<string, ReportData>;

export class JsonReporter implements ReporterInterface {
  private readonly report: Report;

  constructor(private readonly parseMode: ValidationMode) {
    this.report = {};
  }

  tackInvalidErrorMessage(
    expectedTsError: SourceExpectedError,
    actualTsError: TsExpectedError,
  ): void {
    if (this.parseMode !== ValidationMode.STRICT) {
      return;
    }

    const reportMessage = `Expected "${actualTsError.tsCode} - ${
      actualTsError.message
    }" given "${expectedTsError.tsCode ?? ''} - ${
      expectedTsError.message ?? ''
    }" in ${actualTsError.filePath} on ${actualTsError.errorLine} line`;
    const reportData = this.getReportDataByFilePath(actualTsError.filePath);

    reportData.invalidErrorMessages.push(reportMessage);

    this.report[actualTsError.filePath] = reportData;
  }

  tackMissingExpectedError({
    errorLine,
    tsCode,
    filePath,
    message,
  }: TsExpectedError): void {
    const reportData = this.getReportDataByFilePath(filePath);

    reportData.missingExpectedErrors.push({
      tsCode,
      line: errorLine,
      message: this.parseMode === ValidationMode.STRICT ? message : undefined,
    });

    this.report[filePath] = reportData;
  }

  tackIrrelevantExpectedError({
    errorLine,
    tsCode,
    filePath,
    message,
  }: SourceExpectedError): void {
    const reportData = this.getReportDataByFilePath(filePath);

    reportData.irrelevantExpectedErrors.push({
      tsCode: tsCode ?? undefined,
      line: errorLine,
      message:
        this.parseMode === ValidationMode.STRICT && message !== null
          ? message
          : undefined,
    });
  }

  publish(): void {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this.report));
  }

  private getReportDataByFilePath(filePath: string): ReportData {
    return (
      this.report[filePath] ?? {
        missingExpectedErrors: [],
        irrelevantExpectedErrors: [],
        invalidErrorMessages: [],
      }
    );
  }
}
