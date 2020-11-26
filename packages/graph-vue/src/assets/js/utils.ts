export const calculateCurve = (
  drection: string,
  position: { x1: number; y1: number; x2: number; y2: number }
) => {
  const { x1, y1, x2, y2 } = position
  const v = Math.abs(y2 - y1)
  const d = (v / 3) * 2
  let line = ''
  let arrow = ''
  const height = 10
  const halfWidth = 2.5
  if (drection === 'LR') {
    const qx1 = x1 + d
    const qy1 = y1
    const qx2 = x2 - d
    const qy2 = y2
    line = `M ${x1 + 4} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2 -
      4} ${y2}  ${x2} ${y2}`
    arrow = `M ${x2 - height}, ${y2 + halfWidth} L ${x2 - 5}, ${y2} L ${x2 -
      height}, ${y2 - halfWidth} Z`
  } else {
    const qx1 = x1
    const qy1 = y1 + d
    const qx2 = x2
    const qy2 = y2 - d
    line = `M ${x1} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2 -
      10} L${x2} ${y2} `
    arrow = `M ${x2 - halfWidth}, ${y2 - height} L ${x2}, ${y2 - 5} L ${x2 +
      halfWidth}, ${y2 - height} Z`
  }
  return { line, arrow }
}
