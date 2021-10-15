/** @jsxImportSource @emotion/react */
import { forwardRef, useEffect, useState } from "react";
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
  CloseButton,
} from "./Map.styles";
import MapIcon from "../icons/Map";
import { css } from "@emotion/react";
import { MODE } from "../../App";
// import namehash from "eth-ens-namehash";

// async function reverseName(address) {
//   const lookup = address.toLowerCase().substr(2) + ".addr.reverse";
//   const ResolverContract = await window.web3.eth.ens.resolver(lookup);
//   const nh = namehash.hash(lookup);

//   return ResolverContract.methods.name(nh).call();
// }

const MouseController = ({
  position,
  getPixelCoordinates,
  chainPixels,
  ready,
  selectedCoordinates,
  canvasRef,
  currentMode,
}) => {
  const [mouseCoordinates, setMouseCoordinates] = useState();
  // const [names, setNames] = useState({});
  const [selected, setSelected] = useState();

  const coordinates = selected ?? mouseCoordinates;

  useEffect(() => {
    function handleMouseMove(event) {
      position.current.mouseX = event.clientX;
      position.current.mouseY = event.clientY;

      const nextCoordinates = getPixelCoordinates();

      if (isNaN(nextCoordinates.x) || isNaN(nextCoordinates.y)) return;

      setMouseCoordinates(nextCoordinates);
    }

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
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

  // useEffect(() => {
  //   if (!coordinates) return;

  //   const address =
  //     chainPixels.current?.[`${coordinates.x}-${coordinates.y}`]?.owner;

  //   if (!address) return;
  //   if (names[address]) return;

  //   async function getName() {
  //     try {
  //       const name = await reverseName(address);

  //       setNames((names) => ({ ...names, [address]: name }));
  //     } catch (err) {
  //       setNames((names) => ({ ...names, [address]: address }));
  //     }
  //   }

  //   getName();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [coordinates]);

  if (!coordinates || !ready) return null;

  const { x, y } = coordinates;
  const chainInfo = chainPixels.current?.[`${x}-${y}`];

  return (
    <InfoWrapper>
      {chainInfo && (
        <>
          <p>{`painted ${chainInfo.count} time${
            chainInfo.count === 1 ? "" : "s"
          }`}</p>
          <p>{`price=${window.web3.utils.fromWei(
            `${getPixelPrice(chainInfo.count)}`
          )} ETH`}</p>
          <p>{`painter=${chainInfo.owner}`}</p>
        </>
      )}
      <CoordinatesWrapper>
        <Coordinates
          color={chainInfo?.color}
          isOutside={!insideInterval(x) || !insideInterval(y)}
        >
          <span>{`<${x}, ${y}>`}</span>
        </Coordinates>
      </CoordinatesWrapper>
      {selected && (
        <CloseButton onClick={() => setSelected(undefined)}>[X]</CloseButton>
      )}
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

  return (
    <MapWrapper canShow={loaded} {...remainingProps}>
      <Image
        onLoad={() => setLoaded(true)}
        ref={imageRef}
        alt="Map"
        onClick={(event) => {
          const rect = event.target.getBoundingClientRect();

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
        }}
      />
      <Marker ref={markerRef} />
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
    },
    ref
  ) => {
    const [mapOpen, setMapOpen] = useState(false);

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
