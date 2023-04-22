import { ValidationMode } from '@app/enums/ValidationMode';
import { SourceExpectedError } from '@app/main/expectedErrorsFinder';
import { LoggerInterface } from '@app/main/logger/LoggerInterface';
import { ReporterInterface } from '@app/main/reporter/ReporterInterface';
import { TsExpectedError } from '@app/utils/ts/tsOutputParser';

export class StdOutReporter implements ReporterInterface {
  private report: string;

  private issuesCount: number;

  private tsInvalidErrorMessagesCount: number;

  private tsExpectedMissingErrorsCount: number;

  private tsIrrelevantExpectedErrorsCount: number;

  constructor(
    private readonly logger: LoggerInterface,
    private readonly validationMode: ValidationMode,
  ) {
    this.report = '';
    this.issuesCount = 0;
    this.tsInvalidErrorMessagesCount = 0;
    this.tsExpectedMissingErrorsCount = 0;
    this.tsIrrelevantExpectedErrorsCount = 0;
  }

  tackInvalidErrorMessage(
    expectedTsError: SourceExpectedError,
    actualTsError: TsExpectedError,
  ): void {
    if (this.validationMode !== ValidationMode.STRICT) {
      return;
    }

    const reportMessage = `Expected "${actualTsError.tsCode} - ${
      actualTsError.message
    }" given "${expectedTsError.tsCode ?? ''} - ${
      expectedTsError.message ?? ''
    }" in ${actualTsError.filePath} on ${actualTsError.errorLine} line`;

    this.tsInvalidErrorMessagesCount++;
    this.addReportMessage(reportMessage);
  }

  tackMissingExpectedError({
    errorLine,
    message,
    tsCode,
    filePath,
  }: TsExpectedError): void {
    this.addReportMessage(
      `Expected "${tsCode}${
        this.validationMode === ValidationMode.STRICT ? `- ${message}` : ''
      }" in ${filePath} on ${errorLine} line`,
    );

    this.tsExpectedMissingErrorsCount++;
  }

  tackIrrelevantExpectedError({
    errorLine,
    message,
    tsCode,
    filePath,
  }: TsExpectedError): void {
    this.addReportMessage(
      `Irrelevant ts expected ts code "${tsCode}${
        this.validationMode === ValidationMode.STRICT ? `- ${message}` : ''
      }" in ${filePath} on ${errorLine} line`,
    );

    this.tsIrrelevantExpectedErrorsCount++;
  }

  publish(): void {
    if (this.report.length === 0) {
      this.logger.info('All expectations have been satisfied');

      return;
    }

    this.logger.info(
      `Report:\nIssues Count: ${
        this.issuesCount
      } | Expected Missing Errors Count: ${
        this.tsExpectedMissingErrorsCount
      } | Irrelevant Expected Errors Count: ${
        this.tsIrrelevantExpectedErrorsCount
      } ${
        this.validationMode === ValidationMode.STRICT
          ? `| Invalid Error Messages Count: ${this.tsInvalidErrorMessagesCount}`
          : ''
      }\n${this.report.trim()}`,
    );
  }

  private addReportMessage(message: string): void {
    this.issuesCount++;
    this.report += `${message}\n`;
  }
}
