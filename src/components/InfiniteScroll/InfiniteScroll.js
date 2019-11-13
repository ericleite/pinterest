// Libs
import { useEffect, useState } from "react";

// Utils
import { getElHeight } from "utils/element";

let ticking = false;

export default function InfiniteScroll({ children, onLoad, threshold = 0 }) {
  const [scrollY, setScrollY] = useState(window.scrollY);
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });

        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      scrollY > 0 &&
      scrollY > getElHeight(document.body) - window.innerHeight - threshold
    ) {
      setIsPastThreshold(true);
    } else {
      setIsPastThreshold(false);
    }
    // TODO: This should also depend on window.innerHeight
  }, [scrollY, isLoading, threshold]);

  useEffect(() => {
    async function handleOnLoad() {
      if (isPastThreshold && !isLoading) {
        setIsLoading(true);
        await onLoad();
        setIsLoading(false);
      }
    }

    handleOnLoad();

    return () => {
      // TODO: Cancel any pending requests
    };
    // This effect should only run when the threshold state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPastThreshold, onLoad]);

  return children;
}
