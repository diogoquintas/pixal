import { useEffect, useRef } from "react";
import { MODE } from "../../App";

export default function useClickInteraction({
  transacting,
  interact,
  canvasRef,
  currentMode,
  updatePosition,
  disabled,
}) {
  const clickingOnCanvas = useRef(false);
  const previousPosition = useRef();

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;

    function handleMouseDown(event) {
      const isMove = currentMode.current === MODE.move;

      if (transacting && !isMove) return;

      if (isMove) {
        previousPosition.current = {
          x: event.clientX,
          y: event.clientY,
        };
      } else {
        interact();
      }

      clickingOnCanvas.current = true;
    }

    function handleMouseMove(event) {
      if (!clickingOnCanvas.current) return;

      const isMove = currentMode.current === MODE.move;

      if (isMove) {
        if (previousPosition.current) {
          updatePosition(
            previousPosition.current.x - event.clientX,
            previousPosition.current.y - event.clientY
          );
        }

        previousPosition.current = {
          x: event.clientX,
          y: event.clientY,
        };
      } else {
        interact();
      }
    }

    function handleMouseUp(event) {
      clickingOnCanvas.current = false;
      previousPosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, transacting]);
}
