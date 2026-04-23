import Logger from "./JSX_Injection_Logger";
import getRoot from "./GetRoot";
import getClosestCorners, { Point } from "./GetClosestElementCorners";

class SVGOverlay {
  private static overlay: SVGElement | null = null;
  static readonly LINE_ID_SUFFIX: string = "_OVERLAY_LINE";
  static readonly SVGOVERLAY_Z_INDEX: number = 2;
  static drawLine = (id: string) => {
    if (SVGOverlay.overlay === null) {
      SVGOverlay.handleCreateOverlay();
    }

    //TODO: make sure each line is labelled so we can update instead of just redraw
    const logWindow: HTMLElement | null = document.getElementById(id + Logger.LOG_WINDOW_ID_SUFFIX);
    const sourceElement: HTMLElement | null = document.getElementById(id);

    if (logWindow !== null && sourceElement !== null) {
      let line: SVGElement | null = document.getElementById(
        id + SVGOverlay.LINE_ID_SUFFIX
      ) as SVGElement | null;
      if (line === null) {
        line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("id", id + SVGOverlay.LINE_ID_SUFFIX);
        line.setAttribute("stroke", "black");
        line.setAttribute("strokeWidth", "5px");
        SVGOverlay.overlay?.appendChild(line);
      }
      //compute the endpoints of line between closest corners
      const endpoints: { 1: Point; 2: Point } = getClosestCorners(
        {
          logWindowRect: logWindow.getBoundingClientRect(),
          elementRect: sourceElement.getBoundingClientRect(),
        },
        {
          logWindowBorderRadius: Number.parseInt(
            window.getComputedStyle(logWindow).borderRadius.replace("px", "")
          ),
          elementBorderRadius: Number.parseInt(
            window.getComputedStyle(sourceElement).borderRadius.replace("px", "")
          ),
        }
      );
      //compute the endpoints of line between the element centers
      // const endpoints: {1: Point, 2: Point} = {1: getBoxCenter(logWindow.getBoundingClientRect()), 2: getBoxCenter(sourceElement.getBoundingClientRect()), }

      line.setAttribute(
        "d",
        "M " +
          endpoints[1].x +
          "," +
          endpoints[1].y +
          "  l " +
          (endpoints[2].x - endpoints[1].x) +
          "," +
          (endpoints[2].y - endpoints[1].y)
      );
    }
  };

  private static handleCreateOverlay = () => {
    SVGOverlay.overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    SVGOverlay.overlay.setAttribute(
      "viewBox",
      "0 0 " + window.innerWidth + " " + window.innerHeight
    );
    SVGOverlay.overlay.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    SVGOverlay.overlay.setAttribute(
      "class",
      "SVGOverlay positionAbsolute top fullWidth fullHeight"
    );
    // SVGOverlay.overlay.style.opacity = "0.7";//don't need this b/c we disable pointer events below
    SVGOverlay.overlay.style.zIndex = "" + SVGOverlay.SVGOVERLAY_Z_INDEX;
    SVGOverlay.overlay.style.pointerEvents = "none";
    getRoot().appendChild(SVGOverlay.overlay);
  };
}

export default SVGOverlay;
