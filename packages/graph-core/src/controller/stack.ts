import { IDataStack, IEdgeModel, INode, INodeModel, IStack } from '../types'
import Graph from './graph'
import { clone } from '../util/utils'

const DEEP = 20
const NODE_MODEL_KEY = ['x', 'y', 'width', 'height']
const NODE_STATE_KEY = ['locaked', 'hide']
const EDGE_MODEL_KEY = ['fromNodeId', 'toNodeId', 'fromPortId', 'toPortId']
const EDGE_STATE_KEY = ['linked']

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
    stackData?: any
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
      case 'addNode':
        newData = stack.data
        if (stack.data.nodes) {
          stack.data.nodes.forEach(item => {
            this.graph.deleteNode(item.id as string, false)
          })
        }
        break
      case 'deleteNode':
        newData = stack.data
        if (stack.data.nodes) {
          stack.data.nodes.forEach(item => {
            this.graph.addNode(item, false)
          })
        }
        if (stack.data.edges) {
          stack.data.edges.forEach(item => {
            this.graph.addEdge(item, false)
          })
        }
        break
      case 'addEdge':
        newData = stack.data
        if (stack.data.edges) {
          stack.data.edges.forEach(item => {
            this.graph.deleteEdge(item.id as string, false)
          })
        }
        break
      case 'deleteEdge':
        newData = stack.data
        if (stack.data.edges) {
          stack.data.edges.forEach(item => {
            this.graph.addEdge(item, false)
          })
        }
        break
      case 'updateNodePosition':
        if (stack.data.nodes) {
          stack.data.nodes.forEach(item => {
            this.graph.getNodes().forEach(node => {
              if (String(item.id) === node.id) {
                // 保存位置改变前的位置
                if (newData.nodes) {
                  newData.nodes!.push({ ...node.model })
                }
                const { x, y } = item
                node.updatePosition(x as number, y as number)
              }
            })
          })
        }
        const nodes = stack.data.nodes?.map((item: INodeModel) =>
          this.graph.findNode(item.id as string)
        )
        this.graph.emit('node:moved', nodes)
        break
      case 'stackStep':
        const stackData = (stack as any).stackData
        Object.keys(stackData.addNodes).forEach(id => {
          this.graph.deleteNode(id, false)
        })
        Object.keys(stackData.removeNodes).forEach(id => {
          const { model, state, rect } = stackData.removeNodes[id]
          const node = this.graph.addNode(model, false)
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
          const edge = this.graph.addEdge(model, false)
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
        this.graph.translate(-beforeTransform.x, -beforeTransform.y)
        this.graph.pushStack(stack.type, clone(newData), 'redo', {
          addNodes: stackData.removeNodes,
          removeNodes: stackData.addNodes,
          beforeNodes: stackData.afterNodes,
          afterNodes: stackData.beforeNodes,
          beforeTransform: stackData.afterTransform,
          afterTransform: stackData.beforeTransform
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
      case 'addNode':
        newData = stack.data
        if (stack.data.nodes) {
          stack.data.nodes.forEach(item => {
            this.graph.addNode(item, false)
          })
        }
        break
      case 'deleteNode':
        newData = stack.data
        if (stack.data.edges) {
          stack.data.edges.forEach(item => {
            this.graph.deleteEdge(item.id as string, false)
          })
        }

        if (stack.data.nodes) {
          stack.data.nodes.forEach(item => {
            this.graph.deleteNode(item.id as string, false)
          })
        }
        break
      case 'addEdge':
        newData = stack.data
        if (stack.data.edges) {
          stack.data.edges.forEach(item => {
            this.graph.addEdge(item, false)
          })
        }
        break
      case 'deleteEdge':
        newData = stack.data
        if (stack.data.edges) {
          stack.data.edges.forEach(item => {
            this.graph.deleteEdge(item.id as string, false)
          })
        }
        break
      case 'updateNodePosition':
        if (stack.data.nodes) {
          stack.data.nodes.forEach(item => {
            this.graph.getNodes().forEach(node => {
              if (String(item.id) === node.id) {
                // 保存位置改变前的位置
                if (newData.nodes) {
                  newData.nodes.push({ ...node.model })
                }
                const { x, y } = item
                node.updatePosition(x as number, y as number)
              }
            })
          })
        }

        const nodes = stack.data.nodes?.map((item: INodeModel) =>
          this.graph.findNode(item.id as string)
        )
        this.graph.emit('node:moved', nodes)
        break
      case 'stackStep':
        const stackData = (stack as any).stackData
        Object.keys(stackData.addNodes).forEach(id => {
          this.graph.deleteNode(id, false)
        })
        Object.keys(stackData.removeNodes).forEach(id => {
          const { model, state, rect } = stackData.removeNodes[id]
          const node = this.graph.addNode(model, false)
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
          const edge = this.graph.addEdge(model, false)
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
        this.graph.translate(-beforeTransform.x, -beforeTransform.y)
        this.graph.pushStack(stack.type, clone(newData), 'redo', {
          addNodes: stackData.removeNodes,
          removeNodes: stackData.addNodes,
          beforeNodes: stackData.afterNodes,
          afterNodes: stackData.beforeNodes,
          beforeTransform: stackData.afterTransform,
          afterTransform: stackData.beforeTransform
        })
        return
        break
    }

    this.graph.pushStack(stack.type, clone(newData))
  }
  withStack = (callback: (...args: any[]) => any) => {
    const graph = this.graph
    return async (...args: any[]) => {
      if (this.stacking) {
        return
      }
      this.stacking = true
      const beforeNodeMap: Record<number, any> = {}
      graph.getNodes().forEach(node => {
        beforeNodeMap[node.id] = {
          model: clone(node.model),
          rect: { x: node.x, y: node.y },
          state: NODE_STATE_KEY.reduce((stateMap, key) => {
            stateMap[key] = node.hasState(key)
            return stateMap
          }, {} as Record<string, boolean>)
        }
      })
      const beforeEdgeMap = graph.getEdges().reduce((edgeMap, edge) => {
        const model = clone(edge.model)
        const state = EDGE_STATE_KEY.reduce((stateMap, key) => {
          stateMap[key] = edge.hasState(key)
          return stateMap
        }, {} as Record<string, boolean>)
        edgeMap[edge.id] = { model, state }
        return edgeMap
      }, {} as Record<string, any>)
      const beforeTransform = clone((graph as any).viewController.transform)
      const res = await callback(...args)
      const afterNodeMap: Record<number, any> = {}
      graph.getNodes().forEach(node => {
        afterNodeMap[node.id] = {
          model: clone(node.model),
          rect: { x: node.x, y: node.y },
          state: NODE_STATE_KEY.reduce((stateMap, key) => {
            stateMap[key] = node.hasState(key)
            return stateMap
          }, {} as Record<string, boolean>)
        }
      })
      const afterEdgeMap = graph.getEdges().reduce((edgeMap, edge) => {
        const model = clone(edge.model)
        const state = EDGE_STATE_KEY.reduce((stateMap, key) => {
          stateMap[key] = edge.hasState(key)
          return stateMap
        }, {} as Record<string, boolean>)
        edgeMap[edge.id] = { model, state }
        return edgeMap
      }, {} as Record<string, any>)

      // nodemap, edgemap, transform

      const stackData = {
        addNodes: {} as Record<string, any>,
        removeNodes: {} as Record<string, any>,
        beforeNodes: {} as Record<string, any>,
        afterNodes: {} as Record<string, any>,
        beforeTransform,
        afterTransform: clone((graph as any).viewController.transform),
        addEdges: {} as Record<string, any>,
        removeEdges: {} as Record<string, any>,
        beforeEdges: {} as Record<string, any>,
        afterEdges: {} as Record<string, any>
      }
      Object.keys(afterNodeMap).forEach(id => {
        if (id in beforeNodeMap) {
          stackData.afterNodes[id] = afterNodeMap[Number(id)]
        } else {
          stackData.addNodes[id] = afterNodeMap[Number(id)]
        }
      })
      Object.keys(beforeNodeMap).forEach(id => {
        if (id in afterNodeMap) {
          stackData.beforeNodes[id] = beforeNodeMap[Number(id)]
        } else {
          stackData.removeNodes[id] = beforeNodeMap[Number(id)]
        }
      })
      Object.keys(afterEdgeMap).forEach(id => {
        if (id in beforeEdgeMap) {
          stackData.afterEdges[id] = afterEdgeMap[id]
        } else {
          stackData.addEdges[id] = afterEdgeMap[id]
        }
      })
      Object.keys(beforeEdgeMap).forEach(id => {
        if (id in afterEdgeMap) {
          stackData.beforeEdges[id] = beforeEdgeMap[id]
        } else {
          stackData.removeEdges[id] = beforeEdgeMap[id]
        }
      })
      graph.pushStack('stackStep', {}, 'undo', stackData)
      this.stacking = false
      return res
    }
  }
}
