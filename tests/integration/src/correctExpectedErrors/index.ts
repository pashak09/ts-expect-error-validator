export type Test = {
  readonly type: string;
};

// @ts-expect-error [TS6133 - 'object' is declared but its value is never read]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const object: Test = {
  // @ts-expect-error [TS2322 - Type 'number' is not assignable to type 'string']
  type: 1,
};

// @ts-expect-error [TS6133 - 'array' is declared but its value is never read, TS2322 - Type 'string' is not assignable to type '{ s: string; }', TS2322 - Type 'number' is not assignable to type 'string']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const array: ReadonlyArray<{ s: string }> = ['', { s: 1 }];

// @ts-expect-error [TS2322 - Type 'string' is not assignable to type 'number', TS6133 - 'myNumber2' is declared but its value is never read]
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

// @ts-expect-error [TS2345 - Argument of type 'Admin' is not assignable to parameter of type 'User']
getUserName(admin);
