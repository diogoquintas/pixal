import "./styles.css";
import {
  handleTouchEnd,
  handleTouchStart,
  handleTouchMove,
} from "./events/touch";
import { resizeCanvas } from "./events/resize";
import loadBlockchain from "./blockchain/load";

window.canvas = document.querySelector("canvas");
window.hiddenCanvas = document.createElement("canvas");
window.canvasCtx = window.canvas.getContext("2d");
window.hiddenCanvasCtx = window.hiddenCanvas.getContext("2d");
window.position = {
  zoom: 1,
  xOffset: 0,
  yOffset: 0,
  mouseX: 0,
  mouseY: 0,
  xMin: 0,
  yMin: 0,
};
window.savedPoints = {};
window.savePointsTimeoutId;

const image = document.createElement('img');
const BOARD_SIZE = 1000;
const MIN_ZOOM = 1;
const MAX_ZOOM = 500;
const SAVE_POINTS_TIMER = 1000;

let queuedPoints = {};

function paintPoint({
  x,
  y,
  color,
  size,
  context = window.canvasCtx,
  zoomAmount = window.position.zoom,
}) {
  const sizeOffset = zoomAmount * Math.floor((size - 1) / 2);

  context.fillStyle = color;
  context.fillRect(
    x - sizeOffset,
    y - sizeOffset,
    zoomAmount * size,
    zoomAmount * size
  );
}

function savePoint({ x, y, color, size }) {
  const ctx = window.hiddenCanvasCtx;

  for (let xItenerator = 0; xItenerator < size; xItenerator++) {
    for (let yItenerator = 0; yItenerator < size; yItenerator++) {
      const pointX = Math.floor(x + xItenerator);
      const pointY = Math.floor(y + yItenerator);

      if (pointX < BOARD_SIZE && pointY < BOARD_SIZE) {
        window.savedPoints[`${pointX}-${pointY}`] = color;
        queuedPoints[`${pointX}-${pointY}`] = color;

        ctx.fillStyle = color;
        ctx.fillRect(pointX, pointY, 1, 1);
      }
    }
  }

  setTimeoutToSavePoints();
}

function draw() {
  const canvas = window.canvas;
  const ctx = window.canvasCtx;
  const { zoom, xMin, yMin } = window.position;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.strokeRect(
    (0 - xMin) * zoom,
    (0 - yMin) * zoom,
    BOARD_SIZE * zoom,
    BOARD_SIZE * zoom
  );

  ctx.drawImage(
    image,
    xMin,
    yMin,
    canvas.width / zoom,
    canvas.height / zoom,
    0,
    0,
    canvas.width,
    canvas.height
  );

  for (const [id, color] of Object.entries(queuedPoints)) {
    const [x, y] = id.split("-");

    paintPoint({
      x: (x - xMin) * zoom,
      y: (y - yMin) * zoom,
      color,
      size: 1,
    });
  }

  requestAnimationFrame(draw);
}

function saveImage() {
  image.src = window.hiddenCanvas.toDataURL();
  queuedPoints = {};
}

function setTimeoutToSavePoints() {
  const savePointsTimeoutId = window.savePointsTimeoutId;

  if (savePointsTimeoutId) {
    clearTimeout(savePointsTimeoutId);
  }

  window.savePointsTimeoutId = setTimeout(saveImage, SAVE_POINTS_TIMER);
}

window.updateZoom = (delta) => {
  setTimeoutToSavePoints();

  const position = window.position;

  const nextZoom = Math.min(
    Math.max(MIN_ZOOM, position.zoom - delta * 0.3),
    MAX_ZOOM
  );

  const mouseBeforeZoom = {
    x: position.mouseX / position.zoom,
    y: position.mouseY / position.zoom,
  };

  position.zoom = nextZoom;

  const mouseAfterZoom = {
    x: position.mouseX / nextZoom,
    y: position.mouseY / nextZoom,
  };

  position.xMin = position.xMin + (mouseBeforeZoom.x - mouseAfterZoom.x);
  position.yMin = position.yMin + (mouseBeforeZoom.y - mouseAfterZoom.y);

  position.xOffset = -(position.xMin * position.zoom);
  position.yOffset = -(position.yMin * position.zoom);
};

window.updatePosition = (x, y) => {
  setTimeoutToSavePoints();

  const position = window.position;

  position.xOffset = position.xOffset - x;
  position.yOffset = position.yOffset - y;
  position.xMin = -(position.xOffset / position.zoom);
  position.yMin = -(position.yOffset / position.zoom);
};

export function firstDraw(pixels) {
  const canvas = window.hiddenCanvas;
  const ctx = window.hiddenCanvasCtx;

  pixels.forEach(([color, address, value, [x, y]]) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  });

  image.src = canvas.toDataURL();

  requestAnimationFrame(draw);
}

window.canvas.addEventListener("mousedown", (event) => {
  const colorPicker = document.getElementById("colorPicker");

  const color = colorPicker.value;

  const { xMin, yMin, zoom } = window.position;

  savePoint({
    x: Math.floor(xMin + event.clientX / zoom),
    y: Math.floor(yMin + event.clientY / zoom),
    color,
    size: 1,
  });
});

window.canvas.addEventListener("wheel", (event) => {
  if (event.ctrlKey) {
    window.updateZoom(event.deltaY);

    event.preventDefault();
  } else {
    window.updatePosition(event.deltaX * 1.5, event.deltaY * 1.5);
  }
});

window.canvas.addEventListener("touchstart", handleTouchStart);
window.canvas.addEventListener("touchmove", handleTouchMove, false);
document.addEventListener("touchcancel", handleTouchEnd);
document.addEventListener("touchend", handleTouchEnd);

window.canvas.addEventListener("DOMMouseScroll", (event) =>
  event.preventDefault()
);

document.addEventListener("mousemove", (e) => {
  window.position.mouseX = e.clientX;
  window.position.mouseY = e.clientY;
});

document.addEventListener("resize", resizeCanvas);

resizeCanvas();
loadBlockchain(firstDraw);
