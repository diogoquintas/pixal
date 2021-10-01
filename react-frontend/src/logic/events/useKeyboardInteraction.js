import { useEffect } from "react";
import { MODE } from "../../App";

export const KEYS = {
  paint: "p",
  delete: "d",
  move: "m",
  top: "ArrowUp",
  bottom: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  zoomIn: "+",
  zoomOut: "-",
};
const MOVE_SPEED = 50;
const ZOOM_SPEED = 5;

export default function useKeyboardInteraction({
  setMode,
  updatePosition,
  updateZoom,
  disabled,
}) {
  useEffect(() => {
    if (disabled) return;

    function handleKeydown(event) {
      switch (event.key) {
        case KEYS.paint:
          setMode(MODE.paint);
          return;
        case KEYS.delete:
          setMode(MODE.delete);
          return;
        case KEYS.move:
          setMode(MODE.move);
          return;
        case KEYS.top:
          updatePosition(0, -MOVE_SPEED);
          return;
        case KEYS.bottom:
          updatePosition(0, MOVE_SPEED);
          return;
        case KEYS.left:
          updatePosition(-MOVE_SPEED, 0);
          return;
        case KEYS.right:
          updatePosition(MOVE_SPEED, 0);
          return;
        case KEYS.zoomIn:
          updateZoom(-ZOOM_SPEED);
          return;
        case KEYS.zoomOut:
          updateZoom(ZOOM_SPEED);
          return;
        default:
          return;
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
