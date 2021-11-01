import { useEffect } from "react";
import { buildTouchMove, handleTouchStart, handleTouchEnd } from "./touch";

export default function useTouchInteraction({
  canvasRef,
  position,
  updateZoom,
  updatePosition,
  disabled,
  interact,
  currentMode,
}) {
  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;

    const handleMouseScroll = (event) => event.preventDefault();

    const handleTouchMove = buildTouchMove({
      position,
      updateZoom,
      updatePosition,
      interact,
      currentMode,
    });

    function isTouchpad(event) {
      if (event.wheelDeltaY) {
        if (event.wheelDeltaY === event.deltaY * -3) {
          return true;
        }
      } else if (event.deltaMode === 0) {
        return true;
      }
    }

    function handleWheel(event) {
      if (!event.ctrlKey && isTouchpad(event)) {
        updatePosition(event.deltaX * 1.5, event.deltaY * 1.5);
      } else {
        updateZoom(event.deltaY);
        event.preventDefault();
      }
    }

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("DOMMouseScroll", handleMouseScroll);
    document.addEventListener("touchcancel", handleTouchEnd);
    document.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("wheel", handleWheel);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove, false);
      canvas.removeEventListener("DOMMouseScroll", handleMouseScroll);
      document.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("wheel", handleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
