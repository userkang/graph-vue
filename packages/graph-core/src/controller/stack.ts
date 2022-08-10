import { IEdge, INode } from '../types'
import { clone, isEqual, pick } from '../util/utils'
import {
  GetArrayElementType,
  IEdgeStackData,
  INodeStackData,
  IStack
} from '../types/type'
import { store } from '../item/store'

const DEEP = 20
const NODE_MODEL_KEY = ['x', 'y', 'width', 'height'] as const
const NODE_STATE_KEY = ['locaked', 'hide'] as const
const EDGE_MODEL_KEY = [
  'fromNodeId',
  'toNodeId',
  'fromPortId',
  'toPortId'
] as const
const EDGE_STATE_KEY = ['linked', 'hide'] as const
const DO_TYPE = {
  undo: 'undo',
  redo: 'redo'
} as const

type doType = keyof typeof DO_TYPE

const getINodeStackData = (node: INode): INodeStackData => {
  const res = {
    model: clone(node.model),
    rect: pick(node, NODE_MODEL_KEY),
    state: NODE_STATE_KEY.reduce((stateMap, key) => {
      stateMap[key] = node.hasState(key)
      return stateMap
    }, {} as Record<GetArrayElementType<typeof NODE_STATE_KEY>, boolean>)
  }
  return res
}

const getIEdgeStackData = (edge: IEdge): IEdgeStackData => {
  const res = {
    model: clone(edge.model),
    state: EDGE_STATE_KEY.reduce((stateMap, key) => {
      stateMap[key] = edge.hasState(key)
      return stateMap
    }, {} as Record<GetArrayElementType<typeof EDGE_STATE_KEY>, boolean>)
  }
  return res
}

export default class Stack {
  private startStackData: Pick<
    IStack,
    'beforeNodes' | 'beforeTransform' | 'beforeEdges'
  > | null = null

  public undoStack: IStack[] = []

  public redoStack: IStack[] = []

  constructor(readonly graphId: string) {}

  public clearStack() {
    this.undoStack = []
    this.redoStack = []
  }

  private pushStack(doType: doType, stackData: IStack) {
    const stack: IStack[] =
      doType === DO_TYPE.undo ? this.undoStack : this.redoStack

    stack.push(stackData)

    if (stack.length > DEEP) {
      stack.shift()
    }
    store.getters.graph(this.graphId).emit('stackchange')
  }

  public do(doType: doType) {
    const stack: IStack[] =
      doType === DO_TYPE.undo ? this.undoStack : this.redoStack
    const stackData = stack.pop()
    if (!stackData) {
      return
    }
    // transform
    const { beforeTransform, afterTransform } = stackData
    if (beforeTransform && afterTransform) {
      store.getters.graph(this.graphId).translateBy(
        beforeTransform.x - afterTransform.x,
        beforeTransform.y - afterTransform.y
      )
    }
    // node
    Object.keys(stackData.addNodes).forEach(id =>
      store.getters.graph(this.graphId).deleteNode(id, false)
    )
    Object.keys(stackData.removeNodes).forEach(id => {
      const { model, state, rect } = stackData.removeNodes[id]
      const node = store.getters.graph(this.graphId).addNode(model, false)
      if (node) {
        node.updatePosition(rect.x, rect.y)
        Object.keys(state).forEach(key => {
          state[key] ? node.setState(key) : node.clearState(key)
        })
      }
    })
    Object.keys(stackData.beforeNodes).forEach(id => {
      const node = store.getters.graph(this.graphId).findNode(id)
      if (node) {
        const { model, state, rect } = stackData.beforeNodes[id]
        node.updatePosition(rect.x, rect.y)
        node.update(model)
        Object.keys(state).forEach(key => {
          state[key] ? node.setState(key) : node.clearState(key)
        })
      }
    })
    // /node
    // edge
    Object.keys(stackData.addEdges).forEach(id => {
      store.getters.graph(this.graphId).deleteEdge(id, false)
    })
    Object.keys(stackData.removeEdges).forEach(id => {
      const { model, state } = stackData.removeEdges[id]
      const edge = store.getters.graph(this.graphId).addEdge(model, false)
      if (edge) {
        Object.keys(state).forEach(key => {
          state[key] ? edge.setState(key) : edge.clearState(key)
        })
      }
    })
    Object.keys(stackData.beforeEdges).forEach(id => {
      const edge = store.getters.graph(this.graphId).findEdge(id)
      if (edge) {
        const { model, state } = stackData.beforeEdges[id]
        edge.update(model)
        Object.keys(state).forEach(key => {
          state[key] ? edge.setState(key) : edge.clearState(key)
        })
      }
    })
    // edge
    // /transform
    this.pushStack(doType === DO_TYPE.undo ? DO_TYPE.redo : DO_TYPE.undo, {
      addNodes: stackData.removeNodes,
      removeNodes: stackData.addNodes,
      beforeNodes: stackData.afterNodes,
      afterNodes: stackData.beforeNodes,
      beforeTransform: stackData.afterTransform,
      afterTransform: stackData.beforeTransform,
      addEdges: stackData.removeEdges,
      removeEdges: stackData.addEdges,
      beforeEdges: stackData.afterEdges,
      afterEdges: stackData.beforeEdges
    })
    return
  }

