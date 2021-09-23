import "./styles.css";
import {
  handleTouchEnd,
  handleTouchStart,
  handleTouchMove,
} from "./events/touch";
import loadBlockchain from "./blockchain/load";
import { storageDeletePoint, storageSavePont } from "./storage/pointsStorage";
import { loadCanvas } from "./canvas/load";

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
  minZoom: 1,
  maxZoom: 500,
};
window.queuedPoints = {};
window.savePointsTimeoutId;
window.pixels = [];
window.pixelsById = {};

export const BOARD_SIZE = 1000;
const image = document.createElement("img");
const SAVE_POINTS_TIMER = 1000;

function paintPoint({
  x,
  y,
  color,
  size,
  context = window.canvasCtx,
  zoomAmount = window.position.zoom,
}) {
  const sizeOffset = zoomAmount * Math.floor((size - 1) / 2);

  context.strokeStyle = color;
  context.strokeRect(
    x - sizeOffset,
    y - sizeOffset,
    zoomAmount * size,
    zoomAmount * size
  );
}

export function savePoint({ x, y, color, size, addToBag = true }) {
  const ctx = window.hiddenCanvasCtx;

  for (let xItenerator = 0; xItenerator < size; xItenerator++) {
    for (let yItenerator = 0; yItenerator < size; yItenerator++) {
      const pointX = Math.floor(x + xItenerator);
      const pointY = Math.floor(y + yItenerator);

      if (pointX < BOARD_SIZE && pointY < BOARD_SIZE) {
        const id = `${pointX}-${pointY}`;

        if (addToBag) {
          storageSavePont(id, color);
        }

        window.queuedPoints[id] = color;

        ctx.fillStyle = color;
        ctx.fillRect(pointX, pointY, 1, 1);
      }
    }
  }
}

function draw() {
  const canvas = window.canvas;
  const ctx = window.canvasCtx;
  const { zoom, xMin, yMin, xOffset, yOffset } = window.position;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(image, xOffset, yOffset, BOARD_SIZE * zoom, BOARD_SIZE * zoom);

  for (const [id, color] of Object.entries(window.queuedPoints)) {
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
  window.queuedPoints = {};
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
    Math.max(position.minZoom, position.zoom - delta * 0.3),
    position.maxZoom
  );

  const mouseBeforeZoom = {
    x: position.mouseX / position.zoom,
    y: position.mouseY / position.zoom,
  };

  position.zoom = nextZoom;

  position.xOffscreen = BOARD_SIZE * position.zoom - window.innerWidth;
  position.yOffscreen = BOARD_SIZE * position.zoom - window.innerHeight;

  const mouseAfterZoom = {
    x: position.mouseX / nextZoom,
    y: position.mouseY / nextZoom,
  };

  const xMin = position.xMin + (mouseBeforeZoom.x - mouseAfterZoom.x);
  const yMin = position.yMin + (mouseBeforeZoom.y - mouseAfterZoom.y);

  position.xMin = Math.max(
    0,
    Math.min(xMin, position.xOffscreen / position.zoom)
  );
  position.yMin = Math.max(
    0,
    Math.min(yMin, position.yOffscreen / position.zoom)
  );

  position.xOffset = -(position.xMin * position.zoom);
  position.yOffset = -(position.yMin * position.zoom);
};

window.updatePosition = (x, y) => {
  setTimeoutToSavePoints();

  const position = window.position;

  position.xOffset = Math.min(
    0,
    Math.max(-position.xOffscreen, position.xOffset - x)
  );
  position.yOffset = Math.min(
    0,
    Math.max(-position.yOffscreen, position.yOffset - y)
  );
  position.xMin = -(position.xOffset / position.zoom);
  position.yMin = -(position.yOffset / position.zoom);
};

export function firstDraw() {
  const canvas = window.hiddenCanvas;
  const ctx = window.hiddenCanvasCtx;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  window.pixels.forEach(([color, address, value, [x, y]]) => {
    window.pixelsById[`${x}-${y}`] = {
      color,
      address,
      value,
      x,
      y,
    };

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  });

  image.src = canvas.toDataURL();

  requestAnimationFrame(draw);
}

function getPixelCoordinates({ clientX, clientY }) {
  const { xMin, yMin, zoom } = window.position;

  return {
    x: Math.floor(xMin + clientX / zoom),
    y: Math.floor(yMin + clientY / zoom),
  };
}

export function paintPixel({ x, y }) {
  const colorPicker = document.getElementById("colorPicker");
  const color = colorPicker.value;

  savePoint({
    x,
    y,
    color,
    size: 1,
  });

  setTimeoutToSavePoints();
}

export function deletePixel({ x, y }) {
  const id = `${x}-${y}`;
  const pixel = window.pixelsById[id];

  savePoint({
    x: Number(x),
    y: Number(y),
    color: pixel?.color ?? "#000",
    size: 1,
    addToBag: false,
  });

  setTimeoutToSavePoints();

  storageDeletePoint(id);
}

let clickingOnCanvas = false;
let isDeleting = false;

export function setDeleteMode() {
  document.querySelector("html").classList.add("delete");
  isDeleting = true;
}

export function setPaintingMode() {
  document.querySelector("html").classList.remove("delete");
  isDeleting = false;
}

export function disableCanvas() {
  document.querySelector("canvas").classList.add("disabled");
}

export function enableCanvas() {
  document.querySelector("canvas").classList.remove("disabled");
}

window.canvas.addEventListener("mousedown", (event) => {
  if (window.isLoadingPixels) return;

  const coordinates = getPixelCoordinates(event);

  if (isDeleting) {
    deletePixel(coordinates);
  } else {
    paintPixel(coordinates);
  }

  clickingOnCanvas = true;
});

window.canvas.addEventListener("mousemove", (event) => {
  if (!clickingOnCanvas) return;

  const coordinates = getPixelCoordinates(event);

  if (isDeleting) {
    deletePixel(coordinates);
  } else {
    paintPixel(coordinates);
  }
});

document.addEventListener("mouseup", () => {
  clickingOnCanvas = false;
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

loadCanvas();
loadBlockchain();
