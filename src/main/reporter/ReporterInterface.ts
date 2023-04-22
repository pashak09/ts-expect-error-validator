import { SourceExpectedError } from '@app/main/expectedErrorsFinder';
import { TsExpectedError } from '@app/utils/ts/tsOutputParser';

export interface ReporterInterface {
  tackInvalidErrorMessage(
    expectedError: SourceExpectedError,
    actualError: TsExpectedError,
  ): void;

  tackMissingExpectedError(missingExpectedError: TsExpectedError): void;

  tackIrrelevantExpectedError(
    irrelevantExpectedError: SourceExpectedError,
  ): void;

  publish(): void;
}