  public undo() {
    return this.do('undo')
  }

  public redo() {
    return this.do('redo')
  }
  start() {
    if (this.startStackData) {
      return
    }

    const beforeNodes = store.getters.graph(this.graphId)
      .getNodes()
      .reduce((map, node) => {
        map[node.id] = getINodeStackData(node)
        return map
      }, {} as Record<string, INodeStackData>)

    const beforeEdges = store.getters.graph(this.graphId)
      .getEdges()
      .reduce((edgeMap, edge) => {
        edgeMap[edge.id] = getIEdgeStackData(edge)
        return edgeMap
      }, {} as Record<string, IEdgeStackData>)

    const beforeTransform = clone(store.getters.graph(this.graphId).getTranslate())
    this.startStackData = { beforeNodes, beforeEdges, beforeTransform }
  }
  end() {
    if (!this.startStackData) {
      return
    }

    const stackData: IStack = {
      addNodes: {},
      removeNodes: {},
      beforeNodes: {},
      afterNodes: {},
      beforeTransform: null,
      afterTransform: null,
      addEdges: {},
      removeEdges: {},
      beforeEdges: {},
      afterEdges: {}
    }
    // node
    const nodes = store.getters.graph(this.graphId).getNodes()
    for (const node of nodes) {
      const nodeData = getINodeStackData(node)
      if (!(node.id in this.startStackData.beforeNodes)) {
        stackData.addNodes[node.id] = nodeData
      } else {
        const same = isEqual(
          pick(this.startStackData.beforeNodes[node.id], ['rect', 'state']),
          pick(nodeData, ['rect', 'state'])
        )
        if (!same) {
          stackData.beforeNodes[node.id] =
            this.startStackData.beforeNodes[node.id]
          stackData.afterNodes[node.id] = nodeData
        }
        delete this.startStackData.beforeNodes[node.id]
      }
    }
    for (const id in this.startStackData.beforeNodes) {
      stackData.removeNodes[id] = this.startStackData.beforeNodes[id]
      delete this.startStackData.beforeNodes[id]
    }
    // /node
    // edge
    const edges = store.getters.graph(this.graphId).getEdges()
    for (const edge of edges) {
      const edgeData = getIEdgeStackData(edge)
      if (!(edge.id in this.startStackData.beforeEdges)) {
        stackData.addEdges[edge.id] = edgeData
      } else {
        const same = isEqual(
          pick(this.startStackData.beforeEdges[edge.id], ['model', 'state']),
          pick(edgeData, ['model', 'state'])
        )
        if (!same) {
          stackData.beforeEdges[edge.id] =
            this.startStackData.beforeEdges[edge.id]
          stackData.afterEdges[edge.id] = edgeData
        }
        delete this.startStackData.beforeEdges[edge.id]
      }
    }
    for (const id in this.startStackData.beforeEdges) {
      stackData.removeEdges[id] = this.startStackData.beforeEdges[id]
      delete this.startStackData.beforeEdges[id]
    }
    // edge
    // transform
    const afterTransform = clone(store.getters.graph(this.graphId).getTranslate())
    if (!isEqual(this.startStackData.beforeTransform, afterTransform)) {
      stackData.beforeTransform = this.startStackData.beforeTransform
      stackData.afterTransform = afterTransform
    }
    // /transform

    const hasChange = Object.values(stackData).some(
      value => value && Object.keys(value).length
    )
    hasChange && this.pushStack('undo', stackData)
    this.startStackData = null
  }
}
