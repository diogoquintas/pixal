import { Fragment, h, render } from "preact";
import { useEffect, useState } from "preact/compat";
import { firstDraw } from "../app";
import { BASE_VALUE, loadAccount, loadBoard } from "../blockchain/load";
import Ethereum from "./Ethereum";
import PointDetails from "./PointDetails";

function DetailsPanel() {
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = () => {
      setPoints(
        Object.entries(window.savedPoints ?? {}).map(([id, color]) => {
          const [x, y] = id.split("-");

          return {
            id,
            x,
            y,
            color,
            offer: BASE_VALUE + 1,
          };
        })
      );
    };

    document.addEventListener("mouseup", handler);

    return () => {
      document.removeEventListener("mouseup", handler);
    };
  }, []);

  const total = points.reduce((acc, item) => acc + item.offer, 0);
  const paintPoints = async () => {
    setIsLoading(true);

    await loadAccount();

    try {
      await Promise.all(
        points.map(({ x, y, color, offer }) =>
          window.contract.methods._paint([x, y], color).send({
            from: window.account,
            value: offer,
          })
        )
      );

      setPoints([]);
      window.savedPoints = {};
      loadBoard(firstDraw);
    } catch (e) {
      console.log("error", e);
    }

    setIsLoading(false);
  };

  return (
    <Fragment>
      {points.length > 0 && (
        <div id="paintPanel">
          <ul id="pointList">
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
              />
            ))}
          </ul>
          <button id="paintButton" onClick={paintPoints}>
            <span>{isLoading ? "Painting..." : `Paint (${total} wei)`}</span>
            <Ethereum aria-hidden />
          </button>
        </div>
      )}
      <form id="controls" onSubmit={(e) => e.preventDefault()}>
        <input
          id="colorPicker"
          type="color"
          name="color"
          defaultValue="#FFFFFF"
        />
      </form>
    </Fragment>
  );
}

render(<DetailsPanel />, document.getElementById("detailsPanel"));
