import { useRef } from "react";

export default function useTimeout({ callback, number = 666 }) {
  const timeout = useRef();

  return () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(callback, number);
  };
}
