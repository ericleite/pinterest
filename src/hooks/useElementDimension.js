import { useCallback, useEffect, useState } from "react";

function defaultGetDimension(el) {
  // noop
}

export default function useElementDimension(
  getDimension = defaultGetDimension
) {
  const [el, setEl] = useState();
  const [dimension, setDimension] = useState();

  const ref = useCallback(el => {
    setEl(el);
  }, []);

  useEffect(() => {
    setDimension(getDimension(el));
  }, [el, getDimension]);

  useEffect(() => {
    function handleResize() {
      setDimension(getDimension(el));
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [el, getDimension]);

  return [dimension, ref];
}
