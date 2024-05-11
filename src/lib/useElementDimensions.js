import { useState, useEffect } from "react";

function getElementDimensions(e) {
  const { clientWidth: width, clientHeight: height } = e ? e : window;
  return {
    width,
    height,
  };
}

export default function useElementDimensions(e) {
  const [dimensions, setDimensions] = useState(getElementDimensions(e));

  useEffect(() => {
    function handleResize() {
      setDimensions(getElementDimensions(e));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}
