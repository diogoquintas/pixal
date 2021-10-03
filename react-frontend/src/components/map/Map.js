import { forwardRef, useEffect, useState } from "react";
import { BOARD_SIZE, insideInterval } from "../../App";
import {
  Coordinates,
  Image,
  MapWrapper,
  MAP_SIZE,
  Marker,
  Wrapper,
} from "./Map.styles";

const MouseController = ({ position, getPixelCoordinates, chainPixels }) => {
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    function handleMouseMove(event) {
      position.current.mouseX = event.clientX;
      position.current.mouseY = event.clientY;

      const nextCoordinates = getPixelCoordinates();

      if (isNaN(nextCoordinates.x) || isNaN(nextCoordinates.y)) return;

      setCoordinates(nextCoordinates);
    }

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!coordinates) return null;

  const { x, y } = coordinates;

  const chainInfo = chainPixels.current?.[`${x}-${y}`];

  return (
    <>
      {chainInfo && (
        <div>
          <p>{`>_last value= ${chainInfo.value} wei`}</p>
          <p>{`>_painter= ${chainInfo.address}`}</p>
        </div>
      )}
      <Coordinates
        color={chainInfo?.color}
        isOutside={!insideInterval(x) || !insideInterval(y)}
      >
        <span>{`<${x}, ${y}>`}</span>
      </Coordinates>
    </>
  );
};

const Map = forwardRef(
  (
    {
      ready,
      getPixelCoordinates,
      position,
      chainPixels,
      markerRef,
      updatePosition,
    },
    ref
  ) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <Wrapper>
        <MouseController
          position={position}
          getPixelCoordinates={getPixelCoordinates}
          chainPixels={chainPixels}
        />
        <MapWrapper canShow={loaded && ready}>
          <Image
            onLoad={() => setLoaded(true)}
            ref={ref}
            alt="Map"
            onClick={(event) => {
              const rect = event.target.getBoundingClientRect();

              const layerX = event.clientX - rect.left;
              const layerY = event.clientY - rect.top;

              const x = Math.floor((layerX * BOARD_SIZE) / MAP_SIZE);
              const y = Math.floor((layerY * BOARD_SIZE) / MAP_SIZE);

              const canvasX = x * position.current.zoom;
              const canvasY = y * position.current.zoom;

              const currentMiddleX =
                -position.current.offsetX + window.innerWidth / 2;
              const currentMiddleY =
                -position.current.offsetY + window.innerHeight / 2;

              const diffX = canvasX - currentMiddleX;
              const diffY = canvasY - currentMiddleY;

              updatePosition(diffX, diffY);
            }}
          />
          <Marker ref={markerRef} />
        </MapWrapper>
      </Wrapper>
    );
  }
);

export default Map;
