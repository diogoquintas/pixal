import { useEffect, useState } from "react";

export default function useViewport(breakpoint) {
  const [matching, setMatching] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      if (e.matches) {
        setMatching(true);
      } else {
        setMatching(false);
      }
    };

    const mediaQueryList = window.matchMedia(breakpoint);

    setMatching(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", handler);

    return () => {
      mediaQueryList.removeEventListener("change", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return matching;
}
