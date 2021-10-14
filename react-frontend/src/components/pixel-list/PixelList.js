import { useEffect, useMemo, useState } from "react";
import { REFERENCE_PRICE } from "../../App";
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

const MAX_PIXELS_PER_TRANSACTION = Number(
  process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION
);

export function getPixelPrice(count) {
  if (count === 0) return 0;

  return REFERENCE_PRICE * Math.pow(10, Math.min(11, count));
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
  price,
}) => {
  useEffect(() => {
    return () => {
      setDeleteQueue((queue) => queue.filter((queuedId) => queuedId !== id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const priceInEth = window.web3.utils.fromWei(`${price}`);

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
        <Value title={`${priceInEth} ETH`}>{`${priceInEth} ETH`}</Value>
        <Delete onClick={() => setToDelete({ x, y, id })}>[x]</Delete>
      </div>
    </Item>
  );
};

export default function PixelList({
  pixels,
  revertPixel,
  stateChainPixels,
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

        const onChain = stateChainPixels[id];
        const paintCount = onChain?.paintCount ?? 0;
        const price = getPixelPrice(paintCount);

        listTotal = listTotal + price;

        return {
          id,
          x,
          y,
          color: pixels[id],
          owner: onChain?.owner,
          price,
          paintCount,
        };
      });

      setTotal(listTotal);

      return list;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pixels, stateChainPixels]
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
          Clear all
        </Control>
        <PaintButton
          transacting={transacting}
          setTransacting={setTransacting}
          pixels={pixelsAsList}
          setAlert={setAlert}
        />
      </ControlsWrapper>
      <ListWrapper open={open}>
        <StyledList
          width={400}
          height={500}
          rowCount={pixelsAsList.length}
          rowHeight={45}
          rowRenderer={({ key, index, style }) => {
            const pixel = pixelsAsList[index];

            return (
              <PixelItem
                key={key}
                inDeleteQueue={deleteQueue.includes(pixel.id)}
                {...{
                  setDeleteQueue,
                  style,
                  revertPixel,
                  setToDelete,
                  ...pixel,
                }}
              />
            );
          }}
        />
        <Info>
          <span>{`total=${window.web3.utils.fromWei(`${total}`)} ETH`}</span>
          <span>{`transactions=${Math.ceil(
            pixelsAsList.length / MAX_PIXELS_PER_TRANSACTION
          )}`}</span>
        </Info>
      </ListWrapper>
    </>
  );
}
