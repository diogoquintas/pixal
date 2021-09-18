import { BOARD_SIZE } from "../app";

export function resizeCanvas() {
  window.canvas.width = window.innerWidth;
  window.canvas.height = window.innerHeight;

  window.hiddenCanvas.width = BOARD_SIZE;
  window.hiddenCanvas.height = BOARD_SIZE;

  window.canvasCtx.imageSmoothingEnabled = false;
  window.canvasCtx.mozImageSmoothingEnabled = false;
  window.canvasCtx.webkitImageSmoothingEnabled = false;
  window.canvasCtx.msImageSmoothingEnabled = false;

  window.hiddenCanvasCtx.imageSmoothingEnabled = false;
  window.hiddenCanvasCtx.mozImageSmoothingEnabled = false;
  window.hiddenCanvasCtx.webkitImageSmoothingEnabled = false;
  window.hiddenCanvasCtx.msImageSmoothingEnabled = false;
}
