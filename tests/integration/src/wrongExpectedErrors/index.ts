export type Test = {
  readonly type: string;
};

// @ts-expect-error [TSInvalidCode - 'object' is declared but its value is never read]. An invalid code, but valid message
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const object: Test = {
  // @ts-expect-error [TS123 - invalid message]. Invalid both code and message
  type: 1,
};

// @ts-expect-error [TS2322 - teere]. A valid code, but invalid message
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const array: ReadonlyArray<{ s: string }> = ['', { s: 1 }];

// @ts-expect-error. An empty error Should report two errors TS2322 and TS6133
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const myNumber2: number = 'test';

interface User {
  name: string;
  age: number;
}

interface Admin {
  name: string;
  role: string;
}

function getUserName(user: User): string {
  return user.name;
}

const admin: Admin = { name: 'John', role: 'admin' };

// @ts-expect-error [TS2345 - invalid]
getUserName(admin);
