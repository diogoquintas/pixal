import { forwardRef, useEffect, useState } from "react";
import { BOARD_SIZE, insideInterval } from "../../App";
import { getPixelPrice } from "../pixel-list/PixelList";
import {
  Coordinates,
  Image,
  InfoDiv,
  MapWrapper,
  MAP_SIZE,
  Marker,
  Wrapper,
} from "./Map.styles";
import namehash from "eth-ens-namehash";

async function reverseName(address) {
  const lookup = address.toLowerCase().substr(2) + ".addr.reverse";
  const ResolverContract = await window.web3.eth.ens.resolver(lookup);
  const nh = namehash.hash(lookup);

  return ResolverContract.methods.name(nh).call();
}

const MouseController = ({ position, getPixelCoordinates, chainPixels }) => {
  const [coordinates, setCoordinates] = useState();
  const [names, setNames] = useState({});

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

  if (!coordinates) return null;

  const { x, y } = coordinates;
  const chainInfo = chainPixels.current?.[`${x}-${y}`];

  return (
    <>
      {chainInfo && (
        <InfoDiv>
          <p>{`>_painted ${chainInfo.paintCount} time${
            chainInfo.paintCount === 1 ? "" : "s"
          }`}</p>
          <p>{`>_price= ${window.web3.utils.fromWei(
            `${getPixelPrice(chainInfo.paintCount ?? 0)}`
          )} ETH`}</p>
          <p>{`>_painter= ${names[chainInfo.owner] ?? chainInfo.owner}`}</p>
        </InfoDiv>
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
