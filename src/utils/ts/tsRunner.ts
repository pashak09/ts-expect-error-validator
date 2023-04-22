import { runCommandAsync } from '@app/utils/runCommandAsync';

export function tsRunner(tsconfigPath: string): Promise<string> {
  return runCommandAsync('tsc', [
    '--pretty',
    'false',
    '--noEmit',
    '-p',
    tsconfigPath,
  ]);
}
