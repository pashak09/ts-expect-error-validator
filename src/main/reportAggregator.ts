import { ErrorReportData, InvalidTsMessage } from '@app/main/errorsComparator';
import { SourceExpectedError } from '@app/main/expectedErrorsFinder';
import { ReporterInterface } from '@app/main/reporter/ReporterInterface';
import { TsExpectedError } from '@app/utils/ts/tsOutputParser';

export type ReportAggregator = (
  tsErrors: ErrorReportData,
  reporter: ReporterInterface,
) => void;

export function reportAggregator(
  {
    reportData: {
      invalidTsExpectedMessages,
      missingTsExpectedErrors,
      notRelevantTsExpectedErrors,
    },
  }: ErrorReportData,
  reporter: ReporterInterface,
): void {
  missingTsExpectedErrors.forEach(
    (missingExpectedError: TsExpectedError): void => {
      reporter.tackMissingExpectedError(missingExpectedError);
    },
  );

  invalidTsExpectedMessages.forEach(
    ({ expectedTsError, actualTsError }: InvalidTsMessage): void => {
      reporter.tackInvalidErrorMessage(expectedTsError, actualTsError);
    },
  );

  notRelevantTsExpectedErrors.forEach(
    (expectedTsError: SourceExpectedError): void => {
      reporter.tackIrrelevantExpectedError(expectedTsError);
    },
  );

  reporter.publish();
}
