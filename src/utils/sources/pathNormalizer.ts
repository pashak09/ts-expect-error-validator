import { join } from 'path';

export const pathNormalizer = {
  normalize: (sourcePath: string): string => {
    return join(...sourcePath.split('/'));
  },
  toUnix: (sourcePath: string): string => {
    return sourcePath.indexOf('\\') !== -1
      ? sourcePath.replaceAll('\\', '/')
      : sourcePath;
  },
};
