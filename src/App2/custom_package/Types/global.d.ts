export {}; // keep this file a module so `declare global` merges correctly

declare global {
  function log(...data: any): void;
}
