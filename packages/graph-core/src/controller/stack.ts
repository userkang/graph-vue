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
  withStack = <T extends (...args: any[]) => any>(
    callback: T
  ): ((...args: Parameters<T>) => ReturnType<T>) => {
    const graph = this.graph
    return (...args: any[]) => {
      if (this.stacking) {
        return
      }
      this.stacking = true

      const beforeNodeMap = graph.getNodes().reduce((map, node) => {
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

      const beforeEdgeMap = graph.getEdges().reduce((edgeMap, edge) => {
        const model = clone(edge.model)
        const state = EDGE_STATE_KEY.reduce((stateMap, key) => {
          stateMap[key] = edge.hasState(key)
          return stateMap
        }, {} as Record<string, boolean>)
        edgeMap[edge.id] = { model, state }
        return edgeMap
      }, {} as Record<string, IEdgeStackData>)
      const beforeTransform = clone(graph.getTranslate())
      const res = callback(...args)

      const afterNodeMap = graph.getNodes().reduce((map, node) => {
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

      const afterEdgeMap = graph.getEdges().reduce((edgeMap, edge) => {
        const model = clone(edge.model)
        const state = EDGE_STATE_KEY.reduce((stateMap, key) => {
          stateMap[key] = edge.hasState(key)
          return stateMap
        }, {} as Record<string, boolean>)
        edgeMap[edge.id] = { model, state }
        return edgeMap
      }, {} as Record<string, IEdgeStackData>)

      // nodemap, edgemap, transform

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

      const afterTransform = clone(graph.getTranslate())
      if (!isEqual(beforeTransform, afterTransform)) {
        stackData.beforeTransform = beforeTransform
        stackData.afterTransform = afterTransform
      }

      for (const id in afterNodeMap) {
        if (id in beforeNodeMap) {
          const same =
            isEqual(beforeNodeMap[id].rect, afterNodeMap[id].rect) &&
            isEqual(beforeNodeMap[id].state, afterNodeMap[id].state)
            console.log(beforeNodeMap[id].rect.x, afterNodeMap[id].rect.x)
          if (!same) {
            stackData.beforeNodes[id] = beforeNodeMap[id]
            stackData.afterNodes[id] = afterNodeMap[id]
          }
        } else {
          stackData.addNodes[id] = afterNodeMap[id]
        }
        delete beforeNodeMap[id]
        delete afterNodeMap[id]
      }
      for (const id in beforeNodeMap) {
        stackData.removeNodes[id] = beforeNodeMap[id]
        delete beforeNodeMap[id]
      }

      for (const id in afterEdgeMap) {
        if (id in beforeEdgeMap) {
          const same =
            isEqual(beforeEdgeMap[id].model, afterEdgeMap[id].model) &&
            isEqual(beforeEdgeMap[id].state, afterEdgeMap[id].state)
          if (!same) {
            stackData.beforeEdges[id] = beforeEdgeMap[id]
            stackData.afterEdges[id] = afterEdgeMap[id]
          }
        } else {
          stackData.addEdges[id] = afterEdgeMap[id]
        }
        delete beforeEdgeMap[id]
        delete afterEdgeMap[id]
      }
      for (const id in beforeEdgeMap) {
        stackData.removeEdges[id] = beforeEdgeMap[id]
        delete beforeEdgeMap[id]
      }
   
      const hasChange = Object.values(stackData).some(
        value => value && Object.keys(value).length
      )
      console.log(hasChange)
      hasChange && graph.pushStack('stackStep', {}, 'undo', stackData)
      this.stacking = false
      return res
    }
  }
}
