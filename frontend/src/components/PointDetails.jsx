import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { BASE_VALUE } from "../blockchain/load";
import styled from "@emotion/styled";

const Li = styled.li`
  display: flex;
  margin-bottom: 0.5rem;
`;

const Color = styled.div`
  display: flex;
  background-color: ${({ color }) => color};
  width: 7rem;
  height: 2rem;
  align-items: center;

  & > span {
    color: ${({ color }) => color};
    filter: invert(100%);
    flex: 1;
    padding: 0.2rem;
  }
`;

const RemoveButton = styled.button`
  background: none;
  padding: 0;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  filter: invert(100%);
  margin: 0 0.5rem;
  display: flex;
  align-items: center;

  & > span {
    height: 1.5rem;
  }
`;

const Input = styled.input`
  background: none;
  color: white;
  border: none;
  margin: 0 1rem;
  width: 3rem;
`;

const Offer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

export default function PointDetails({ x, y, color, offer, setOffer, remove }) {
  const [minOffer, setMinOffer] = useState();

  useEffect(() => {
    async function getDetails() {
      try {
        const pixel = window.pixelsById[`${x}-${y}`];

        if (!pixel) throw new Error("no pixel found");

        const minOffer = Number(pixel.value) + 1;

        setOffer(minOffer);
        setMinOffer(minOffer);
      } catch {
        setMinOffer(BASE_VALUE + 1);
      }
    }

    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Li>
      <Color color={color}>
        <span>{`(${x}, ${y})`}</span>
        <RemoveButton aria-label="remove point" onClick={remove}>
          <span>x</span>
        </RemoveButton>
      </Color>
      {minOffer && (
        <Offer>
          <Input
            aria-label="offer (wei)"
            title="offer (wei)"
            type="number"
            min={minOffer}
            value={offer}
            onChange={(e) => setOffer(Number(e.target.value))}
            name="value"
          />
        </Offer>
      )}
    </Li>
  );
}
