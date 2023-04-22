import { ArgsException } from '@app/exceptions/ArgsException';
import { argsValidator, RawOptions } from '@app/utils/args/argsValidator';

type InvalidCase = {
  readonly options: RawOptions;
  readonly description: string;
};

describe('argsValidator', (): void => {
  const invalidCases: readonly InvalidCase[] = [
    {
      options: {
        tsConfigPath: undefined,
        restore: false,
        quiet: false,
        debug: false,
        outputFormat: 'human',
        validationMode: 'default',
        sourcePaths: [],
      },
      description: 'missing tsConfigPath and sourcePaths',
    },
    {
      options: {
        tsConfigPath: '/path/to/tsconfig.json',
        restore: false,
        quiet: false,
        debug: false,
        outputFormat: 'invalid-format',
        validationMode: 'default',
        sourcePaths: ['/path/to/source'],
      },
      description: 'invalid report format',
    },
    {
      options: {
        tsConfigPath: '/path/to/tsconfig.json',
        restore: false,
        quiet: false,
        debug: false,
        outputFormat: 'human',
        validationMode: 'invalid-mode',
        sourcePaths: ['/path/to/source'],
      },
      description: 'invalid validation mode',
    },
    {
      options: {
        tsConfigPath: '/path/to/tsconfig.json',
        restore: false,
        quiet: false,
        debug: false,
        outputFormat: 'human',
        validationMode: 'default',
        sourcePaths: [''],
      },
      description: 'empty source path',
    },
  ];

  it.each([...invalidCases])(
    '$description',
    ({ options }: InvalidCase): void => {
      expect((): void => argsValidator(options)).toThrow(ArgsException);
    },
  );

  it('does not throw for valid options', (): void => {
    const options: RawOptions = {
      tsConfigPath: '/path/to/tsconfig.json',
      restore: false,
      quiet: false,
      debug: false,
      outputFormat: 'human',
      validationMode: 'default',
      sourcePaths: ['/path/to/source'],
    };

    expect((): void => argsValidator(options)).not.toThrow();
  });
});
