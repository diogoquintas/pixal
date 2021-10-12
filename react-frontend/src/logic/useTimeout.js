import { useRef } from "react";

export default function useTimeout({ callback, number = 500 }) {
  const timeout = useRef();

  return () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(callback, number);
  };
}
