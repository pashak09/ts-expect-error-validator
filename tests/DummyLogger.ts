import { LoggerInterface } from '@app/main/logger/LoggerInterface';

export class DummyLogger implements LoggerInterface {
  debug(_message: string): void {}

  error(_message: string): void {}

  info(_message: string): void {}

  warn(_message: string): void {}
}
