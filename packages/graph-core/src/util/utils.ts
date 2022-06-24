import { IDataModel, IEdgeModel, INodeModel } from '../types'

const doc: Document & {
  mozCancelFullScreen?(): Promise<void>
  webkitExitFullscreen?(): Promise<void>
  msExitFullscreen?(): Promise<void>
  mozFullScreenElement?: Element
  webkitFullscreenElement?: Element
  msFullscreenElement?: Element
} = window.document
export const requestFullScreen = (
  el: Element & {
    mozRequestFullScreen?(): Promise<void>
    webkitRequestFullscreen?(): Promise<void>
    msRequestFullscreen?(): Promise<void>
  }
) => {
  const rfs =
    el.requestFullscreen ||
    el.mozRequestFullScreen ||
    el.webkitRequestFullscreen ||
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
const globalId: string[] = []
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

export const clone = (obj: any): any => {
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
    rst = {} as any
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

export const generateTreeEdge = (
  from: INodeModel,
  to: INodeModel
): IEdgeModel => {
  return {
    fromNodeId: from.id,
    toNodeId: to.id
  }
}

export const preorder = (root: INodeModel): IDataModel => {
  const nodes: INodeModel[] = []
  const edges: IEdgeModel[] = []
  function step(node: INodeModel) {
    if (!node) {
      return
    }
    nodes.push(node)
    if (node.children && node.children.length) {
      for (const child of node.children) {
        if (child) {
          edges.push(generateTreeEdge(node, child))
        }
      }
      for (const child of node.children) {
        step(child)
      }
    }
  }
  step(root)
  return { nodes, edges }
}

export const isIDataModel = (props: any): props is IDataModel =>
  typeof (props as IDataModel)['nodes'] !== 'undefined' &&
  typeof (props as IDataModel)['edges'] !== 'undefined'
