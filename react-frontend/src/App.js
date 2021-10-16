import { useEffect, useRef, useState } from "react";
import { storageGetPixels, storageUpdatePixels } from "./logic/storage/pixels";
import Canvas from "./components/canvas/Canvas";
import Loading from "./components/loading/Loading";
import { AlertWrapper, Message } from "./App.styles";
import Alert from "@mui/material/Alert";
import Title from "./components/title/Title";
import useTimeout from "./logic/useTimeout";
import Controls from "./components/controls/Controls";
import Connect from "./components/connect/Connect";
import PixelList, { getPixelPrice } from "./components/pixel-list/PixelList";
import Map from "./components/map/Map";
import { MIN_SIZE } from "./components/size-picker/SizePicker";
import { AlertTitle } from "@mui/material";
import getIsValidColor from "./logic/isValidColor";
import getIsMobileDevice from "./logic/isMobileDevice";
import getName from "./logic/blockchain/getName";

export const BOARD_SIZE = 1000;
export const MODE = {
  paint: "Paint",
  delete: "Delete",
  move: "Move",
};
export const MAIN_COLOR = "#ca98ff";
export const SECONDARY_COLOR = "#0000ff";
export const REFERENCE_PRICE = 10000000000000;

const FPS = 35;
const ZOOM_STRENGTH = 0.5;

export const insideInterval = (coordinate) =>
  coordinate >= 0 && coordinate < BOARD_SIZE;

