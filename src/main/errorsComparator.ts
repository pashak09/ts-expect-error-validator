import { ValidationMode } from '@app/enums/ValidationMode';
import {
  SourceExpectedError,
  SourceExpectedErrorsMap,
} from '@app/main/expectedErrorsFinder';
import {
  TsExpectedError,
  TsOutputErrorsMap,
} from '@app/utils/ts/tsOutputParser';

type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type EdibleTsErrorsComparatorData = {
  readonly missingTsExpectedErrors: TsExpectedError[];
  readonly invalidTsExpectedMessages: InvalidTsMessage[];
  readonly notRelevantTsExpectedErrors: SourceExpectedError[];
};

export type InvalidTsMessage = {
  readonly expectedTsError: SourceExpectedError;
  readonly actualTsError: TsExpectedError;
};

export type ErrorReportData = {
  readonly reportData: DeepReadonly<EdibleTsErrorsComparatorData>;
  readonly hasTsErrors: boolean;
};

export function errorsComparator(
  tsOutputErrorsMap: TsOutputErrorsMap,
  expectedErrorsMapOrigin: SourceExpectedErrorsMap,
  validationMode: ValidationMode,
): ErrorReportData {
  const reportData: EdibleTsErrorsComparatorData = {
    missingTsExpectedErrors: [],
    invalidTsExpectedMessages: [],
    notRelevantTsExpectedErrors: [],
  };
  const expectedErrorsMap = new Map(expectedErrorsMapOrigin);

  for (const filePath of tsOutputErrorsMap.keys()) {
    const expectedTsError = expectedErrorsMap.get(filePath);
    const actualTsError = tsOutputErrorsMap.get(filePath);

    if (actualTsError === undefined) {
      continue;
    }

    if (expectedTsError === undefined) {
      reportData.missingTsExpectedErrors.push(actualTsError);

      continue;
    }

    expectedErrorsMap.delete(filePath);

    if (expectedTsError.message !== actualTsError.message) {
      reportData.invalidTsExpectedMessages.push({
        expectedTsError,
        actualTsError,
      });
    }
  }

  if (expectedErrorsMap.size > 0) {
    reportData.notRelevantTsExpectedErrors.push(...expectedErrorsMap.values());
  }

  return {
    reportData,
    hasTsErrors:
      reportData.missingTsExpectedErrors.length > 0 ||
      reportData.notRelevantTsExpectedErrors.length > 0 ||
      (validationMode === ValidationMode.STRICT &&
        reportData.invalidTsExpectedMessages.length > 0),
  };
}
