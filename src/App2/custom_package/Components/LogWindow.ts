import Logger from "../Functions/JSX_Injection_Logger";
import SVGOverlay from "../Functions/SVGOverlay";
import "./LogWindow.css";

export const CONTENT_BOX_CLASSNAME: string = "LogWindow_ContentBox";

let prevMousePos: { x: number; y: number } = { x: 0, y: 0 };

const LogWindow = (id: string): HTMLElement => {
  const box: HTMLElement = document.createElement("div");
  box.setAttribute(
    "class",
    "LogWindow positionAbsolute flexColumn noSelect cursorMove overflowHidden"
  );
  box.setAttribute("id", id + Logger.LOG_WINDOW_ID_SUFFIX);
  box.style.zIndex = "" + (SVGOverlay.SVGOVERLAY_Z_INDEX + 1);
  const headerBar: HTMLElement = document.createElement("div");
  headerBar.setAttribute(
    "class",
    "LogWindow_HeaderDiv flexRow centerJustify centerAlign borderBox fullWidth"
  );
  const headerText: HTMLElement = document.createElement("p");
  headerText.setAttribute("class", "LogWindow_Header_Text headerText");
  headerText.append(id);
  headerBar.appendChild(headerText);
  box.appendChild(headerBar);

  const contentBox: HTMLElement = document.createElement("div");
  contentBox.setAttribute(
    "class",
    CONTENT_BOX_CLASSNAME + " flexColumn select cursorAuto overflowYAuto"
  );
  box.appendChild(contentBox);

  //attach listener to contentBox to prevent draggable behavior there, allow selecting log text
  contentBox.addEventListener("mousedown", (e: MouseEvent) => {
    e.stopPropagation();
  });

  //attach listeners to add draggable behavior
  const handleMouseExit = (_: any) => {
    // console.log("mouseexit")
    document.removeEventListener("mousedown", handleMouseDown);
    // box.removeEventListener("mousemove", handleMouseMove)
  };

  box.addEventListener("mouseenter", (_: any) => {
    // console.log("Mouse entered")
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
  });

  box.addEventListener("mouseleave", handleMouseExit);

  const handleMouseUp = (_: any) => {
    // box.setAttribute("data-dragging", "false")
    // console.log("mouseup")
    // document.removeEventListener("mousedown", handleMouseDown)
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseDown = (e: MouseEvent) => {
    // box.setAttribute("data-dragging", "true")
    prevMousePos.x = e.clientX;
    prevMousePos.y = e.clientY;
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (e: MouseEvent) => {
    let selection: Selection | null = document.getSelection();
    //only trigger the action if no highlighted text
    if (selection && selection.toString().length <= 0) {
      if (
        e.clientX >= -1 &&
        e.clientX < window.innerWidth &&
        e.clientY >= 0 &&
        e.clientY < window.innerHeight
      ) {
        const mouseOffset: { x: number; y: number } = {
          x: e.clientX - prevMousePos.x,
          y: e.clientY - prevMousePos.y,
        };
        const boundingBox: DOMRect = box.getBoundingClientRect();
        box.style.left =
          Math.max(
            Math.min(
              Number.parseInt(box.style.left.replace("px", "")) + mouseOffset.x,
              window.innerWidth - boundingBox.width
            ),
            0
          ) + "px";
        box.style.top =
          Math.max(
            Math.min(
              Number.parseInt(box.style.top.replace("px", "")) + mouseOffset.y,
              window.innerHeight - boundingBox.height
            ),
            0
          ) + "px";
        SVGOverlay.drawLine(id);
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;
      }
    }

    // prevMousePos.x = e.clientX;
    // prevMousePos.y = e.clientY;
  };

  return box;
};

export default LogWindow;
