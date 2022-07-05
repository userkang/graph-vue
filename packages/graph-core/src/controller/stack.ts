import { IDataStack, IEdgeModel, INodeModel, IStack } from '../types'
import Graph from './graph'
import { clone } from '../util/utils'

const DEEP = 20

export default class Stack {
  private graph: Graph

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

    if (['collapse'].includes(type)) {
      stack.push({ type, stackData } as any)
      console.log('pushStack')
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
      case 'collapse':
        console.log(stack)
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
    }

    this.graph.pushStack(stack.type, clone(newData))
  }
}
