// utility types

/* new T() */
// https://stackoverflow.com/a/45983481
// utility type
export type Newable<T> = { new (...args: any[]): T };

// modified string type? custom type? regex type
export type ID = string;
