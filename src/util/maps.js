// @flow
// Util functions for using objects as maps and preserving type information

export const keys = <T: Object>(obj?: ?T): $Keys<T>[] => (Object.keys(obj || {}): any);

export const values = <T: Object>(obj?: ?T): $Values<T>[] => (Object.values(obj || {}): any);

export const entries = <K, V>(obj?: ?{ +[K]: V }): [K, V][] => (Object.entries(obj || {}): any);
