import { TS_EXPECT_ERROR, TS_REPLACED_EXPECT_ERROR } from '@app/main/constants';
import { fileEditor } from '@app/utils/sources/fileEditor';

export type FileReplacer = {
  readonly replaceTsExpectedErrors: (
    filePathsToChange: readonly string[],
  ) => Promise<void>;
  readonly restoreTsExpectedErrors: (
    filePathsToChange: readonly string[],
  ) => Promise<void>;
};

export const fileReplacer = {
  replaceTsExpectedErrors: async (
    filePathsToChange: readonly string[],
  ): Promise<void> =>
    fileEditor(filePathsToChange, TS_EXPECT_ERROR, TS_REPLACED_EXPECT_ERROR),
  restoreTsExpectedErrors: async (
    filePathsToChange: readonly string[],
  ): Promise<void> =>
    fileEditor(filePathsToChange, TS_REPLACED_EXPECT_ERROR, TS_EXPECT_ERROR),
};
