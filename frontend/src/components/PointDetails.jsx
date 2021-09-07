import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { BASE_VALUE } from "../blockchain/load";

export default function PointDetails({ x, y, color, offer, setOffer }) {
  const [details, setDetails] = useState();

  useEffect(() => {
    async function getDetails() {
      try {
        const pixel = await window.contract.methods._getPixel([x, y]).call();

        setDetails(pixel);
        setOffer(Number(pixel.value) + 1);
      } catch (err) {
        console.log(err);

        setDetails({
          value: BASE_VALUE,
        });
      }
    }

    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li>
      <div>
        <div className="color-square" style={{ backgroundColor: color }} />
        <span>{`(${x}, ${y})`}</span>
      </div>
      {details && (
        <div>
          <label for="value">Offer (wei)</label>
          <input
            type="number"
            min={details.value}
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            name="value"
          />
        </div>
      )}
    </li>
  );
}
