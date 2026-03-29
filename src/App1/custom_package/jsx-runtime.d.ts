// custom_package/jsx-runtime.d.ts
export function jsx(type: any, props: any, ...children: any[]): any;
export function jsxs(type: any, props: any, ...children: any[]): any;
export function jsxDEV(type: any, props: any, ...children: any[]): any;

export namespace JSX {
  type Element = any;
  interface IntrinsicElements { [elemName: string]: any; }
}