import { parseArgs } from 'node:util';

export type RawOptions = {
  readonly tsConfigPath: string | undefined;
  readonly restore: boolean;
  readonly quiet: boolean;
  readonly debug: boolean;
  readonly outputFormat: string;
  readonly validationMode: string;
  readonly sourcePaths: readonly string[];
};

export function argumentsParser(): RawOptions {
  const {
    values: {
      tsConfigPath = 'tsconfig.json',
      validationMode = 'default',
      outputFormat = 'text',
      restore = false,
      sourcePath = [],
      quiet = false,
      debug = false,
    },
  } = parseArgs({
    options: {
      sourcePath: {
        type: 'string',
        multiple: true,
      },
      tsConfigPath: {
        type: 'string',
        default: 'tsconfig.json',
      },
      restore: {
        type: 'boolean',
        default: true,
      },
      outputFormat: {
        type: 'string',
        default: 'human',
      },
      validationMode: {
        type: 'string',
        default: 'default',
      },
      quiet: {
        type: 'boolean',
        default: false,
      },
      debug: {
        type: 'boolean',
        default: false,
      },
    },
  });

  return {
    tsConfigPath,
    validationMode,
    outputFormat,
    restore,
    sourcePaths: sourcePath,
    quiet,
    debug,
  };
}
