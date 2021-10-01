import { h, render } from "preact";
import { useEffect } from "preact/hooks";
import Canvas from "./Canvas";
import DetailsPanel from "./DetailsPanel";

function Root() {
  useEffect(() => {
    console.log("load shit here");
  }, []);

  return (
    <>
      <Canvas />
      <DetailsPanel />
    </>
  );
}

render(<Root />, document.getElementById("root"));
