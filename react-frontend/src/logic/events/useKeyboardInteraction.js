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
  space: " ",
  colorPicker: "c",
};
const MOVE_SPEED = 50;
const ZOOM_SPEED = 5;

export default function useKeyboardInteraction({
  setMode,
  updatePosition,
  updateZoom,
  interact,
  disabled,
}) {
  useEffect(() => {
    if (disabled) return;

    function handleKeydown(event) {
      switch (event.key) {
        case KEYS.paint:
          setMode(MODE.paint);
          event.stopPropagation();
          return;
        case KEYS.delete:
          setMode(MODE.delete);
          event.stopPropagation();
          return;
        case KEYS.move:
          setMode(MODE.move);
          event.stopPropagation();
          return;
        case KEYS.top:
          updatePosition(0, -MOVE_SPEED);
          event.stopPropagation();
          return;
        case KEYS.bottom:
          updatePosition(0, MOVE_SPEED);
          event.stopPropagation();
          return;
        case KEYS.left:
          updatePosition(-MOVE_SPEED, 0);
          event.stopPropagation();
          return;
        case KEYS.right:
          updatePosition(MOVE_SPEED, 0);
          event.stopPropagation();
          return;
        case KEYS.zoomIn:
          updateZoom(-ZOOM_SPEED);
          event.stopPropagation();
          return;
        case KEYS.zoomOut:
          updateZoom(ZOOM_SPEED);
          event.stopPropagation();
          return;
        case KEYS.space:
          interact();
          event.stopPropagation();
          return;
        case KEYS.colorPicker: {
          const element = document.querySelector("#colorPicker");

          if (!element) return;

          element.focus();
          element.click();
          event.stopPropagation();
          return;
        }
        default:
          return;
      }
    }

    document.addEventListener("keydown", handleKeydown, { capture: true });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
