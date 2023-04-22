import { spawn } from 'child_process';

export async function runCommandAsync(
  cmd: string,
  args: readonly string[],
): Promise<string> {
  return new Promise<string>(
    (resolve: (_: string) => void, reject: (_: Error) => void): void => {
      const spawnProcess = spawn(cmd, args, {
        shell: process.platform == 'win32',
      });
      const outputBuffers: Buffer[] = [];

      spawnProcess.stdout.on('data', (data: Buffer): void => {
        outputBuffers.push(data);
      });

      spawnProcess.stderr.on('data', (data: Buffer): void => {
        outputBuffers.push(data);
      });

      spawnProcess.on('close', (): void => {
        resolve(Buffer.concat(outputBuffers).toString());
      });

      spawnProcess.on('error', (error: Error): void => {
        reject(error);
      });
    },
  );
}
