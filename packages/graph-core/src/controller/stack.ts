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

  public pushStack(type: string, data: IDataStack, stackType = 'undo') {
    let stack = []
    if (stackType === 'undo') {
      stack = this.undoStack
    } else {
      stack = this.redoStack
    }

    stack.push({ type, data: clone(data) })

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
        stack.data.nodes.forEach(item => {
          this.graph.deleteNode(item.id, false)
        })
        break
      case 'deleteNode':
        newData = stack.data
        stack.data.nodes.forEach(item => {
          this.graph.addNode(item, false)
        })
        stack.data.edges.forEach(item => {
          this.graph.addEdge(item, false)
        })
        break
      case 'addEdge':
        newData = stack.data
        stack.data.edges.forEach(item => {
          this.graph.deleteEdge(item.id, false)
        })
        break
      case 'deleteEdge':
        newData = stack.data
        stack.data.edges.forEach(item => {
          this.graph.addEdge(item, false)
        })
        break
      case 'updateNodePosition':
        stack.data.nodes.forEach(item => {
          this.graph.getNodes().forEach(node => {
            if (String(item.id) === node.id) {
              // 保存位置改变前的位置
              newData.nodes.push({ ...node.model })
              const { x, y } = item
              node.updatePosition(x as number, y as number)
            }
          })
        })
        this.graph.emit('afterdragnode', clone(stack.data.nodes))
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
        stack.data.nodes.forEach(item => {
          this.graph.addNode(item, false)
        })
        break
      case 'deleteNode':
        newData = stack.data
        stack.data.nodes.forEach(item => {
          this.graph.deleteNode(item.id, false)
        })
        stack.data.edges.forEach(item => {
          this.graph.deleteEdge(item.id, false)
        })
        break
      case 'addEdge':
        newData = stack.data
        stack.data.edges.forEach(item => {
          this.graph.addEdge(item, false)
        })
        break
      case 'deleteEdge':
        newData = stack.data
        stack.data.edges.forEach(item => {
          this.graph.deleteEdge(item.id, false)
        })
        break
      case 'updateNodePosition':
        stack.data.nodes.forEach(item => {
          this.graph.getNodes().forEach(node => {
            if (String(item.id) === node.id) {
              // 保存位置改变前的位置
              newData.nodes.push({ ...node.model })
              const { x, y } = item
              node.updatePosition(x as number, y as number)
            }
          })
        })

        this.graph.emit('afterdragnode', clone(stack.data.nodes))
        break
    }

    this.graph.pushStack(stack.type, clone(newData))
  }
}
