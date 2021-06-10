/**
 * 计算边和箭头路径的的函数
 * @param position 边的起始点坐标 x1 y1 和终点左边 y1 y2
 * @param direction 图的方向：TB（自上而下）LR（从左到右）
 * @param showArrow 是否需要显示箭头，不需要箭头边的路径上不会预留箭头的offset
 */
export const calculateCurve = (
  position: { x1: number; y1: number; x2: number; y2: number },
  direction = 'TB',
  showArrow = true
) => {
  const { x1, y1, x2, y2 } = position
  let line = ''
  let arrow = ''
  const arrowHeight = 10
  const arrowWidth = 4
  let lineEndOffset = 4
  const lineStartOffset = 4
  const arrowOffset = 6
  if (showArrow) {
    lineEndOffset = 11
  }
  if (direction === 'LR') {
    const v = (Math.abs(x2 - x1) / 3) * 2
    const d = v < 20 ? 20 : v
    const qx1 = x1 + d
    const qy1 = y1
    const qx2 = x2 - d
    const qy2 = y2
    line = `M ${x1 + lineStartOffset} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2 -
      lineEndOffset} ${y2}`
    arrow = `M ${x2 - arrowHeight}, ${y2 + arrowWidth / 2} L ${x2 -
      arrowOffset}, ${y2} L ${x2 - arrowHeight}, ${y2 - arrowWidth / 2} Z`
  } else {
    const v = (Math.abs(y2 - y1) / 3) * 2
    const d = v < 20 ? 20 : v
    const qx1 = x1
    const qy1 = y1 + d
    const qx2 = x2
    const qy2 = y2 - d
    line = `M ${x1} ${y1 +
      lineStartOffset} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2 -
      lineEndOffset}`
    arrow = `M ${x2 - arrowWidth / 2} ${y2 - arrowHeight} L ${x2} ${y2 -
      arrowOffset} L ${x2 + arrowWidth / 2} ${y2 - arrowHeight} Z`
  }
  return { line, arrow: showArrow ? arrow : '' }
}
