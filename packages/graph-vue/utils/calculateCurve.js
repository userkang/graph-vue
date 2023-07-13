/**
 * 计算边和箭头路径的的函数
 * @param position 边的起始点坐标 x1 y1 和终点左边 y1 y2
 * @param direction 图的方向：TB（自上而下）LR（从左到右）
 * @param showArrow 是否需要显示箭头，不需要箭头边的路径上不会预留箭头的offset
 */
export const calculateCurve = (position, direction = 'TB') => {
  const { x1, y1, x2, y2 } = position

  if (direction === 'LR') {
    const v = (Math.abs(x2 - x1) / 3) * 2
    const d = v < 20 ? 20 : v
    const qx1 = x1 + d
    const qy1 = y1
    const qx2 = x2 - d
    const qy2 = y2
    return `M ${x1} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2}`
  }

  if (direction === 'TB') {
    const v = (Math.abs(y2 - y1) / 3) * 2
    const d = v < 20 ? 20 : v
    const qx1 = x1
    const qy1 = y1 + d
    const qx2 = x2
    const qy2 = y2 - d
    return `M ${x1} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2}`
  }

  if (direction === 'BT') {
    const v = (Math.abs(y2 - y1) / 3) * 2
    const d = v < 20 ? 20 : v
    const qx1 = x1
    const qy1 = y1 - d
    const qx2 = x2
    const qy2 = y2 + d
    return `M ${x1} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2}`
  }

  if (direction === 'RL') {
    const v = (Math.abs(x2 - x1) / 3) * 2
    const d = v < 20 ? 20 : v
    const qx1 = x1 - d
    const qy1 = y1
    const qx2 = x2 + d
    const qy2 = y2
    return `M ${x1} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2}`
  }

  return ''
}
