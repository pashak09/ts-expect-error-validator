import { pathNormalizer } from '@app/utils/sources/pathNormalizer';

type TsExpectedErrorKeyMapGeneratorArgs = {
  readonly errorLine: number;
  readonly filePath: string;
  readonly tsCode: string | null;
};

export function tsExpectedErrorKeyMapGenerator({
  errorLine,
  filePath,
  tsCode,
}: TsExpectedErrorKeyMapGeneratorArgs): string {
  return `${pathNormalizer.toUnix(filePath)}-${errorLine}-${tsCode ?? ''}`;
}
