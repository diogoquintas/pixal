import { forwardRef, useEffect, useRef } from "react";
import getCanvasPosition from "../../logic/canvas/getCanvasPosition";
import useClickInteraction from "../../logic/events/useClickInteraction";
import useKeyboardInteraction from "../../logic/events/useKeyboardInteraction";
import useTouchInteraction from "../../logic/events/useTouchInteraction";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { MODE } from "../../App";

const StyledCanvas = styled.canvas`
  cursor: cell;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  ${({ isMove, isTransacting }) =>
    isMove &&
    !isTransacting &&
    css`
      cursor: cell;
    `}

  ${({ transacting }) =>
    transacting &&
    css`
      cursor: not-allowed;
    `}
`;

const Canvas = forwardRef(
  (
    {
      canvasCtx,
      position,
      transacting,
      interact,
      updateZoom,
      updatePosition,
      setCanvasReady,
      currentMode,
      setMode,
      mode,
      canvasReady,
      updateMarker,
    },
    ref
  ) => {
    const canvasRef = useRef();

    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvasCtx.current = ctx;

      function resetCanvasPosition() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;

        position.current = getCanvasPosition(position.current);

        setCanvasReady(true);
        updateMarker();
      }

      window.addEventListener("resize", resetCanvasPosition);

      resetCanvasPosition();

      return () => {
        window.removeEventListener("resize", resetCanvasPosition);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useTouchInteraction({
      canvasRef,
      position,
      updatePosition,
      updateZoom,
      disabled: !canvasReady,
      interact,
      currentMode,
    });
    useClickInteraction({
      canvasRef,
      transacting,
      interact,
      currentMode,
      updatePosition,
      disabled: !canvasReady,
    });
    useKeyboardInteraction({
      setMode,
      updatePosition,
      updateZoom,
      interact,
      disabled: !canvasReady,
    });

    return (
      <StyledCanvas
        ref={(elementRef) => {
          ref.current = elementRef;
          canvasRef.current = elementRef;
        }}
        isMove={mode === MODE.move}
        transacting={transacting}
      >
        Browser does not support canvas{" "}
      </StyledCanvas>
    );
  }
);

export default Canvas;
