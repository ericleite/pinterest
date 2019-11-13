// Libs
import React from "react";

// Hooks
import useElementDimension from "hooks/useElementDimension";

// Utils
import { getDashboardLayout } from "utils/dashboard";
import { getElWidth } from "utils/element";

// Styles
import styles from "./Dashboard.module.scss";

// Constants
const MAX_PIN_HEIGHT = parseInt(styles.MAX_PIN_HEIGHT, 10);
const MAX_PIN_WIDTH = parseInt(styles.MAX_PIN_WIDTH, 10);

export default function Dashboard({ pins = [] }) {
  const [width, ref] = useElementDimension(getElWidth);
  const layout = getDashboardLayout(pins, {
    columns: (width / MAX_PIN_WIDTH) >> 0 || 1,
    maxPinHeight: MAX_PIN_HEIGHT,
    maxPinWidth: MAX_PIN_WIDTH
  });

  return (
    <div className={styles.dashboard} ref={ref}>
      {layout.map((column, index) => (
        <Column key={index} pins={column.pins} />
      ))}
    </div>
  );
}

function Column({ pins = [] }) {
  return (
    <div className={styles.column}>
      {pins.map(({ alt_description, id, urls }) => (
        <Pin key={id} alt={alt_description} id={id} src={urls.regular} />
      ))}
    </div>
  );
}

function Pin({ alt, id, src }) {
  return (
    <figure key={id} className={styles.pin}>
      <img alt={alt} src={src} />
    </figure>
  );
}
