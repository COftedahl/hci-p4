export interface Point {
  x: number;
  y: number;
}

export const getBoxCenter = (r1: DOMRect): Point => {
  return {
    x: r1.x + r1.width / 2,
    y: r1.y + r1.height / 2,
  };
};

/*
 * returns c2 - c1
 */
const getCenterOffsetDirection = (c1: Point, c2: Point): Point => {
  return {
    x: c2.x - c1.x,
    y: c2.y - c1.y,
  };
};

const areBoxesOverlapping = (r1: DOMRect, r2: DOMRect): boolean => {
  // let overlapping: boolean = false;

  // const center1: Point = getBoxCenter(r1);
  // const center2: Point = getBoxCenter(r2);

  //vector from c1 -> c2
  // const centerOffsetVector: Point = getCenterOffsetDirection(center1, center2);

  // if (centerOffsetVector.x > 0) {
  //   if (centerOffsetVector.y > 0) {
  //     //r1 to top-left of r2
  //     overlapping = overlapping || (((r1.bottom >= r2.top) || (r1.bottom <= r2.bottom && r1.top)) && r1.right >= r2.left);
  //   }
  //   else {
  //     //r1 to bottom-left of r2
  //     overlapping = overlapping || (r1.top >= r2.bottom && r1.right >= r2.left);
  //   }
  // }
  // else {
  //   if (centerOffsetVector.y > 0) {
  //     //r1 to top-right of r2
  //     overlapping = overlapping || (r1.bottom >= r2.top && r1.left >= r2.right);
  //   }
  //   else {
  //     //r1 to bottom-right of r2
  //     overlapping = overlapping || (r1.top >= r2.bottom && r1.left >= r2.right);
  //   }
  // }

  const yIntersects: boolean =
    (r2.top <= r1.bottom && r1.bottom <= r2.bottom) || //r1 top in r2 y area
    (r2.top <= r1.top && r1.top <= r2.bottom) || //r1 bottom in r2 y area
    (r1.bottom >= r2.bottom && r1.top <= r2.top); //r1 completely intersects r2 y area
  const xIntersects: boolean =
    (r2.left <= r1.right && r1.right <= r2.right) || //r1 left in r2 x area
    (r2.left <= r1.left && r1.left <= r2.right) || //r1 right in r2 x area
    (r1.right >= r2.right && r1.left <= r2.left); //r1 completely intersects r2 x area
  const overlapping: boolean = yIntersects && xIntersects;
  return overlapping;
};

const isBoxOverlappingAPoint = (rect: DOMRect, p: Point): boolean => {
  return rect.left <= p.x && p.x <= rect.right && rect.top <= p.x && p.x <= rect.bottom;
};

const getXRectFieldNameFromOffset = (offset: number): string => {
  if (offset <= 0) {
    return "left";
  } else {
    return "right";
  }
};

const getYRectFieldNameFromOffset = (offset: number): string => {
  if (offset <= 0) {
    return "top";
  } else {
    return "bottom";
  }
};

const RADICAL_TWO_OVER_TWO: number = Math.sqrt(2) / 2;
const ONE_MINUS_RADICAL_TWO_OVER_TWO: number = 1 - RADICAL_TWO_OVER_TWO;

const getUnitVectorInDirection = (xDir: string, yDir: string): Point => {
  if (xDir === "left") {
    if (yDir === "top") {
      return {
        x: -RADICAL_TWO_OVER_TWO,
        y: -RADICAL_TWO_OVER_TWO,
      };
    } else {
      return {
        x: -RADICAL_TWO_OVER_TWO,
        y: +RADICAL_TWO_OVER_TWO,
      };
    }
  } else {
    if (yDir === "top") {
      return {
        x: +RADICAL_TWO_OVER_TWO,
        y: -RADICAL_TWO_OVER_TWO,
      };
    } else {
      return {
        x: +RADICAL_TWO_OVER_TWO,
        y: +RADICAL_TWO_OVER_TWO,
      };
    }
  }
};

/*
 * returns p adjusted by the corner radius so it now matches the corner of the curve
 * @param p: Point on the corner of an element
 * @param radius: number representing the border radius of the element
 * @param xDir: string indicating which x direction p is from the center of the element
 * @param yDir: string indicating which y direction p is from the center of the element
 * @return: Point which is p plus the adjustment
 */
