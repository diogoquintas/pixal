/** @jsxImportSource @emotion/react */
import { forwardRef, useEffect, useRef, useState } from "react";
import { BOARD_SIZE, insideInterval } from "../../App";
import useViewport from "../../logic/useViewport";
import { mobile } from "../../styles/media";
import { getPixelPrice } from "../pixel-list/PixelList";
import {
  Coordinates,
  Image,
  MapWrapper,
  Marker,
  MapButton,
  InfoWrapper,
  CoordinatesWrapper,
  InfoButton,
  InfoButtons,
  InfoBlock,
} from "./Map.styles";
import MapIcon from "../icons/Map";
import { css } from "@emotion/react";
import { MODE } from "../../App";
import Share from "../icons/Share";

const MouseController = ({
  position,
  getPixelCoordinates,
  chainPixels,
  ready,
  selectedCoordinates,
  canvasRef,
  currentMode,
  mode,
  isMobileDevice,
  names,
  setAlert,
  selected,
  setSelected,
}) => {
  const [mouseCoordinates, setMouseCoordinates] = useState();
  const coordinates = isMobileDevice ? selected : selected ?? mouseCoordinates;

  useEffect(() => {
    function handleMouseMove(event) {
      if (isMobileDevice) return;

      position.current.mouseX = event.clientX;
      position.current.mouseY = event.clientY;

      const nextCoordinates = getPixelCoordinates();

      if (isNaN(nextCoordinates.x) || isNaN(nextCoordinates.y)) return;

      setMouseCoordinates(nextCoordinates);
    }

    function handleTouchStart(event) {
      const [touch] = event.touches;

      position.current.mouseX = touch.clientX;
      position.current.mouseY = touch.clientY;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleTouchStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !canvasRef.current) return;

    const canvas = canvasRef.current;

    function selectPixel() {
      if (currentMode.current !== MODE.move) return;

      const nextCoordinates = getPixelCoordinates();

      if (isNaN(nextCoordinates.x) || isNaN(nextCoordinates.y)) return;

      setSelected(nextCoordinates);
    }

    canvas.addEventListener("click", selectPixel);

    return () => {
      canvas.removeEventListener("click", selectPixel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    selectedCoordinates.current = selected;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (mode !== MODE.move) {
      setSelected(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (!coordinates || !ready) return null;

  const { x, y } = coordinates;
  const chainInfo = chainPixels.current?.[`${x}-${y}`];

  return (
    <InfoWrapper>
      {selected && (
        <InfoButtons>
          <InfoButton
            title="Share this pixel"
            aria-label="Share this pixel"
            onClick={() => {
              const url = `${window.location.origin}?x=${x}&y=${y}&x0=${position.current.xMin}&y0=${position.current.yMin}&zoom=${position.current.zoom}`;

              if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText === "function"
              ) {
                navigator.clipboard.writeText(url);
              } else {
                const text = document.createElement("textarea");

                document.body.appendChild(text);

                text.innerText = url;
                text.select();

                document.execCommand("copy");
                document.body.removeChild(text);
              }

              setAlert({
                severity: "success",
                dismissibleTime: 3000,
                title: (
                  <p>Link copied to clipboard. Share it with your friends!</p>
                ),
              });
            }}
          >
            <Share />
          </InfoButton>
          <InfoButton
            title="Close"
            aria-label="Close"
            onClick={() => setSelected(undefined)}
          >
            [x]
          </InfoButton>
        </InfoButtons>
      )}
      {chainInfo && (
        <InfoBlock>
          <p>{`PAINTED ${chainInfo.timesPainted} TIME${
            chainInfo.timesPainted === 1 ? "" : "S"
          }`}</p>
          <p>{`PRICE=${window.web3.utils.fromWei(
            `${getPixelPrice(chainInfo.timesPainted)}`
          )} ETH`}</p>
          <p>{`AUTHOR=${
            names.current[chainInfo.author]?.name ?? chainInfo.author
          }`}</p>
        </InfoBlock>
      )}
      <CoordinatesWrapper>
        <Coordinates
          color={chainInfo?.color}
          isOutside={!insideInterval(x) || !insideInterval(y)}
        >
          <span>{`<${x}, ${y}>`}</span>
        </Coordinates>
      </CoordinatesWrapper>
    </InfoWrapper>
  );
};

function MapImage({
  position,
  updatePosition,
  onClick,
  markerRef,
  imageRef,
  ...remainingProps
}) {
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const previousPosition = useRef();

  return (
    <MapWrapper
      canShow={loaded}
      onMouseLeave={() => {
        setIsDragging(false);
        previousPosition.current = undefined;
      }}
      {...remainingProps}
    >
      <Image
        onLoad={() => setLoaded(true)}
        ref={imageRef}
        alt="Map"
        onClick={(event) => {
          const rect = imageRef.current.getBoundingClientRect();

          const layerX = event.clientX - rect.left;
          const layerY = event.clientY - rect.top;

          const x = Math.floor((layerX * BOARD_SIZE) / rect.width);
          const y = Math.floor((layerY * BOARD_SIZE) / rect.height);
          const canvasX = x * position.current.zoom;
          const canvasY = y * position.current.zoom;

          const currentMiddleX =
            -position.current.offsetX + window.innerWidth / 2;
          const currentMiddleY =
            -position.current.offsetY + window.innerHeight / 2;

          const diffX = canvasX - currentMiddleX;
          const diffY = canvasY - currentMiddleY;

          updatePosition(diffX, diffY);

          onClick?.();

          event.stopPropagation();
          event.preventDefault();
        }}
      />
      <Marker
        ref={markerRef}
        onMouseDown={(event) => {
          setIsDragging(true);

          previousPosition.current = {
            x: event.clientX,
            y: event.clientY,
          };
        }}
        onMouseMove={(event) => {
          if (isDragging && previousPosition.current) {
            const alphaX = event.clientX - previousPosition.current.x;
            const alphaY = event.clientY - previousPosition.current.y;

            const nextTop = markerRef.current.offsetTop + alphaY;
            const nextLeft = markerRef.current.offsetLeft + alphaX;

            markerRef.current.style.top = `${nextTop}px`;
            markerRef.current.style.left = `${nextLeft}px`;

            const rect = imageRef.current.getBoundingClientRect();

            const x = Math.floor((alphaX * BOARD_SIZE) / rect.width);
            const y = Math.floor((alphaY * BOARD_SIZE) / rect.height);
            const canvasX = x * position.current.zoom;
            const canvasY = y * position.current.zoom;

            updatePosition(canvasX, canvasY);

            previousPosition.current = {
              x: event.clientX,
              y: event.clientY,
            };
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);
          previousPosition.current = undefined;
        }}
        onMouseLeave={() => {
          setIsDragging(false);
          previousPosition.current = undefined;
        }}
      />
    </MapWrapper>
  );
}

const Map = forwardRef(
  (
    {
      ready,
      getPixelCoordinates,
      position,
      chainPixels,
      markerRef,
      updatePosition,
      selectedCoordinates,
      canvasRef,
      currentMode,
      mode,
      isMobileDevice,
      names,
      setAlert,
      selected,
      setSelected,
    },
    ref
  ) => {
    const [mapOpen, setMapOpen] = useState(true);

    const isMobile = useViewport(mobile);

    return (
      <>
        <MouseController
          ready={ready}
          position={position}
          getPixelCoordinates={getPixelCoordinates}
          chainPixels={chainPixels}
          selectedCoordinates={selectedCoordinates}
          canvasRef={canvasRef}
          currentMode={currentMode}
          mode={mode}
          isMobileDevice={isMobileDevice}
          names={names}
          setAlert={setAlert}
          selected={selected}
          setSelected={setSelected}
        />
        {isMobile && ready && (
          <MapButton variant="outlined" onClick={() => setMapOpen(!mapOpen)}>
            <MapIcon />
          </MapButton>
        )}
        <MapImage
          css={
            isMobile &&
            css`
              top: 4rem;
              left: 1rem;
              width: calc(100% - 2rem);
              padding-top: 50%;
              transform: translateX(${mapOpen ? 0 : "-150%"});
              transition: ease transform 150ms;
            `
          }
          position={position}
          updatePosition={updatePosition}
          markerRef={markerRef}
          imageRef={ref}
          onClick={() => setMapOpen(false)}
        />
      </>
    );
  }
);

export default Map;
