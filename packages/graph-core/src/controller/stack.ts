import { IDataStack, IEdgeModel, INode, INodeModel, IStack } from '../types'
import Graph from './graph'
import { clone, isEqual } from '../util/utils'

const DEEP = 20
const NODE_MODEL_KEY = ['x', 'y', 'width', 'height']
const NODE_STATE_KEY = ['locaked', 'hide']
const EDGE_MODEL_KEY = ['fromNodeId', 'toNodeId', 'fromPortId', 'toPortId']
const EDGE_STATE_KEY = ['linked']

interface INodeStackData {
  model: INodeModel
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  state: Record<string, boolean>
}
interface IEdgeStackData {
  model: IEdgeModel
  state: Record<string, boolean>
}

interface StackItem {
  addNodes: Record<string, INodeStackData>
  removeNodes: Record<string, INodeStackData>
  beforeNodes: Record<string, INodeStackData>
  afterNodes: Record<string, INodeStackData>
  beforeTransform: { x: number; y: number } | null
  afterTransform: { x: number; y: number } | null
  addEdges: Record<string, IEdgeStackData>
  removeEdges: Record<string, IEdgeStackData>
  beforeEdges: Record<string, IEdgeStackData>
  afterEdges: Record<string, IEdgeStackData>
}

export default class Stack {
  private graph: Graph
  private stacking = false
  private startStackData: Pick<
    StackItem,
    'beforeNodes' | 'beforeTransform' | 'beforeEdges'
  > | null = null

  public undoStack: IStack[] = []

  public redoStack: IStack[] = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  public clearStack() {
    this.undoStack = []
    this.redoStack = []
  }

  public pushStack(
    type: string,
    data: IDataStack,
    stackType = 'undo',
    stackData: StackItem
  ) {
    let stack: IStack[] = []
    if (stackType === 'undo') {
      stack = this.undoStack
    } else {
      stack = this.redoStack
    }

    if (['stackStep'].includes(type)) {
      stack.push({ type, stackData } as any)
    } else {
      stack.push({ type, data: clone(data) })
    }

    if (stack.length > DEEP) {
      stack.shift()
    }
  }

