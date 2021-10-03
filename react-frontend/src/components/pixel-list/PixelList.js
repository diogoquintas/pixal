import { useEffect, useMemo, useState } from "react";
import Minus from "../icons/Minus";
import Plus from "../icons/Plus";
import PaintButton from "../paint-button/PaintButton";
import {
  Control,
  ControlsWrapper,
  ListWrapper,
  StyledList,
  Item,
  Color,
  Delete,
  Info,
  Value,
} from "./PixelList.styles";

const BASE_VALUE = 1;
const MAX_PIXELS_PER_TRANSACTION = Number(
  process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION
);

function getValueWithFees(value) {
  return value + value * 0.3 + value * 0.1;
}

const PixelItem = ({
  setDeleteQueue,
  style,
  inDeleteQueue,
  revertPixel,
  setToDelete,
  id,
  color,
  x,
  y,
  value,
}) => {
  useEffect(() => {
    return () => {
      setDeleteQueue((queue) => queue.filter((queuedId) => queuedId !== id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Item
      style={style}
      inDeleteQueue={inDeleteQueue}
      onAnimationEnd={() => {
        if (inDeleteQueue) {
          revertPixel({ x, y });
        }
      }}
    >
      <div>
        <Color color={color}>
          <span>{`[${color}]`}</span>
        </Color>
        <span>{`<${x}, ${y}>`}</span>
        <Value>{`${value} wei`}</Value>
        <Delete onClick={() => setToDelete({ x, y, id })}>[x]</Delete>
      </div>
    </Item>
  );
};

export default function PixelList({
  pixels,
  revertPixel,
  chainPixels,
  setTransacting,
  transacting,
  setAlert,
}) {
  const [open, setOpen] = useState(false);
  const [deleteQueue, setDeleteQueue] = useState([]);
  const [total, setTotal] = useState(0);

  const pixelsAsList = useMemo(
    () => {
      let listTotal = 0;

      const list = Object.keys(pixels).flatMap((id) => {
        const [x, y] = id.split("-");

        const onChain = chainPixels.current[id];
        const value = onChain ? getValueWithFees(onChain.value) : BASE_VALUE;

        listTotal = listTotal + value;

        return {
          id,
          x,
          y,
          color: pixels[id],
          address: onChain?.address,
          value,
        };
      });

      setTotal(listTotal);

      return list;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pixels]
  );

  const setToDelete = ({ x, y, id }) => {
    setDeleteQueue((queue) => queue.concat(id));
  };

  const deleteAll = () => {
    pixelsAsList.forEach(({ x, y }) => revertPixel({ x, y }));
    setOpen(false);
  };

  if (pixelsAsList?.length === 0) return null;

  return (
    <>
      <ControlsWrapper>
        <Control
          variant="contained"
          aria-label={`${open ? "Close" : "Open"} pixels settings`}
          title={`${open ? "Close" : "Open"} pixels settings`}
          onClick={() => setOpen(!open)}
        >
          <span>{pixelsAsList.length}</span>
          {open ? <Minus /> : <Plus />}
        </Control>
        <Control variant="text" onClick={deleteAll}>
          Delete all
        </Control>
        <PaintButton
          transacting={transacting}
          setTransacting={setTransacting}
          pixels={pixelsAsList}
          setAlert={setAlert}
          deleteAll={deleteAll}
        />
      </ControlsWrapper>
      <ListWrapper open={open}>
        <StyledList
          width={400}
          height={500}
          rowCount={pixelsAsList.length}
          rowHeight={45}
          rowRenderer={({ key, index, style }) => {
            const { color, x, y, id, value } = pixelsAsList[index];

            return (
              <PixelItem
                key={key}
                inDeleteQueue={deleteQueue.includes(id)}
                {...{
                  setDeleteQueue,
                  style,
                  revertPixel,
                  setToDelete,
                  id,
                  color,
                  x,
                  y,
                  value,
                }}
              />
            );
          }}
        />
        <Info>
          <span>{`>_total= ${total} wei`}</span>
          <span>{`>_transactions= ${Math.ceil(
            pixelsAsList.length / MAX_PIXELS_PER_TRANSACTION
          )}`}</span>
        </Info>
      </ListWrapper>
    </>
  );
}
