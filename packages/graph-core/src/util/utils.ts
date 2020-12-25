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

const map: { [key: string]: number } = {}
const globalId = []
export const uniqueId = (prefix: string) => {
  if (!map[prefix]) {
    map[prefix] = 1
  } else {
    map[prefix] += 1
  }
  let id = prefix + map[prefix]

  while (globalId.includes(id)) {
    map[prefix] += 1
    id = prefix + map[prefix]
  }

  return id
}

export const setGlobalId = (id: string) => {
  globalId.push(id)
}

export const clone = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let rst
  if (Array.isArray(obj)) {
    rst = []
    for (let i = 0, l = obj.length; i < l; i++) {
      if (typeof obj[i] === 'object' && obj[i] != null) {
        rst[i] = clone(obj[i])
      } else {
        rst[i] = obj[i]
      }
    }
  } else {
    rst = {}
    for (const k in obj) {
      if (typeof obj[k] === 'object' && obj[k] != null) {
        rst[k] = clone(obj[k])
      } else {
        rst[k] = obj[k]
      }
    }
  }
  return rst
}
