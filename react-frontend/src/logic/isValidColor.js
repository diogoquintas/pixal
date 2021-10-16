export default function isValidColor(color) {
  const style = new Option().style;

  style.color = color;

  return style.color !== "";
}