const adjustCornerForBorderRadius = (
  p: Point,
  radius: number,
  xDir: string,
  yDir: string
): Point => {
  const { x, y } = getUnitVectorInDirection(xDir, yDir);
  // console.log(x, y)
  // console.log(radius, ONE_MINUS_RADICAL_TWO_OVER_TWO, p.x)
  return {
    x: -x * radius * ONE_MINUS_RADICAL_TWO_OVER_TWO + p.x,
    y: -y * radius * ONE_MINUS_RADICAL_TWO_OVER_TWO + p.y,
  };
  // return {
  //   x: -x * radius * RADICAL_TWO_OVER_TWO + p.x,
  //   y: -y * radius * RADICAL_TWO_OVER_TWO + p.y,
  // }
};

const getClosestCorners = (
  { logWindowRect, elementRect }: { logWindowRect: DOMRect; elementRect: DOMRect },
  {
    logWindowBorderRadius,
    elementBorderRadius,
  }: { logWindowBorderRadius: number; elementBorderRadius: number }
): { 1: Point; 2: Point } => {
  let x1: number = 0;
  let x2: number = 0;
  let y1: number = 0;
  let y2: number = 0;

  const c1: Point = getBoxCenter(logWindowRect);
  const c2: Point = getBoxCenter(elementRect);
  const cOffsets: Point = getCenterOffsetDirection(c2, c1);

  if (areBoxesOverlapping(logWindowRect, elementRect)) {
    let xDir: string = getXRectFieldNameFromOffset(cOffsets.x);
    let yDir: string = getYRectFieldNameFromOffset(cOffsets.y);

    if (
      isBoxOverlappingAPoint(logWindowRect, {
        x: (elementRect as any)[xDir],
        y: (elementRect as any)[yDir],
      })
    ) {
      xDir = getXRectFieldNameFromOffset(-cOffsets.x);
      if (
        isBoxOverlappingAPoint(logWindowRect, {
          x: (elementRect as any)[xDir],
          y: (elementRect as any)[yDir],
        })
      ) {
        xDir = getXRectFieldNameFromOffset(cOffsets.x);
        yDir = getXRectFieldNameFromOffset(-cOffsets.y);
        if (
          isBoxOverlappingAPoint(logWindowRect, {
            x: (elementRect as any)[xDir],
            y: (elementRect as any)[yDir],
          })
        ) {
          xDir = getXRectFieldNameFromOffset(-cOffsets.x);
        }
      }
    }

    x1 = (logWindowRect as any)[xDir];
    y1 = (logWindowRect as any)[yDir];
    x2 = (elementRect as any)[xDir];
    y2 = (elementRect as any)[yDir];
  } else {
    let xDir: string = getXRectFieldNameFromOffset(cOffsets.x);
    let yDir: string = getYRectFieldNameFromOffset(cOffsets.y);

    x2 = (elementRect as any)[xDir];
    y2 = (elementRect as any)[yDir];

    const offsetCLogToCornerElement: Point = getCenterOffsetDirection(c1, { x: x2, y: y2 });

    xDir = getXRectFieldNameFromOffset(offsetCLogToCornerElement.x);
    yDir = getYRectFieldNameFromOffset(offsetCLogToCornerElement.y);

    x1 = (logWindowRect as any)[xDir];
    y1 = (logWindowRect as any)[yDir];
  }

  const p1AdjForBorderRadius: Point = adjustCornerForBorderRadius(
    { x: x1, y: y1 },
    logWindowBorderRadius,
    getXRectFieldNameFromOffset(x1 - c1.x),
    getYRectFieldNameFromOffset(y1 - c1.y)
  );
  const p2AdjForBorderRadius: Point = adjustCornerForBorderRadius(
    { x: x2, y: y2 },
    elementBorderRadius,
    getXRectFieldNameFromOffset(x2 - c2.x),
    getYRectFieldNameFromOffset(y2 - c2.y)
  );

  // console.log(p1AdjForBorderRadius, p2AdjForBorderRadius)

  return {
    1: {
      x: p1AdjForBorderRadius.x,
      y: p1AdjForBorderRadius.y,
    },
    2: {
      x: p2AdjForBorderRadius.x,
      y: p2AdjForBorderRadius.y,
    },
  };
};

export default getClosestCorners;
