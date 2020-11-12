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
  // const qx1 = (x2 - x1) / 3 + x1
  // const qy1 = y1
  // const qx2 = ((x2 - x1) * 2) / 3 + x1
  // const qy2 = y2
  return `M ${x1} ${y1} C ${qx1} ${qy1}, ${qx2} ${qy2}, ${x2} ${y2}`
}

const doc = window.document as any
export const requestFullScreen = (el: any) => {
  const rfs =
    el.requestFullscreen ||
    el.mozRequestFullScreen ||
    el.webkitRequestFullScreen ||
    el.msRequestFullscreen

  rfs.call(el)
}

export const cancelFullScreen = () => {
  const exit =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen

  exit.call(doc)
}

export const isFullScreen = () => {
  return !(
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  )
}
