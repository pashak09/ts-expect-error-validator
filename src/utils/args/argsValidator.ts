import { OutputFormat } from '@app/enums/OutputFormat';
import { ArgsException } from '@app/exceptions/ArgsException';
import { Options } from '@app/main';

export type RawOptions = {
  readonly tsConfigPath: string | undefined;
  readonly restore: boolean;
  readonly quiet: boolean;
  readonly debug: boolean;
  readonly outputFormat: string;
  readonly validationMode: string;
  readonly sourcePaths: readonly string[];
};

export function argsValidator(args: RawOptions): asserts args is Options {
  const { outputFormat, tsConfigPath, validationMode, sourcePaths } = args;

  if (outputFormat !== 'json' && outputFormat !== 'human') {
    throw new ArgsException(
      `Unknown format ${outputFormat}. Available options: ${Object.values(
        OutputFormat,
      ).join(', ')}`,
    );
  }

  if (tsConfigPath === undefined) {
    throw new ArgsException(
      'tsConfigPath is required. Please specify a ts config path `tsConfigPath=<tsConfigPath>`',
    );
  }

  if (validationMode !== 'strict' && validationMode !== 'default') {
    throw new ArgsException(
      'Unknown mode ${mode}. Available options: strict or default',
    );
  }

  if (sourcePaths.length === 0) {
    throw new ArgsException(
      'sourceDir is required. Please specify a source directory `sourceDir=<sourceDir>`',
    );
  }

  const emptySourceDir = sourcePaths.some(
    (sourceDir: string): boolean => sourceDir.trim().length === 0,
  );

  if (emptySourceDir === true) {
    throw new ArgsException('One of sourceDir is empty');
  }
}
