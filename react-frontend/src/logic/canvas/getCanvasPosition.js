import { BOARD_SIZE } from "../../App";

export default function getCanvasPosition(previousPosition) {
  const zoomX = window.innerWidth / (BOARD_SIZE + 2);
  const zoomY = window.innerHeight / (BOARD_SIZE + 2);

  const position = { ...previousPosition };

  position.zoom = Math.max(zoomX, zoomY);

  position.minZoom = position.zoom;
  position.maxZoom = position.zoom + 500;

  position.xOffscreen = BOARD_SIZE * position.zoom - window.innerWidth;
  position.yOffscreen = BOARD_SIZE * position.zoom - window.innerHeight;

  position.offsetX = -(position.xOffscreen / 2);
  position.offsetY = -(position.yOffscreen / 2);
  position.xMin = -(position.offsetX / position.zoom);
  position.yMin = -(position.offsetY / position.zoom);

  if (
    previousPosition.mouseX === undefined ||
    previousPosition.mouseY === undefined
  ) {
    position.mouseX = window.innerWidth / 2;
    position.mouseY = window.innerHeight / 2;
  }

  return position;
}
