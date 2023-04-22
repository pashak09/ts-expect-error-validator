#!/usr/bin/env node

import { ArgsException } from '@app/exceptions/ArgsException';
import { run } from '@app/main';
import { expectedErrorsFinder } from '@app/main/expectedErrorsFinder';
import { fileReplacer } from '@app/main/fileReplacer';
import { Logger } from '@app/main/logger/Logger';
import { LogLevel } from '@app/main/logger/LoggerInterface';
import { reportAggregator } from '@app/main/reportAggregator';
import { argsValidator } from '@app/utils/args/argsValidator';
import { argumentsParser } from '@app/utils/args/argumentsParser';

(async (): Promise<void> => {
  const args = argumentsParser();
  const logger = new Logger(
    args.debug == true
      ? LogLevel.DEBUG
      : args.quiet
      ? LogLevel.ERROR
      : LogLevel.INFO,
  );

  try {
    argsValidator(args);

    const { hasTsErrors } = await run(args, {
      logger,
      fileReplacer,
      reportAggregator,
      expectedErrorsFinder,
    });

    process.exit(hasTsErrors === true ? 1 : 0);
  } catch (err: unknown) {
    if (err instanceof ArgsException) {
      logger.error(err.message);

      process.exit(1);
    }

    throw err;
  }
})();
