export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LoggerInterface {
  error(message: string): void;

  warn(message: string): void;

  info(message: string): void;

  debug(message: string): void;
}
