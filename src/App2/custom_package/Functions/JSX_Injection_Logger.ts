import LogWindow, { CONTENT_BOX_CLASSNAME } from "../Components/LogWindow.ts";
import getRoot from "./GetRoot.ts";
import SVGOverlay from "./SVGOverlay.ts";

class Logger {
  static documentLoaded: boolean = false;
  static log = (elID: string, caller: string, ...data: any) => {
    if (!Logger.documentLoaded) {
      document.addEventListener("DOMContentLoaded", () => {
        Logger.documentLoaded = true;
        // console.log(document.getElementById(elID))
        // console.log(elID, ": Hello from jsx-inject-log", ...data)
        Logger.handleLogCall(elID, caller, ...data);
      });
    } else {
      // console.log(document.getElementById(elID))
      // console.log(elID, ": Hello from jsx-inject-log", ...data)
      Logger.handleLogCall(elID, caller, ...data);
    }
  };

  static readonly LOG_WINDOW_ID_SUFFIX: string = "_LOG_WINDOW";
  private static getLogWindow = (id: string): HTMLElement | null => {
    const sourceEl: HTMLElement | null = document.getElementById(id);
    if (sourceEl !== null) {
      let el: HTMLElement | null = document.getElementById(id + this.LOG_WINDOW_ID_SUFFIX);
      if (el === null) {
        el = LogWindow(id);
        getRoot().appendChild(el);
        const sourceElBox: DOMRect = sourceEl.getBoundingClientRect();
        el.style.top = sourceElBox.top + "px";
        el.style.left = sourceElBox.left + "px";
      }

      SVGOverlay.drawLine(id);

      return el;
    }
    return null;
  };
  private static handleLogCall = (id: string, caller: string, ...data: any) => {
    // console.log("Handling id: ",id)
    const window = Logger.getLogWindow(id);
    if (window !== null) {
      const contentBox: HTMLCollectionOf<Element> | null = window.getElementsByClassName(CONTENT_BOX_CLASSNAME);

      const content: HTMLElement = document.createElement("p");
      content.setAttribute("class", "LogWindow_Content_Log_Content");
      content.append(data);
      const stackTrace: HTMLElement = document.createElement("p");
      stackTrace.setAttribute("class", "LogWindow_Content_Log_StackTrace");
      stackTrace.append(caller);
      const newLog: HTMLElement = document.createElement("div");
      newLog.setAttribute("class", "LogWindow_Content_LogDiv collapsed overflowXAuto noScrollbar");
      newLog.setAttribute("data-index", (contentBox && contentBox[0] ? "" + contentBox[0].childNodes.length : "0"));
      newLog.appendChild(content);
      newLog.appendChild(stackTrace);

      const handleLogClicked = (e: MouseEvent, log: HTMLElement) => {
        let selection: Selection | null = document.getSelection();
        // console.log(selection)
        //only trigger the click action if not highlighting text
        if (selection && selection.toString().length <= 0) {
          e.preventDefault();
          e.stopPropagation();
          const indexOfErrorText: number = log.textContent.indexOf("Error");
          console.log("PARENT ID: " + log.parentElement?.parentElement?.id + ", KEY: " + log.getAttribute("data-index") + ", Content: " + log.textContent.substring(0, Math.min(125, (indexOfErrorText >= 0 ? indexOfErrorText : log.textContent.length))));
          log.classList.toggle("collapsed");
        }
      };

      newLog.addEventListener("click", (e: MouseEvent) => handleLogClicked(e, newLog));

      if (contentBox.length > 0) {
        contentBox[0].appendChild(newLog);
      } else {
        window.appendChild(newLog);
      }
    }
  };
}

export default Logger;
