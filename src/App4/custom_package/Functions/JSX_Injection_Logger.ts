import LogWindow, { CONTENT_BOX_CLASSNAME } from "../Components/LogWindow.ts";
import getRoot from "./GetRoot.ts";
// import SVGOverlay from "./SVGOverlay.ts";

class Logger {
  static documentLoaded: boolean = false;

  /*
   * NEW: global aggregated log store
   */
  static aggregatedLogs: {
    id: string;
    caller: string;
    data: any[];
    timestamp: number;
  }[] = [];

  static log = (elID: string, caller: string, ...data: any) => {
    if (!Logger.documentLoaded) {
      document.addEventListener("DOMContentLoaded", () => {
        Logger.documentLoaded = true;
        Logger.handleLogCall(elID, caller, ...data);
      });
    } else {
      Logger.handleLogCall(elID, caller, ...data);
    }
  };

  static readonly LOG_WINDOW_ID_SUFFIX: string = "_LOG_WINDOW";
  static readonly UNIFIED_LOG_WINDOW_ID: string = "UNIFIED_LOG_WINDOW";

  /*
   * EXISTING: get element-specific log window
   */
  // private static getLogWindow = (id: string): HTMLElement | null => {
  //   const sourceEl: HTMLElement | null = document.getElementById(id);

  //   if (sourceEl !== null) {
  //     let el: HTMLElement | null = document.getElementById(
  //       id + this.LOG_WINDOW_ID_SUFFIX
  //     );

  //     if (el === null) {
  //       el = LogWindow(id);
  //       getRoot().appendChild(el);

  //       const sourceElBox: DOMRect = sourceEl.getBoundingClientRect();
  //       el.style.top = sourceElBox.top + "px";
  //       el.style.left = sourceElBox.left + "px";
  //     }

  //     SVGOverlay.drawLine(id);
  //     return el;
  //   }

  //   return null;
  // };

  /*
   * NEW: unified aggregated log window
   */
  private static getUnifiedLogWindow = (): HTMLElement => {
    let el: HTMLElement | null = document.getElementById(
      Logger.UNIFIED_LOG_WINDOW_ID
    );

    if (el === null) {
      el = LogWindow("UnifiedLogs");
      el.setAttribute("id", Logger.UNIFIED_LOG_WINDOW_ID);

      getRoot().appendChild(el);

      el.style.top = "20px";
      el.style.left = "20px";
    }

    return el;
  };

  private static createLogElement = (
  data: any[],
  caller: string,
  includeTimestamp: boolean = false
): HTMLElement => {

  const content: HTMLElement = document.createElement("p");
  content.setAttribute("class", "LogWindow_Content_Log_Content");

  // Only add timestamp when requested
  if (includeTimestamp) {
    const timestamp: string = new Date()
      .toISOString()
      .split("T")[1]
      .split(".")[0];

    const timestampEl: HTMLElement = document.createElement("span");
    timestampEl.setAttribute("class", "LogWindow_Timestamp");
    timestampEl.textContent = `[${timestamp}] `;

    content.appendChild(timestampEl);
  }

  content.append(
    ...data.map((d) =>
      typeof d === "object" ? JSON.stringify(d) : String(d)
    )
  );

  const stackTrace: HTMLElement = document.createElement("p");
  stackTrace.setAttribute("class", "LogWindow_Content_Log_StackTrace");
  stackTrace.append(caller);

  const newLog: HTMLElement = document.createElement("div");
  newLog.setAttribute(
    "class",
    "LogWindow_Content_LogDiv collapsed overflowXAuto noScrollbar"
  );

  newLog.appendChild(content);
  newLog.appendChild(stackTrace);

  const handleLogClicked = (e: MouseEvent, log: HTMLElement) => {
    let selection: Selection | null = document.getSelection();

    if (selection && selection.toString().length <= 0) {
      e.preventDefault();
      e.stopPropagation();
      log.classList.toggle("collapsed");
    }
  };

  newLog.addEventListener("click", (e: MouseEvent) =>
    handleLogClicked(e, newLog)
  );

  return newLog;
};

  private static handleLogCall = (id: string, caller: string, ...data: any) => {
    /*
     * STORE LOG FOR AGGREGATION
     */
    Logger.aggregatedLogs.push({
      id,
      caller,
      data,
      timestamp: Date.now(),
    });

    /*
     * EXISTING BEHAVIOR
     * element-specific log window
     */
    // const window = Logger.getLogWindow(id);

    // if (window !== null) {
    //   const newLog = Logger.createLogElement(data, caller);

    //   const contentBox: HTMLCollectionOf<Element> =
    //     window.getElementsByClassName(CONTENT_BOX_CLASSNAME);

    //   if (contentBox.length > 0) {
    //     contentBox[0].appendChild(newLog);
    //   } else {
    //     window.appendChild(newLog);
    //   }
    // }

    /*
     * NEW FEATURE 3B
     * aggregated multi-source log window
     */
    const unifiedWindow = Logger.getUnifiedLogWindow();

    const aggregatedData = [`[${id}]`, ...data];

    const unifiedLog = Logger.createLogElement(aggregatedData, caller, true);

    
    const handleLogClicked = (e: MouseEvent, log: HTMLElement) => {
      let selection: Selection | null = document.getSelection();
      // console.log(selection)
      //only trigger the click action if not highlighting text
      if (selection && selection.toString().length <= 0) {
        e.preventDefault();
        e.stopPropagation();
        const indexOfErrorText: number = log.textContent.indexOf("Error");
        console.log("PARENT ID: " + log.parentElement?.parentElement?.id + ", KEY: " + log.getAttribute("data-index") + ", Content: " + log.textContent.substring(0, Math.min(125, (indexOfErrorText >= 0 ? indexOfErrorText : log.textContent.length))));
        // log.classList.toggle("collapsed");
      }
    };

    unifiedLog.addEventListener("click", (e: MouseEvent) => handleLogClicked(e, unifiedLog));

    const unifiedContentBox: HTMLCollectionOf<Element> =
      unifiedWindow.getElementsByClassName(CONTENT_BOX_CLASSNAME);

    if (unifiedContentBox.length > 0) {
      unifiedContentBox[0].appendChild(unifiedLog);
      unifiedLog.setAttribute("data-index", "" + (unifiedContentBox[0].childNodes.length));
    } else {
      unifiedWindow.appendChild(unifiedLog);
      unifiedLog.setAttribute("data-index", "" + 0);
    }
  };
}

export default Logger;