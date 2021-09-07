let cachedTouches = [];
let prevDistanceBetweenTouches = 0;

function distanceBetweenPoints(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function getCachedTouch(touch) {
  let touchIndex = -1;

  const foundTouch = cachedTouches.find((cachedTouch, index) => {
    if (cachedTouch.identifier === touch.identifier) {
      touchIndex = index;

      return true;
    }

    return false;
  });

  return [foundTouch, touchIndex];
}

function cacheTouches(touches) {
  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];

    cachedTouches.push(touch);
  }
}

export function handleTouchEnd(event) {
  cachedTouches = [];
  cacheTouches(event.targetTouches);

  if (cachedTouches.length < 2) {
    prevDistanceBetweenTouches = 0;
  }
}

export function handleTouchStart(event) {
  cacheTouches(event.targetTouches);
}

export function handleTouchMove(event) {
  event.preventDefault();

  const touches = event.changedTouches;
  const { position, updateZoom, updatePosition } = window;

  if (touches.length === 2) {
    const [touch1, touch2] = touches;
    const [cachedTouch1, cachedTouch1Index] = getCachedTouch(touch1);
    const [cachedTouch2, cachedTouch2Index] = getCachedTouch(touch2);

    if (!cachedTouch1 || !cachedTouch2) return;

    const touch1Point = { x: touch1.clientX, y: touch1.clientY };
    const touch2Point = { x: touch2.clientX, y: touch2.clientY };

    const distanceBetweenTouches = distanceBetweenPoints(
      touch1Point,
      touch2Point
    );

    if (prevDistanceBetweenTouches !== 0) {
      position.mouseX = (touch2Point.x + touch1Point.x) / 2;
      position.mouseY = (touch2Point.y + touch1Point.y) / 2;

      updateZoom(prevDistanceBetweenTouches - distanceBetweenTouches);
    }

    prevDistanceBetweenTouches = distanceBetweenTouches;

    cachedTouches[cachedTouch1Index] = touch1;
    cachedTouches[cachedTouch2Index] = touch2;
  } else if (touches.length === 1) {
    const [touch] = touches;
    const [cachedTouch, cachedTouchIndex] = getCachedTouch(touch);

    if (!cachedTouch) return;

    updatePosition(
      -(touch.clientX - cachedTouch.clientX),
      -(touch.clientY - cachedTouch.clientY)
    );

    cachedTouches[cachedTouchIndex] = touch;
  }
}