  public undo() {
    const stack = this.undoStack.pop()
    if (!stack) {
      return
    }

    let newData: IDataStack = { nodes: [], edges: [] }

    switch (stack.type) {
      case 'stackStep':
        const stackData: StackItem = (stack as any).stackData
        Object.keys(stackData.addNodes).forEach(id => {
          this.graph.realDeleteNode(id)
        })
        Object.keys(stackData.removeNodes).forEach(id => {
          const { model, state, rect } = stackData.removeNodes[id]
          const node = this.graph.realAddNode(model)
          if (node) {
            node.updatePosition(rect.x, rect.y)
            Object.keys(state).forEach(key => {
              state[key] ? node.setState(key) : node.clearState(key)
            })
          }
        })
        Object.keys(stackData.beforeNodes).forEach(id => {
          const node = this.graph.findNode(id)
          if (node) {
            const { model, state, rect } = stackData.beforeNodes[id]
            node.updatePosition(rect.x, rect.y)
            node.update(model)
            Object.keys(state).forEach(key => {
              state[key] ? node.setState(key) : node.clearState(key)
            })
          }
        })
        Object.keys(stackData.addEdges).forEach(id => {
          this.graph.deleteEdge(id, false)
        })
        Object.keys(stackData.removeEdges).forEach(id => {
          const { model, state } = stackData.removeEdges[id]
          const edge = this.graph.realAddEdge(model)
          if (edge) {
            Object.keys(state).forEach(key => {
              state[key] ? edge.setState(key) : edge.clearState(key)
            })
          }
        })
        Object.keys(stackData.beforeEdges).forEach(id => {
          const edge = this.graph.findEdge(id)
          if (edge) {
            const { model, state } = stackData.beforeEdges[id]
            edge.update(model)
            Object.keys(state).forEach(key => {
              state[key] ? edge.setState(key) : edge.clearState(key)
            })
          }
        })
        //
        const beforeTransform = stackData.beforeTransform
        beforeTransform &&
          this.graph.translate(-beforeTransform.x, -beforeTransform.y)
        this.graph.pushStack(stack.type, {}, 'redo', {
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
        break
    }

    this.graph.pushStack(stack.type, clone(newData), 'redo')
  }

  public redo() {
    const stack = this.redoStack.pop()
    if (!stack) {
      return
    }

    let newData: IDataStack = { nodes: [], edges: [] }

    switch (stack.type) {
      case 'stackStep':
        const stackData = (stack as any).stackData
        Object.keys(stackData.addNodes).forEach(id => {
          this.graph.deleteNode(id, false)
        })
        Object.keys(stackData.removeNodes).forEach(id => {
          const { model, state, rect } = stackData.removeNodes[id]
          const node = this.graph.realAddNode(model)
          if (node) {
            node.updatePosition(rect.x, rect.y)
            Object.keys(state).forEach(key => {
              state[key] ? node.setState(key) : node.clearState(key)
            })
          }
        })
        Object.keys(stackData.beforeNodes).forEach(id => {
          const node = this.graph.findNode(id)
          if (node) {
            const { model, state, rect } = stackData.beforeNodes[id]
            node.updatePosition(rect.x, rect.y)
            node.update(model)
            Object.keys(state).forEach(key => {
              state[key] ? node.setState(key) : node.clearState(key)
            })
          }
        })
        Object.keys(stackData.addEdges).forEach(id => {
          this.graph.deleteEdge(id, false)
        })
        Object.keys(stackData.removeEdges).forEach(id => {
          const { model, state } = stackData.removeEdges[id]
          const edge = this.graph.realAddEdge(model)
          if (edge) {
            Object.keys(state).forEach(key => {
              state[key] ? edge.setState(key) : edge.clearState(key)
            })
          }
        })
        Object.keys(stackData.beforeEdges).forEach(id => {
          const edge = this.graph.findEdge(id)
          if (edge) {
            const { model, state } = stackData.beforeEdges[id]
            edge.update(model)
            Object.keys(state).forEach(key => {
              state[key] ? edge.setState(key) : edge.clearState(key)
            })
          }
        })
        //
        const beforeTransform = stackData.beforeTransform
        beforeTransform &&
          this.graph.translate(-beforeTransform.x, -beforeTransform.y)
        this.graph.pushStack(stack.type, {}, 'undo', {
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
        break
    }

    this.graph.pushStack(stack.type, clone(newData))
  }
  start = () => {
    if (this.startStackData) {
      return
    }

    const beforeNodeMap = this.graph.getNodes().reduce((map, node) => {
      map[node.id] = {
        model: clone(node.model),
        rect: {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height
        },
        state: NODE_STATE_KEY.reduce((stateMap, key) => {
          stateMap[key] = node.hasState(key)
          return stateMap
        }, {} as Record<string, boolean>)
      }
      return map
    }, {} as Record<string, INodeStackData>)

    const beforeEdgeMap = this.graph.getEdges().reduce((edgeMap, edge) => {
      const model = clone(edge.model)
      const state = EDGE_STATE_KEY.reduce((stateMap, key) => {
        stateMap[key] = edge.hasState(key)
        return stateMap
      }, {} as Record<string, boolean>)
      edgeMap[edge.id] = { model, state }
      return edgeMap
    }, {} as Record<string, IEdgeStackData>)
    const beforeTransform = clone(this.graph.getTranslate())
    this.startStackData = {
      beforeNodes: beforeNodeMap,
      beforeEdges: beforeEdgeMap,
      beforeTransform: beforeTransform
    }
  }
  end() {
    if (!this.startStackData) {
      return
    }
    const afterNodeMap = this.graph.getNodes().reduce((map, node) => {
      map[node.id] = {
        model: clone(node.model),
        rect: {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height
        },
        state: NODE_STATE_KEY.reduce((stateMap, key) => {
          stateMap[key] = node.hasState(key)
          return stateMap
        }, {} as Record<string, boolean>)
      }
      return map
    }, {} as Record<string, INodeStackData>)

    const afterEdgeMap = this.graph.getEdges().reduce((edgeMap, edge) => {
      const model = clone(edge.model)
      const state = EDGE_STATE_KEY.reduce((stateMap, key) => {
        stateMap[key] = edge.hasState(key)
        return stateMap
      }, {} as Record<string, boolean>)
      edgeMap[edge.id] = { model, state }
      return edgeMap
    }, {} as Record<string, IEdgeStackData>)
    const stackData: StackItem = {
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

    const afterTransform = clone(this.graph.getTranslate())
    if (!isEqual(this.startStackData.beforeTransform, afterTransform)) {
      stackData.beforeTransform = this.startStackData.beforeTransform
      stackData.afterTransform = afterTransform
    }

    for (const id in afterNodeMap) {
      if (id in this.startStackData.beforeNodes) {
        const same =
          isEqual(
            this.startStackData.beforeNodes[id].rect,
            afterNodeMap[id].rect
          ) &&
          isEqual(
            this.startStackData.beforeNodes[id].state,
            afterNodeMap[id].state
          )
        if (!same) {
          stackData.beforeNodes[id] = this.startStackData.beforeNodes[id]
          stackData.afterNodes[id] = afterNodeMap[id]
        }
      } else {
        stackData.addNodes[id] = afterNodeMap[id]
      }
      delete this.startStackData.beforeNodes[id]
      delete afterNodeMap[id]
    }
    for (const id in this.startStackData.beforeNodes) {
      stackData.removeNodes[id] = this.startStackData.beforeNodes[id]
      delete this.startStackData.beforeNodes[id]
    }

    for (const id in afterEdgeMap) {
      if (id in this.startStackData.beforeNodes) {
        const same =
          isEqual(
            this.startStackData.beforeEdges[id].model,
            afterEdgeMap[id].model
          ) &&
          isEqual(
            this.startStackData.beforeEdges[id].state,
            afterEdgeMap[id].state
          )
        if (!same) {
          stackData.beforeEdges[id] = this.startStackData.beforeEdges[id]
          stackData.afterEdges[id] = afterEdgeMap[id]
        }
      } else {
        stackData.addEdges[id] = afterEdgeMap[id]
      }
      delete this.startStackData.beforeEdges[id]
      delete afterEdgeMap[id]
    }
    for (const id in this.startStackData.beforeEdges) {
      stackData.removeEdges[id] = this.startStackData.beforeEdges[id]
      delete this.startStackData.beforeEdges[id]
    }

    const hasChange = Object.values(stackData).some(
      value => value && Object.keys(value).length
    )
    hasChange && this.graph.pushStack('stackStep', {}, 'undo', stackData)
    this.startStackData = null
  }
}
