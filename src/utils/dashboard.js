export function getDashboardLayout(
  pins = [],
  { columns, maxPinHeight, maxPinWidth } = {
    columns: 1,
    maxPinHeight: 1,
    maxPinWidth: 1
  }
) {
  const initialLayout = [...new Array(columns)].map(() => ({
    height: 0,
    pins: []
  }));

  return pins.reduce((layout, pin) => {
    let shortestColumn = layout[0];
    let minColumnHeight = Infinity;

    layout.forEach(column => {
      if (column.height < minColumnHeight) {
        minColumnHeight = column.height;
        shortestColumn = column;
      }
    });

    const scaledPinHeight = Math.min(
      (pin.height / pin.width) * maxPinWidth,
      maxPinHeight
    );

    shortestColumn.height += scaledPinHeight;
    shortestColumn.pins.push(pin);

    return layout;
  }, initialLayout);
}
