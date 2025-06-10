export const getContrastColor = (oklabColor: [number, number, number]) => {
  const [l] = oklabColor;
  return l > 0.65 ? "black" : "white";
}
