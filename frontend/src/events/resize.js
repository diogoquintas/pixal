export function resizeCanvas() {
    window.canvas.width = window.innerWidth;
    window.canvas.height = window.innerHeight;
  
    window.hiddenCanvas.width = window.innerWidth;
    window.hiddenCanvas.height = window.innerHeight;
  
    window.canvasCtx.imageSmoothingEnabled = false;
    window.canvasCtx.mozImageSmoothingEnabled = false;
    window.canvasCtx.webkitImageSmoothingEnabled = false;
    window.canvasCtx.msImageSmoothingEnabled = false;
  
    window.hiddenCanvasCtx.imageSmoothingEnabled = false;
    window.hiddenCanvasCtx.mozImageSmoothingEnabled = false;
    window.hiddenCanvasCtx.webkitImageSmoothingEnabled = false;
    window.hiddenCanvasCtx.msImageSmoothingEnabled = false;
  }