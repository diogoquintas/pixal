import { BOARD_SIZE } from "../app";
import { resizeCanvas } from "../events/resize";

export function loadCanvasPosition() {
  const zoomX = window.innerWidth / (BOARD_SIZE + 2);
  const zoomY = window.innerHeight / (BOARD_SIZE + 2);

  const position = window.position;

  position.zoom = Math.max(zoomX, zoomY);

  position.minZoom = position.zoom;
  position.maxZoom = position.zoom + 500;

  position.xOffscreen = BOARD_SIZE * position.zoom - window.innerWidth;
  position.yOffscreen = BOARD_SIZE * position.zoom - window.innerHeight;

  position.xOffset = -(position.xOffscreen / 2);
  position.yOffset = -(position.yOffscreen / 2);
  position.xMin = -(position.xOffset / position.zoom);
  position.yMin = -(position.yOffset / position.zoom);
}

export function loadCanvas() {
  document.addEventListener("resize", () => {
    resizeCanvas();
    loadCanvasPosition();
  });

  resizeCanvas();
  loadCanvasPosition();
}
