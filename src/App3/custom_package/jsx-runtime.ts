import Logger from "./Functions/JSX_Injection_Logger";

declare global {
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, any>>;
  }
}

export type Component = (props: Record<string, any>) => any;

const STATE_VAR_PREFIX: string = "data_VAR_";
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
      let stateObj: any = {};
      if (props._state !== undefined) {
        stateObj = props._state;
      }
      // console.log("oldID: ", elID);
      if (props.id && props.id.length > 0) {
        elID = props.id;
      }
      else {
        const elResult: Element = component({
          ...props, 
          useState: (varName: string, initialVal: any) => {
            const retObj = {}; 
            (retObj as any)[varName] = () => initialVal; 
            (retObj as any)["set" + varName.substring(0, 1).toUpperCase() + varName.substring(1)] = (..._data: any) => {}; 
            return retObj;
          }, 
          log: (..._data: any) => {}, 
        });
        if (elResult && elResult.id && elResult.id.length > 0) {
          // console.log("Setting using child id ", elResult.firstElementChild);
          elID = elResult.id;
        }
        else {
          props.id = elID;
        }
        // console.log("ElResult: ", elResult, ", newID: ", elID);
      }
      // if (props.id !== undefined) {
      //   elID = props.id;
      //   const existingEl = document.getElementById(elID);
      //   if (existingEl) {
      //     for (let attr in existingEl) {
      //       if (attr.startsWith(STATE_VAR_PREFIX)) {
      //         stateObj[attr] = (existingEl as any)[attr]
      //       }
      //     }
      //   }
      // } else {
      //   currID += 1;
      // }
      // console.log("ELID: ", elID);
      // console.log("Props.id: ", props.id);
      // if (props.log !== undefined) {
      //   res = component({props});
      //   console.log("Res received: ", res)
      // } else {
        const transformLogFunction = (...data: any) => {
          try {
            throw new Error();
          } catch (e: any) {
            Logger.log((props.id && props.id.length > 0 ? props.id : elID), e.stack, data);
          }
        };

        // custom useState function
        // @param initialValue: the starting value of the data
        // @return: [a, b] where a is the variable, and b is the set function for the variable
        // const useStateFunction = (varName: string, initialVal: any): [() => any, (data: any) => void] => {
        const useStateFunction = (varName: string, initialVal: any): any => {
          if (varName.length === 0) {
            return null;
          }
          const setStateFunc = (data: any) => {
            const idUsing: string = (props.id && props.id.length > 0 ? props.id : elID)
            // console.log("IDUsing: ", idUsing)
            // console.log("Setting state: ", data, "; elID: ", elID);
            const el: Element | null = document.getElementById(idUsing);
            if (el !== null) {
              
              if (el) {
                if (el.parentNode) {
                  // console.log(el);
                  const stateObj = (el.getAttribute(STATE_VAR_PREFIX) !== null ? {...props._state, ...JSON.parse(el.getAttribute(STATE_VAR_PREFIX) as string)} : {...props._state} )
                  
                  stateObj[varName] = data
                  // console.log(stateObj)
                  // console.log("ELID: ", elID)
                  const result = jsx.component(component, {...props, id: idUsing, _state: stateObj}, children);
                  // for (let attr in stateObj) {
                  //   (result as Element).setAttribute(attr, (stateObj[attr]));
                  // }
                  (result as Element).setAttribute(STATE_VAR_PREFIX, JSON.stringify(stateObj));
                  
                  el.parentNode?.replaceChild(result, el);
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
          if (props._state !== undefined && props._state[varName] !== undefined) {
            document.getElementById((props.id && props.id.length > 0 ? props.id : elID))?.setAttribute("data_VAR_" + varName, props._state[varName]);
          }
          const returnObj = {};
          (returnObj as any)[varName] = () => (isLoadedStr === undefined || isLoadedStr.length < 1 || isLoadedStr === "NOT LOADED" ? (props._state !== undefined && props._state[varName] !== undefined ? props._state[varName] : initialVal) : (JSON.parse(document.getElementById((props.id && props.id.length > 0 ? props.id : elID))?.getAttribute(STATE_VAR_PREFIX) ?? "")[varName] ?? ""));
          const setFunctName: string = "set" + varName.substring(0, 1).toUpperCase() + varName.substring(1);
          (returnObj as any)[setFunctName] = setStateFunc;
          return returnObj;
        }

        // console.log("Calling component: ", component)
        const component_with_log: Function = (props: any) => {
          return component({ ...props, log: transformLogFunction, useState: useStateFunction, id: elID });
          // return reactjsx(component, { ...props, log: transformLogFunction })
        };
        // return component(props)
        currID += 1;
        // const res = component(props);
        res = component_with_log(props);
        // console.log("Received 2 res: ", res);
      // }
      let addingEl: Element | null = res;
      // console.log("Res: ", res);
      while (addingEl !== null && addingEl instanceof DocumentFragment) {
        addingEl = addingEl.firstElementChild;
      }
      if (addingEl !== null) {
        // console.log("Adding el before setting id: ", addingEl);
        if (addingEl.id === undefined || addingEl.id.length < 1) {
          addingEl.setAttribute("id", elID);
        }
        if (!elementTracker.has(addingEl)) {
          for (let attr in stateObj) {
            addingEl.setAttribute(attr, (stateObj[attr]))
          }
          // console.log(addingEl);
          elementTracker.add(addingEl);
          elementIDMap.set(addingEl, newID);
          // console.log(elementTracker)
          // console.log(elementIDMap)
        }
      }
      // console.log("returning res: ", res)
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
      // console.log(el)
      for (const [key, value] of Object.entries(props)) {
        if (key === "children") continue;
        else if (key === "className" && !(el instanceof DocumentFragment))
          el.setAttribute("class", value);
        else if (key.startsWith("on")) (el as any)[key.toLowerCase()] = value;
        else if (!(el instanceof DocumentFragment)) el.setAttribute(key, value);
      }
      // console.log("El after assigning props: ", el);

      el.append(...props.children);

      return el;
    }
  },
};
