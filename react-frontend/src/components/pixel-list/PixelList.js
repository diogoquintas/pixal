import Input from "@mui/material/Input";
import { useEffect, useMemo, useState } from "react";
import Minus from "../icons/Minus";
import Plus from "../icons/Plus";
import {
  Control,
  ControlsWrapper,
  ListWrapper,
  StyledList,
  Item,
  Color,
  Amount,
  Delete,
} from "./PixelList.styles";

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
        <Amount>
          <label id={`${id}-amount-label`}>amount(wei):</label>
          <Input
            inputProps={{
              value: 1,
              type: "number",
              name: "value",
              "aria-labelledby": `${id}-amount-label`,
            }}
          />
        </Amount>
        <Delete onClick={() => setToDelete({ x, y, id })}>delete</Delete>
      </div>
    </Item>
  );
};

export default function PixelList({ pixels, revertPixel }) {
  const [open, setOpen] = useState(false);
  const [deleteQueue, setDeleteQueue] = useState([]);

  const pixelsAsList = useMemo(
    () =>
      Object.keys(pixels).flatMap((id) => {
        const [x, y] = id.split("-");

        return {
          id,
          x,
          y,
          color: pixels[id],
        };
      }),
    [pixels]
  );

  const setToDelete = ({ x, y, id }) => {
    setDeleteQueue((queue) => queue.concat(id));
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

        <Control
          variant="text"
          onClick={() => {
            pixelsAsList.forEach(({ x, y }) => revertPixel({ x, y }));
            setOpen(false);
          }}
        >
          Delete all
        </Control>
        <Control variant="outlined" onClick={() => console.log("paint")}>
          Paint on-chain
        </Control>
      </ControlsWrapper>
      <ListWrapper open={open}>
        <StyledList
          width={485}
          height={500}
          rowCount={pixelsAsList.length}
          rowHeight={45}
          rowRenderer={({ key, index, style }) => {
            const { color, x, y, id } = pixelsAsList[index];

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
                }}
              />
            );
          }}
        />
      </ListWrapper>
    </>
  );
}
