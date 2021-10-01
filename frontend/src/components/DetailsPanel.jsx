import styled from "@emotion/styled";
import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  deletePixel,
  disableCanvas,
  enableCanvas,
  firstDraw,
  setDeleteMode,
  setPaintingMode,
} from "../app";
import { getPixels } from "../blockchain/getPixels";
import { BASE_VALUE, loadAccount } from "../blockchain/load";
import paint from "../blockchain/paint";
import {
  storageClearAllPoints,
  storageGetPoints,
} from "../storage/pointsStorage";
import hideScrollbar from "../styles/hideScrollbar";
import Eraser from "./Eraser";
import Ethereum from "./Ethereum";
import PointDetails from "./PointDetails";

const MAX_POINTS_PER_TRANSACTION = Number(
  process.env.MAX_POINTS_PER_TRANSACTION
);

const ColorPicker = styled.input`
  background: white;
  width: 2rem;
  height: 2rem;
  border: 0.1rem solid white;
  box-sizing: content-box;
  cursor: pointer;
  padding: 0;

  .delete & {
    background: none;
  }
`;

const DeletePoint = styled.button`
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  border: 0.1rem solid white;
  box-sizing: content-box;
  display: flex;
  cursor: pointer;
  padding: 0;
  background: none;

  & > svg {
    fill: white;
    width: 1.8rem;
    height: 1.8rem;
    margin: auto;
  }

  .delete & {
    background: white;

    & > svg {
      fill: black;
    }
  }
`;

const Controls = styled.form`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
`;

const Bag = styled.div`
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  max-height: 50%;
  background: #0a000059;
  padding: 1rem;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  margin-bottom: 1rem;

  ${hideScrollbar}
`;

const ClearAll = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: white;
  font-size: 1.2rem;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
`;

const PaintButton = styled.button`
  border: none;
  color: white;
  font-size: 2rem;
  text-align: left;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: underline;
  background: none;
  padding: 0;

  & > svg {
    width: 2rem;
    height: 2rem;
    margin-left: 0.5rem;
    display: none;
  }
`;

export default function DetailsPanel() {
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading) => {
    setIsLoading(loading);
    window.isLoadingPixels = loading;

    if (loading) {
      disableCanvas();
    } else {
      enableCanvas();
    }
  };

  function loadStoragePoints() {
    const pointsToAdd = storageGetPoints();

    setPoints((currentPoints) => {
      const updatedPoints = currentPoints
        .filter((point) => pointsToAdd[point.id])
        .map((point) => {
          const color = pointsToAdd[point.id];

          delete pointsToAdd[point.id];

          return {
            ...point,
            color,
          };
        });

      const newPoints = Object.entries(pointsToAdd).map(([id, color]) => {
        const [x, y] = id.split("-");

        return {
          id,
          x,
          y,
          color,
          offer: BASE_VALUE + 1,
        };
      });

      return updatedPoints.concat(newPoints);
    });
  }

  useEffect(() => {
    loadStoragePoints();

    document.addEventListener("mouseup", loadStoragePoints);

    return () => {
      document.removeEventListener("mouseup", loadStoragePoints);
    };
  }, []);

  const total = points.reduce((acc, item) => acc + item.offer, 0);

  const transactions = Math.ceil(points.length / MAX_POINTS_PER_TRANSACTION);
  const paintPoints = async () => {
    setLoading(true);

    await loadAccount();

    try {
      await paint(points);
      await getPixels();

      setPoints([]);
      storageClearAllPoints();
      firstDraw();
    } catch (err) {
      console.log(err);
      alert("error on transaction");
    }

    setLoading(false);
  };

  return (
    <Fragment>
      {points.length > 0 && (
        <Bag>
          <List>
            {points.map(({ id, ...point }) => (
              <PointDetails
                key={id}
                {...point}
                setOffer={(offer) =>
                  setPoints((currentPoints) =>
                    currentPoints.map((point) =>
                      point.id === id ? { ...point, offer } : point
                    )
                  )
                }
                remove={() => {
                  deletePixel({ x: point.x, y: point.y });

                  setPoints((currentPoints) =>
                    currentPoints.filter((point) => point.id !== id)
                  );
                }}
              />
            ))}
          </List>
          <ClearAll
            onClick={() => {
              points.forEach(({ x, y }) => {
                deletePixel({ x, y });
              });

              storageClearAllPoints();
              setPoints([]);
            }}
          >
            clear all
          </ClearAll>
          <p>{`count: ${points.length}`}</p>
          <p>{`total: ${total} wei`}</p>
          <PaintButton onClick={paintPoints}>
            <span>
              {isLoading
                ? `Processing your request...(${transactions} transaction${
                    transactions > 1 ? "s" : ""
                  })`
                : "Save"}
            </span>
            <Ethereum aria-hidden />
          </PaintButton>
        </Bag>
      )}
      <Controls onSubmit={(e) => e.preventDefault()}>
        <DeletePoint onClick={setDeleteMode}>
          <Eraser />
        </DeletePoint>
        <ColorPicker
          onClick={setPaintingMode}
          id="colorPicker"
          type="color"
          name="color"
          defaultValue="#FFFFFF"
        />
      </Controls>
    </Fragment>
  );
}
