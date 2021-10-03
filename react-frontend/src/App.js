import { useEffect, useRef, useState } from "react";

import { storageGetPixels, storageUpdatePixels } from "./logic/storage/pixels";
import Canvas from "./components/canvas/Canvas";
import Loading from "./components/loading/Loading";
import { AlertWrapper } from "./App.styles";
import Alert from "@mui/material/Alert";
import Title from "./components/title/Title";
import useTimeout from "./logic/useTimeout";
import Controls from "./components/controls/Controls";
import Connect from "./components/connect/Connect";
import PixelList from "./components/pixel-list/PixelList";
import Map from "./components/map/Map";
import { MIN_SIZE } from "./components/size-picker/SizePicker";
import { MAP_SIZE } from "./components/map/Map.styles";

export const BOARD_SIZE = 1000;
export const MODE = {
  paint: "Paint",
  delete: "Delete",
  move: "Move",
};
export const MAIN_COLOR = "#ca98ff";
export const SECONDARY_COLOR = "#0000ff";

const ZOOM_STRENGTH = 0.5;

export const insideInterval = (coordinate) =>
  coordinate >= 0 && coordinate < BOARD_SIZE;

function App() {
  const [connected, setConnected] = useState(false);
  const [pixelsLoaded, setPixelsLoaded] = useState(false);
  const [transacting, setTransacting] = useState(false);
  const [mode, setMode] = useState(MODE.paint);
  const [alert, setAlert] = useState();
  const [canvasReady, setCanvasReady] = useState(false);
  const [localPixels, setLocalPixels] = useState({});

  const map = useRef(document.createElement("canvas"));
  const mapCtx = useRef(map.current.getContext("2d"));
  const pixelList = useRef([]);
  const imageRef = useRef();
  const canvasRef = useRef();
  const canvasCtx = useRef();
  const position = useRef({});
  const pixelsToDraw = useRef();
  const idsToRemove = useRef([]);
  const idsToAdd = useRef([]);
  const color = useRef(MAIN_COLOR);
  const size = useRef(MIN_SIZE);
  const chainPixels = useRef({});
  const currentMode = useRef(MODE.paint);
  const markerRef = useRef();

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvasCtx.current;

    const { zoom, xMin, yMin, offsetX, offsetY } = position.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(offsetX, offsetY, BOARD_SIZE * zoom, BOARD_SIZE * zoom);

    ctx.drawImage(
      imageRef.current,
      offsetX,
      offsetY,
      BOARD_SIZE * zoom,
      BOARD_SIZE * zoom
    );

    if (pixelsToDraw.current) {
      for (const id of Object.keys(pixelsToDraw.current)) {
        const [x, y] = id.split("-");
        const color = pixelsToDraw.current[id];

        ctx.fillStyle = color;
        ctx.fillRect((x - xMin) * zoom, (y - yMin) * zoom, zoom, zoom);
      }
    }

    const { x, y } = getPixelCoordinates();

    if (currentMode.current === MODE.paint) {
      ctx.fillStyle = color.current;
      ctx.fillRect(
        (x - Math.floor(size.current / 2) - xMin) * zoom,
        (y - Math.floor(size.current / 2) - yMin) * zoom,
        size.current * zoom,
        size.current * zoom
      );
    } else if (currentMode.current === MODE.delete) {
      ctx.strokeStyle = SECONDARY_COLOR;
      ctx.strokeRect(
        (x - Math.floor(size.current / 2) - xMin) * zoom,
        (y - Math.floor(size.current / 2) - yMin) * zoom,
        size.current * zoom,
        size.current * zoom
      );
    }

    requestAnimationFrame(draw);
  };

  const drawMap = () => {
    const canvas = map.current;
    const ctx = mapCtx.current;
    const nextChainPixels = {};

    ctx.clearRect(0, 0, map.width, map.height);

    pixelList.current.forEach(([color, address, value, [x, y]]) => {
      const id = `${x}-${y}`;

      nextChainPixels[id] = {
        color,
        address,
        value,
        x,
        y,
      };

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });

    chainPixels.current = nextChainPixels;

    const storagePixels = storageGetPixels();

    if (storagePixels) {
      requestAnimationFrame(() => {
        Object.keys(storagePixels).forEach((id) => {
          const [x, y] = id.split("-");

          ctx.fillStyle = storagePixels[id];
          ctx.fillRect(x, y, 1, 1);
        });

        imageRef.current.src = canvas.toDataURL();
        setPixelsLoaded(true);
        setLocalPixels(storagePixels);
      });
    } else {
      imageRef.current.src = canvas.toDataURL();
      setPixelsLoaded(true);
    }
  };

  const addPixelToQueue = ({ id, color, remove }) => {
    const nextPixelsToDraw = pixelsToDraw.current ?? {};

    nextPixelsToDraw[id] = color;

    pixelsToDraw.current = nextPixelsToDraw;

    if (remove) {
      idsToRemove.current.push(id);
    } else {
      idsToAdd.current.push(id);
    }
  };

  const updateImageWhenPossible = useTimeout({
    callback: () => {
      if (pixelsToDraw.current) {
        setLocalPixels((currentPixels) => {
          const nextPixels = { ...currentPixels };

          idsToRemove.current.forEach((id) => delete nextPixels[id]);
          idsToAdd.current.forEach(
            (id) => (nextPixels[id] = pixelsToDraw.current[id])
          );

          storageUpdatePixels(nextPixels);

          return nextPixels;
        });
      }

      imageRef.current.src = map.current.toDataURL();

      pixelsToDraw.current = undefined;
      idsToRemove.current = [];
      idsToAdd.current = [];
    },
  });

  const updateMarker = () => {
    if (!markerRef) return;

    const left = (position.current.xMin * MAP_SIZE) / BOARD_SIZE;
    const top = (position.current.yMin * MAP_SIZE) / BOARD_SIZE;

    const boardWidth = window.innerWidth / position.current.zoom;
    const boardHeight = window.innerHeight / position.current.zoom;

    const width = (boardWidth * MAP_SIZE) / BOARD_SIZE;
    const height = (boardHeight * MAP_SIZE) / BOARD_SIZE;

    markerRef.current.style.top = `${top}px`;
    markerRef.current.style.left = `${left}px`;
    markerRef.current.style.width = `${width}px`;
    markerRef.current.style.height = `${height}px`;
  };

  const revertPixel = ({ x, y }) => {
    const id = `${x}-${y}`;
    const color = chainPixels.current[id]?.color ?? "#000";

    addPixelToQueue({ id, color, remove: true });

    mapCtx.current.fillStyle = color;
    mapCtx.current.fillRect(x, y, 1, 1);

    updateImageWhenPossible();
  };

  const paintPixel = ({ x, y }) => {
    const id = `${x}-${y}`;

    addPixelToQueue({ id, color: color.current });

    mapCtx.current.fillStyle = color.current;
    mapCtx.current.fillRect(x, y, 1, 1);

    updateImageWhenPossible();
  };

  const getPixelCoordinates = (offsetX = 0, offsetY = 0) => {
    const { xMin, yMin, zoom, mouseX, mouseY } = position.current;

    return {
      x: Math.floor(xMin + mouseX / zoom) + offsetX,
      y: Math.floor(yMin + mouseY / zoom) + offsetY,
    };
  };

  const interact = () => {
    if (document.activeElement === document.getElementById("colorPicker"))
      return;

    for (let offsetX = 0; offsetX < size.current; offsetX++) {
      for (let offsetY = 0; offsetY < size.current; offsetY++) {
        interactWithPixel(
          offsetX - Math.floor(size.current / 2),
          offsetY - Math.floor(size.current / 2)
        );
      }
    }
  };

  const interactWithPixel = (offsetX, offsetY) => {
    const coordinates = getPixelCoordinates(offsetX, offsetY);

    if (
      isNaN(coordinates.x) ||
      isNaN(coordinates.y) ||
      !insideInterval(coordinates.x) ||
      !insideInterval(coordinates.y)
    )
      return;

    if (currentMode.current === MODE.delete) {
      revertPixel(coordinates);
    } else if (currentMode.current === MODE.paint) {
      paintPixel(coordinates);
    }
  };

  const updateZoom = (delta) => {
    const nextPosition = JSON.parse(JSON.stringify(position.current));

    const mouseBeforeZoom = {
      x: nextPosition.mouseX / nextPosition.zoom,
      y: nextPosition.mouseY / nextPosition.zoom,
    };

    nextPosition.zoom = Math.min(
      Math.max(nextPosition.minZoom, nextPosition.zoom - delta * ZOOM_STRENGTH),
      nextPosition.maxZoom
    );

    nextPosition.xOffscreen =
      BOARD_SIZE * nextPosition.zoom - window.innerWidth;
    nextPosition.yOffscreen =
      BOARD_SIZE * nextPosition.zoom - window.innerHeight;

    const mouseAfterZoom = {
      x: nextPosition.mouseX / nextPosition.zoom,
      y: nextPosition.mouseY / nextPosition.zoom,
    };

    const xMin = nextPosition.xMin + (mouseBeforeZoom.x - mouseAfterZoom.x);
    const yMin = nextPosition.yMin + (mouseBeforeZoom.y - mouseAfterZoom.y);

    nextPosition.xMin = xMin;
    nextPosition.yMin = yMin;

    nextPosition.offsetX = -(nextPosition.xMin * nextPosition.zoom);
    nextPosition.offsetY = -(nextPosition.yMin * nextPosition.zoom);

    position.current = nextPosition;
    updateMarker();
    updateImageWhenPossible();
  };

  const updatePosition = (x, y) => {
    const nextPosition = {};

    const nextX = position.current.offsetX - x;
    const nextY = position.current.offsetY - y;

    nextPosition.offsetX = nextX;
    nextPosition.offsetY = nextY;
    nextPosition.xMin = -(nextPosition.offsetX / position.current.zoom);
    nextPosition.yMin = -(nextPosition.offsetY / position.current.zoom);

    position.current = { ...position.current, ...nextPosition };
    updateMarker();
    updateImageWhenPossible();
  };

  useEffect(() => {
    const canvas = map.current;
    const ctx = mapCtx.current;

    canvas.width = BOARD_SIZE;
    canvas.height = BOARD_SIZE;

    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
  }, []);

  useEffect(() => {
    if (canvasReady) {
      draw();
      document.body.classList.add("canvas-ready");
      updateMarker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasReady]);

  useEffect(() => {
    currentMode.current = mode;
  }, [mode]);

  return (
    <>
      {alert && (
        <AlertWrapper>
          <Alert
            variant="filled"
            severity={alert.severity}
            onClose={() => setAlert(undefined)}
          >
            {alert.msg}
          </Alert>
        </AlertWrapper>
      )}
      {connected ? (
        pixelsLoaded ? (
          <>
            <Canvas
              ref={canvasRef}
              canvasCtx={canvasCtx}
              position={position}
              transacting={transacting}
              interact={interact}
              updateZoom={updateZoom}
              updatePosition={updatePosition}
              setCanvasReady={setCanvasReady}
              currentMode={currentMode}
              setMode={setMode}
              mode={mode}
              canvasReady={canvasReady}
            />
            <Controls mode={mode} setMode={setMode} color={color} size={size} />
            <PixelList
              pixels={localPixels}
              revertPixel={revertPixel}
              chainPixels={chainPixels}
              setTransacting={setTransacting}
              transacting={transacting}
              setAlert={setAlert}
            />
          </>
        ) : (
          <Loading drawMap={drawMap} />
        )
      ) : (
        <>
          <Title title={process.env.REACT_APP_NAME} />
          <Connect
            setAlert={setAlert}
            pixelList={pixelList}
            setConnected={setConnected}
          />
        </>
      )}
      <Map
        ref={imageRef}
        ready={canvasReady}
        getPixelCoordinates={getPixelCoordinates}
        position={position}
        chainPixels={chainPixels}
        markerRef={markerRef}
        updatePosition={updatePosition}
      />
    </>
  );
}

export default App;
