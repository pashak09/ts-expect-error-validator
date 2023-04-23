import { createReadStream } from 'fs';

export async function* fileReader(filePath: string): AsyncGenerator<string> {
  const fileStream = createReadStream(filePath, { encoding: 'utf8' });
  let remaining = '';

  for await (const chunk of fileStream) {
    remaining += chunk;
    let index = remaining.indexOf('\n');

    while (index > -1) {
      yield remaining.substring(0, index);

      remaining = remaining.substring(index + 1);
      index = remaining.indexOf('\n');
    }
  }

  if (remaining.length > 0) {
    yield remaining;
  }
}