function App() {
  const [pixelsLoaded, setPixelsLoaded] = useState(false);
  const [transacting, setTransacting] = useState(false);
  const [mode, setMode] = useState(MODE.move);
  const [alert, initialSetAlert] = useState();
  const [canvasReady, setCanvasReady] = useState(false);
  const [localPixels, setLocalPixels] = useState({});
  const [pixelsToLoad, setPixelsToLoad] = useState();
  const [stateChainPixels, setStateChainPixels] = useState({});
  const [isMobileDevice] = useState(getIsMobileDevice);

  const map = useRef(document.createElement("canvas"));
  const mapCtx = useRef(map.current.getContext("2d"));
  const imageRef = useRef();
  const canvasRef = useRef();
  const canvasCtx = useRef();
  const position = useRef({});
  const pixelsToDraw = useRef();
  const idsToRemove = useRef([]);
  const idsToAdd = useRef([]);
  const color = useRef(SECONDARY_COLOR);
  const size = useRef(MIN_SIZE);
  const chainPixels = useRef({});
  const currentMode = useRef(MODE.move);
  const markerRef = useRef();
  const alertTimeout = useRef();
  const chainPixelsToUpdate = useRef({});
  const pixelToAlert = useRef();
  const timeSinceLastDraw = useRef(0);
  const selectedCoordinates = useRef();
  const names = useRef({});

  const findName = async (address) => {
    names.current[address] = {
      ...names.current,
      [address]: {
        state: "loading",
      },
    };

    try {
      const name = await getName(address);

      names.current[address] = {
        ...names.current,
        [address]: {
          status: "success",
          name,
        },
      };
    } catch {
      names.current[address] = {
        ...names.current,
        [address]: {
          state: "failed",
        },
      };
    }
  };

  const parsePixel = (pixel) => {
    const {
      color,
      coordinates: [x, y],
      owner,
      count,
    } = pixel;

    const isValidColor = getIsValidColor(color);
    const name = names.current[owner];

    if (!name) {
      findName(owner);
    }

    return {
      color: isValidColor ? color : "#000000",
      message: isValidColor ? undefined : color.slice(0, 280),
      owner,
      count: Number(count),
      x: Number(x),
      y: Number(y),
      id: `${x}-${y}`,
    };
  };

  const draw = (time) => {
    requestAnimationFrame(draw);

    if (time - timeSinceLastDraw.current < 1000 / FPS) return;

    timeSinceLastDraw.current = time;

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

    if (isMobileDevice) {
      if (selectedCoordinates.current) {
        const { x, y } = selectedCoordinates.current;

        ctx.strokeStyle = "white";
        ctx.strokeRect((x - xMin) * zoom, (y - yMin) * zoom, zoom, zoom);
        ctx.strokeStyle = "black";
        ctx.strokeRect(
          (x - xMin) * zoom + 1,
          (y - yMin) * zoom + 1,
          zoom - 2,
          zoom - 2
        );
      }

      return;
    }

    if (currentMode.current === MODE.paint) {
      ctx.fillStyle = color.current;
      ctx.fillRect(
        (x - Math.floor(size.current / 2) - xMin) * zoom,
        (y - Math.floor(size.current / 2) - yMin) * zoom,
        size.current * zoom,
        size.current * zoom
      );
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        (x - Math.floor(size.current / 2) - xMin) * zoom,
        (y - Math.floor(size.current / 2) - yMin) * zoom,
        size.current * zoom,
        size.current * zoom
      );
    } else if (currentMode.current === MODE.delete) {
      ctx.strokeStyle = "white";
      ctx.strokeRect(
        (x - Math.floor(size.current / 2) - xMin) * zoom,
        (y - Math.floor(size.current / 2) - yMin) * zoom,
        size.current * zoom,
        size.current * zoom
      );
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        (x - Math.floor(size.current / 2) - xMin) * zoom + 1,
        (y - Math.floor(size.current / 2) - yMin) * zoom + 1,
        size.current * zoom - 2,
        size.current * zoom - 2
      );
    } else if (currentMode.current === MODE.move) {
      const targetX = selectedCoordinates.current?.x ?? x;
      const targetY = selectedCoordinates.current?.y ?? y;

      ctx.strokeStyle = "white";
      ctx.strokeRect(
        (targetX - xMin) * zoom,
        (targetY - yMin) * zoom,
        zoom,
        zoom
      );
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        (targetX - xMin) * zoom + 1,
        (targetY - yMin) * zoom + 1,
        zoom - 2,
        zoom - 2
      );
    }
  };

  const drawMap = () => {
    const ctx = mapCtx.current;
    const nextChainPixels = {};

    ctx.clearRect(0, 0, map.width, map.height);

    pixelsToLoad.forEach((pixel) => {
      if (pixel.count === "0") return;

      const pixelInfo = parsePixel(pixel);
      const { id, x, y, color } = pixelInfo;

      nextChainPixels[id] = pixelInfo;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });

    chainPixels.current = nextChainPixels;
    setStateChainPixels(nextChainPixels);
  };

  const firstDraw = () => {
    drawMap();

    const canvas = map.current;
    const ctx = mapCtx.current;

    const storagePixels = storageGetPixels();

    if (storagePixels) {
      requestAnimationFrame(() => {
        Object.keys(storagePixels).forEach((id) => {
          const [x, y] = id.split("-");

          ctx.fillStyle = storagePixels[id];
          ctx.fillRect(x, y, 1, 1);
        });

        setLocalPixels(storagePixels);

        setPixelsLoaded(true);
        imageRef.current.src = canvas.toDataURL();
      });
    }

    setPixelsLoaded(true);
    imageRef.current.src = canvas.toDataURL();
  };

  const addPixelToQueue = ({ id, color, remove, add }) => {
    const nextPixelsToDraw = pixelsToDraw.current ?? {};

    nextPixelsToDraw[id] = color;

    pixelsToDraw.current = nextPixelsToDraw;

    if (remove) {
      idsToRemove.current.push(id);
      updateLocalPixelsWhenPossible();
    }

    if (add) {
      idsToAdd.current.push(id);
      updateLocalPixelsWhenPossible();
    }
  };

  const updateImageWhenPossible = useTimeout({
    callback: () => {
      imageRef.current.src = map.current.toDataURL();

      pixelsToDraw.current = undefined;
    },
  });

  const updateLocalPixelsWhenPossible = useTimeout({
    callback: () => {
      if (idsToRemove.current.length === 0 && idsToAdd.current.length === 0)
        return;

      setLocalPixels((currentPixels) => {
        const nextPixels = { ...currentPixels };

        idsToRemove.current.forEach((id) => delete nextPixels[id]);
        idsToAdd.current.forEach(
          (id) => (nextPixels[id] = pixelsToDraw.current[id])
        );

        storageUpdatePixels(nextPixels);

        return nextPixels;
      });

      idsToRemove.current = [];
      idsToAdd.current = [];
    },
  });

  const updateChainPixelsWhenPossible = useTimeout({
    callback: () => {
      if (Object.keys(chainPixelsToUpdate.current).length === 0) return;

      setStateChainPixels((stateChainPixels) => ({
        ...stateChainPixels,
        ...chainPixelsToUpdate.current,
      }));

      chainPixelsToUpdate.current = {};

      if (pixelToAlert.current) {
        const { count, x, y, owner, color, message } = pixelToAlert.current;
        const price = window.web3.utils.fromWei(`${getPixelPrice(count)}`);
        const name = names.current[owner]?.name ?? owner;

        setAlert({
          severity: "info",
          dismissibleTime: message ? 10000 : 5000,
          title: (
            <>
              <p>{`>_${name} painted at <${x}, ${y}> ${
                message ? "👀" : `in the color ${color} 🎨`
              }`}</p>
              {message && <Message>{`"${message}"`}</Message>}
              <p>{`Current pixel price is ${price} ETH`}</p>
            </>
          ),
        });

        pixelToAlert.current = undefined;
      }
    },
  });

  const updateMarker = () => {
    if (!markerRef.current || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const mapWidth = rect.width;
    const mapHeight = rect.height;

    const left = (position.current.xMin * mapWidth) / BOARD_SIZE;
    const top = (position.current.yMin * mapHeight) / BOARD_SIZE;

    const boardWidth = window.innerWidth / position.current.zoom;
    const boardHeight = window.innerHeight / position.current.zoom;

    const width = (boardWidth * mapWidth) / BOARD_SIZE;
    const height = (boardHeight * mapHeight) / BOARD_SIZE;

    markerRef.current.style.top = `${top}px`;
    markerRef.current.style.left = `${left}px`;
    markerRef.current.style.width = `${width}px`;
    markerRef.current.style.height = `${height}px`;
  };

  const revertPixel = ({ x, y, removeFromList = true }) => {
    const id = `${x}-${y}`;
    const color = chainPixels.current[id]?.color ?? "#000";

    addPixelToQueue({ id, color, remove: removeFromList });

    mapCtx.current.fillStyle = color;
    mapCtx.current.fillRect(x, y, 1, 1);

    updateImageWhenPossible();
  };

  const paintPixel = ({ x, y, addToList = true }) => {
    const id = `${x}-${y}`;

    addPixelToQueue({ id, color: color.current, add: addToList });

    mapCtx.current.fillStyle = color.current;
    mapCtx.current.fillRect(x, y, 1, 1);

    updateImageWhenPossible();
  };

  const updateChainPixel = (_, { returnValues }) => {
    const pixel = returnValues._paintedPixel;

    if (!pixel) return;

    const pixelInfo = parsePixel(pixel);
    const { id, x, y, owner } = pixelInfo;

    const isFromAccount = owner === window.account;

    chainPixels.current[id] = pixelInfo;
    chainPixelsToUpdate.current[id] = pixelInfo;

    revertPixel({ x, y, removeFromList: isFromAccount });

    if (!isFromAccount) {
      pixelToAlert.current = pixelInfo;
    }

    updateChainPixelsWhenPossible();
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

    nextPosition.xMin =
      nextPosition.xMin + (mouseBeforeZoom.x - mouseAfterZoom.x);
    nextPosition.yMin =
      nextPosition.yMin + (mouseBeforeZoom.y - mouseAfterZoom.y);
    nextPosition.offsetX = -(nextPosition.xMin * nextPosition.zoom);
    nextPosition.offsetY = -(nextPosition.yMin * nextPosition.zoom);

    position.current = nextPosition;
    updateMarker();
    updateImageWhenPossible();
  };

  const updatePosition = (x, y) => {
    const nextPosition = {};

    nextPosition.offsetX = position.current.offsetX - x;
    nextPosition.offsetY = position.current.offsetY - y;
    nextPosition.xMin = -(nextPosition.offsetX / position.current.zoom);
    nextPosition.yMin = -(nextPosition.offsetY / position.current.zoom);

    position.current = { ...position.current, ...nextPosition };
    updateMarker();
    updateImageWhenPossible();
  };

  const setAlert = (alertValue) => {
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    if (alertValue?.dismissibleTime) {
      function callback() {
        initialSetAlert(undefined);
        alertTimeout.current = undefined;
      }

      alertTimeout.current = setTimeout(callback, alertValue.dismissibleTime);
    }

    initialSetAlert(alertValue);
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
      timeSinceLastDraw.current = performance.now();
      draw();
      document.body.classList.add("canvas-ready");
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
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            {alert.msg}
          </Alert>
        </AlertWrapper>
      )}
      {pixelsToLoad ? (
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
              updateMarker={updateMarker}
            />
            <Controls mode={mode} setMode={setMode} color={color} size={size} />
            <PixelList
              pixels={localPixels}
              revertPixel={revertPixel}
              stateChainPixels={stateChainPixels}
              setTransacting={setTransacting}
              transacting={transacting}
              setAlert={setAlert}
            />
          </>
        ) : (
          <Loading onMount={firstDraw} />
        )
      ) : (
        <>
          <Title title={process.env.REACT_APP_NAME} />
          <Connect
            setAlert={setAlert}
            setPixelsToLoad={setPixelsToLoad}
            updateChainPixel={updateChainPixel}
            isMobileDevice={isMobileDevice}
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
        selectedCoordinates={selectedCoordinates}
        canvasRef={canvasRef}
        currentMode={currentMode}
        mode={mode}
        isMobileDevice={isMobileDevice}
        names={names}
      />
    </>
  );
}

export default App;
