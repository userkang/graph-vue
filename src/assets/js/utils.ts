export const calculateCurve = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const qx1 = x1
  const qy1 = (y2 - y1) / 3 + y1
  const qx2 = x2
  const qy2 = ((y2 - y1) * 2) / 3 + y1
  return `M ${x1} ${y1} C ${qx1} ${qy1}, ${qx2} ${qy2}, ${x2} ${y2}`
}
