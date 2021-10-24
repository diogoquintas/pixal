import { BOARD_SIZE } from "../../App";

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

export default function getCanvasPosition(previousPosition) {
  const zoomX = window.innerWidth / (BOARD_SIZE + 2);
  const zoomY = window.innerHeight / (BOARD_SIZE + 2);

  const position = { ...previousPosition };

  const minZoom = Math.max(zoomX, zoomY);

  position.minZoom = minZoom;
  position.maxZoom = minZoom + 500;

  position.zoom = minZoom + 5;

  if (
    previousPosition.xMin === undefined ||
    previousPosition.yMin === undefined
  ) {
    position.offsetX = -getRandomNumber(
      BOARD_SIZE * position.zoom - window.innerWidth
    );
    position.offsetY = -getRandomNumber(
      BOARD_SIZE * position.zoom - window.innerHeight
    );
    position.xMin = -(position.offsetX / position.zoom);
    position.yMin = -(position.offsetY / position.zoom);
  }

  if (
    previousPosition.mouseX === undefined ||
    previousPosition.mouseY === undefined
  ) {
    position.mouseX = window.innerWidth / 2;
    position.mouseY = window.innerHeight / 2;
  }

  return position;
}
