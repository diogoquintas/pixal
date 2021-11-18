import { useEffect, useMemo, useState, useRef } from "react";
import { REFERENCE_PRICE } from "../../App";
import { fromWei } from "../../logic/blockchain/getPriceInEth";
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

export function getPixelPrice(countCanBeString) {
  const count = Number(countCanBeString);

  if (count === 0 || isNaN(count)) return 0;

  return REFERENCE_PRICE * Math.pow(10, Math.min(11, count));
}

const MAX_PIXELS_PER_TRANSACTION = Number(
  process.env.REACT_APP_MAX_PIXELS_PER_TRANSACTION
);

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

  const priceInEth = fromWei(price);

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
        <span>{`<${x}, ${y}>`}</span>
        <Color color={color}>
          <span>{`[${color}]`}</span>
        </Color>
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
  onViewOnly,
}) {
  const [open, setOpen] = useState(false);
  const [deleteQueue, setDeleteQueue] = useState([]);
  const [total, setTotal] = useState(0);
  const [listHeight, setListHeight] = useState(500);

  const currentListId = useRef();

  const listRef = useRef();

  const pixelList = useMemo(
    () => {
      let listTotal = 0;

      const list = Object.keys(pixels).flatMap((id) => {
        const [x, y] = id.split("-");

        const onChain = stateChainPixels[id];
        const timesPainted = onChain?.timesPainted ?? 0;
        const price = getPixelPrice(timesPainted);

        listTotal = listTotal + price;

        return {
          id,
          x,
          y,
          color: pixels[id],
          author: onChain?.author,
          price,
          timesPainted,
        };
      });

      setTotal(listTotal);
      currentListId.current = Date.now();

      return list;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pixels, stateChainPixels]
  );

  const setToDelete = ({ x, y, id }) => {
    setDeleteQueue((queue) => queue.concat(id));
  };

  const deleteAll = () => {
    pixelList.forEach(({ x, y }) => revertPixel({ x, y }));
    setOpen(false);
  };

  useEffect(() => {
    if (pixelList?.length === 0) return;

    function setHeight() {
      if (!listRef.current) return;

      const rect = listRef.current.getBoundingClientRect();

      setListHeight(rect.height - 50);
    }

    window.addEventListener("resize", setHeight);

    setHeight();

    return () => {
      window.removeEventListener("resize", setHeight);
    };
  }, [pixelList]);

  useEffect(() => {
    if (transacting && open) {
      setOpen(false);
    }
  }, [transacting, open]);

  useEffect(() => {
    if (transacting && pixelList.length === 0) {
      setAlert({
        msg: ">_Congratulations! Your contribution is now on-chain for everyone to see!",
        severity: "success",
        dismissibleTime: 3000,
      });

      setTransacting(false);
    }
  }, [transacting, pixelList, setTransacting, setAlert]);

  if (pixelList?.length === 0) return null;

  return (
    <>
      <ControlsWrapper>
        {!transacting && (
          <>
            <Control
              variant="contained"
              aria-label={`${open ? "Close" : "Open"} pixels settings`}
              title={`${open ? "Close" : "Open"} pixels settings`}
              onClick={() => setOpen(!open)}
            >
              <span>{pixelList.length}</span>
              {open ? <Minus /> : <Plus />}
            </Control>
            <Control variant="text" onClick={deleteAll}>
              Clear all
            </Control>
          </>
        )}
        <PaintButton
          pixelList={pixelList}
          transacting={transacting}
          setTransacting={setTransacting}
          setAlert={setAlert}
          onViewOnly={onViewOnly}
        />
      </ControlsWrapper>
      <ListWrapper ref={listRef} open={open}>
        <StyledList
          width={345}
          height={listHeight}
          rowCount={pixelList.length}
          rowHeight={45}
          rowRenderer={({ key, index, style }) => {
            const pixel = pixelList[index];

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
          <span>{`total=${fromWei(total)} ETH`}</span>
          <span>{`transactions=${Math.ceil(
            pixelList.length / MAX_PIXELS_PER_TRANSACTION
          )}`}</span>
        </Info>
      </ListWrapper>
    </>
  );
}
