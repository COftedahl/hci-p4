// import Logger from "./Functions/JSX_Injection_Logger";

// declare global {
//   module JSX {
//     type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, any>>;
//   }
// }

// export type Component = (props: Record<string, any>) => any;

// const elementTracker: Set<Element> = new Set();
// const elementIDMap: Map<Element, string> = new Map();
// let currID: number = 0;

// export const jsx = {
//   component(component: string | Component, props: Record<string, any> | null, ...children: any[]) {
//     // console.log("Called component with args: ", {component, props, children})
//     if (!props) props = {};
//     props.children = children.flat(Infinity);
//     let el: null | DocumentFragment | HTMLElement = null;

//     if (typeof component === "function") {
//       let res: any = null;
//       let newID: string = "id_" + currID;
//       let elID: string = newID;
//       if (props.id !== undefined) {
//         elID = props.id;
//       } else {
//         currID += 1;
//       }
//       if (props.log !== undefined) {
//         res = component(props);
//       } else {
//         const transformLogFunction = (data: any) => {
//           try {
//             throw new Error();
//           } catch (e: any) {
//             Logger.log(elID, e.stack, data);
//           }
//         };

//         // console.log("Calling component: ", component)
//         const component_with_log: Function = (props: any) => {
//           return component({ ...props, log: transformLogFunction });
//           // return reactjsx(component, { ...props, log: transformLogFunction })
//         };
//         // return component(props)
//         currID += 1;
//         // const res = component(props);
//         res = component_with_log(props);
//       }
//       let addingEl: Element | null = res;
//       // console.log("Res: ", res);
//       while (addingEl !== null && addingEl instanceof DocumentFragment) {
//         addingEl = addingEl.firstElementChild;
//       }
//       if (addingEl !== null) {
//         if (!elementTracker.has(addingEl)) {
//           addingEl.setAttribute("id", elID);
//           elementTracker.add(addingEl);
//           elementIDMap.set(addingEl, newID);
//           // console.log(elementTracker)
//           // console.log(elementIDMap)
//         }
//       }
//       return res;
//     } else if (typeof component === "symbol") {
//       el = new DocumentFragment();
//       // props.children.map((child: any) => {
//       //   console.log("Child of symbol: ", child, ", type: ", typeof child, "Props: ", Object.entries(props))
//       //   if (typeof child === 'object') {
//       //     el.appendChild(jsx.component(child.tagName.toLowerCase(), {...child.props, children: []}, child.children))
//       //   }
//       // })
//       // return el;
//     } else {
//       el = document.createElement(component);
//     }
//     // const element = document.createElement(component);
//     if (el !== null) {
//       for (const [key, value] of Object.entries(props)) {
//         if (key === "children") continue;
//         else if (key === "className" && !(el instanceof DocumentFragment))
//           el.setAttribute("class", value);
//         else if (key.startsWith("on")) (el as any)[key.toLowerCase()] = value;
//         else if (!(el instanceof DocumentFragment)) el.setAttribute(key, value);
//       }

//       el.append(...props.children);

//       return el;
//     }
//   },
// };
