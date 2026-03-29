import Logger from "./Functions/JSX_Injection_Logger";

declare global {
  module JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, any>>;
  }
}

export type Component = (props: Record<string, any>) => any;

const elementTracker: Set<Element> = new Set();
const elementIDMap: Map<Element, string> = new Map();
let currID: number = 0;

export const jsx = {
  component(component: string | Component, props: Record<string, any> | null, ...children: any[]) {
    // console.log("Called component with args: ", {component, props, children})
    if (!props) props = {};
    props.children = children.flat(Infinity);
    let el: null | DocumentFragment | HTMLElement = null;

    if (typeof component === "function") {
      let res: any = null;
      let newID: string = "id_" + currID;
      let elID: string = newID;
      if (props.id !== undefined) {
        elID = props.id;
      } else {
        currID += 1;
      }
      if (props.log !== undefined) {
        res = component(props);
      } else {
        const transformLogFunction = (data: any) => {
          try {
            throw new Error();
          } catch (e: any) {
            Logger.log(elID, e.stack, data);
          }
        };

        // custom useState function
        // @param initialValue: the starting value of the data
        // @return: [a, b] where a is the variable, and b is the set function for the variable
        // const useStateFunction = (varName: string, initialVal: any): [() => any, (data: any) => void] => {
        const useStateFunction = (varName: string, initialVal: any): any => {
          const STATE_VAR_PREFIX: string = "data_VAR_";
          if (varName.length === 0) {
            return null;
          }
          const setStateFunc = (data: any) => {
            const el: Element | null = document.getElementById(elID);
            if (el !== null) {
              
              // console.log("Setting State ", elID)
              // if (el) {
              //   el.parentNode?.replaceChild(jsx.component(component, props, children), el)
              //   console.log("Replaced");
              // }

              // const CURRENT_INDEX_ATTRIBUTE: string = 'data_attrName';
              // let currVarStr: string | null = (el.getAttribute(CURRENT_INDEX_ATTRIBUTE));
              // if (currVarStr === null) {
              //   el.setAttribute(CURRENT_INDEX_ATTRIBUTE, '1');
              //   currVarStr = '1';
              // }
              // const currVarIndex: number = Number.parseInt(currVarStr);
              el.setAttribute(STATE_VAR_PREFIX + varName, data);
              // const children = el.childNodes;
              // for (let i = 0; i < children.length; i += 1) {
              //   el.replaceChild(jsx.component(children[i] as any, (children[i] as any).props), children[i])
              // }
              // console.log(el)
              if (el) {
                if (el.parentNode) {
                  const stateObj = {...props._state};
                  stateObj[STATE_VAR_PREFIX + varName] = data
                  // console.log(stateObj)
                  const result = jsx.component(component, {...props, id: elID, _state: stateObj}, children)
                  // console.log(result);
                  el.parentNode?.replaceChild(result, el)
                  // console.log("Replaced");
                }
                // el.parentNode?.replaceChild(jsx.component(component, props, children), el)
              }

            }
          }

          const isLoadedStr: string = document.documentElement.style.getPropertyValue("--isDocLoaded");
          if (isLoadedStr === undefined || isLoadedStr.length < 1 || isLoadedStr === "NOT LOADED") {
            document.addEventListener('DOMContentLoaded', () => {
              document.documentElement.setAttribute('--isDocLoaded', "LOADED");
              setStateFunc(initialVal);
            })
          }
          else {
            setStateFunc(initialVal);
          }

          // return [() => document.getElementById(elID)?.getAttribute("--" + currVarStr), setStateFunc];
          if (props._state !== undefined && props._state[STATE_VAR_PREFIX + varName] !== undefined) {
            document.getElementById(elID)?.setAttribute("data_VAR_" + varName, props._state[STATE_VAR_PREFIX + varName]);
          }
          const returnObj = {};
          (returnObj as any)[varName] = () => (isLoadedStr === undefined || isLoadedStr.length < 1 || isLoadedStr === "NOT LOADED" ? (props._state !== undefined && props._state[STATE_VAR_PREFIX + varName] !== undefined ? props._state[STATE_VAR_PREFIX + varName] : initialVal) : document.getElementById(elID)?.getAttribute("data_VAR_" + varName));
          const setFunctName: string = "set" + varName.substring(0, 1).toUpperCase() + varName.substring(1);
          (returnObj as any)[setFunctName] = setStateFunc;
          return returnObj;
        }

        // console.log("Calling component: ", component)
        const component_with_log: Function = (props: any) => {
          return component({ ...props, log: transformLogFunction, useState: useStateFunction });
          // return reactjsx(component, { ...props, log: transformLogFunction })
        };
        // return component(props)
        currID += 1;
        // const res = component(props);
        res = component_with_log(props);
      }
      let addingEl: Element | null = res;
      // console.log("Res: ", res);
      while (addingEl !== null && addingEl instanceof DocumentFragment) {
        addingEl = addingEl.firstElementChild;
      }
      if (addingEl !== null) {
        if (!elementTracker.has(addingEl)) {
          addingEl.setAttribute("id", elID);
          elementTracker.add(addingEl);
          elementIDMap.set(addingEl, newID);
          // console.log(elementTracker)
          // console.log(elementIDMap)
        }
      }
      return res;
    } else if (typeof component === "symbol") {
      el = new DocumentFragment();
      // props.children.map((child: any) => {
      //   console.log("Child of symbol: ", child, ", type: ", typeof child, "Props: ", Object.entries(props))
      //   if (typeof child === 'object') {
      //     el.appendChild(jsx.component(child.tagName.toLowerCase(), {...child.props, children: []}, child.children))
      //   }
      // })
      // return el;
    } else {
      el = document.createElement(component);
    }
    // const element = document.createElement(component);
    if (el !== null) {
      for (const [key, value] of Object.entries(props)) {
        if (key === "children") continue;
        else if (key === "className" && !(el instanceof DocumentFragment))
          el.setAttribute("class", value);
        else if (key.startsWith("on")) (el as any)[key.toLowerCase()] = value;
        else if (!(el instanceof DocumentFragment)) el.setAttribute(key, value);
      }

      el.append(...props.children);

      return el;
    }
  },
};
