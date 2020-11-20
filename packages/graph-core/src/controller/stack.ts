import { IDataStack, IStack } from '../types'
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
    console.log(clone(data))
    stack.push({ type, data: clone(data) })
    if (stack.length > DEEP) {
      stack = stack.slice(-DEEP)
    }
  }

  public undo() {
    const stack = this.undoStack.pop()
    if (!stack) {
      return
    }

    const newData: IDataStack = { nodes: [], edges: [] }

    switch (stack.type) {
      case 'addNode':
        stack.data.nodes.forEach(item => {
          this.graph.deleteNode(item.id, false)
        })
        break
      case 'deleteNode':
        stack.data.nodes.forEach(item => {
          this.graph.addNode(item.model, false)
        })
        stack.data.edges.forEach(item => {
          this.graph.addEdge(item.model, false)
        })
        break
      case 'updateNodePosition':
        stack.data.nodes.forEach(item => {
          this.graph.getNodes().forEach(node => {
            if (item.id === node.id) {
              // 保存位置改变前的位置
              newData.nodes.push({ id: item.id, model: { ...node.model } })

              const { x, y } = item.model
              node.updatePosition(x as number, y as number)
            }
          })
        })
        const nodesModel = stack.data.nodes.map(item => item.model)
        this.graph.emit('afterdragnode', nodesModel)
        break
    }

    this.graph.pushStack(stack.type, newData, 'redo')
  }

  public redo() {
    const stack = this.redoStack.pop()
    if (!stack) {
      return
    }

    const newData: IDataStack = { nodes: [], edges: [] }

    switch (stack.type) {
      case 'addNode':
        stack.data.nodes.forEach(item => {
          this.graph.addNode(item.model, false)
        })
        break
      case 'deleteNode':
        stack.data.nodes.forEach(item => {
          this.graph.deleteNode(item.id, false)
        })
        stack.data.edges.forEach(item => {
          this.graph.deleteEdge(item.id, false)
        })
        break
      case 'updateNodePosition':
        stack.data.nodes.forEach(item => {
          this.graph.getNodes().forEach(node => {
            if (item.id === node.id) {
              // 保存位置改变前的位置
              newData.nodes.push({ id: item.id, model: { ...node.model } })

              const { x, y } = clone(item.model)
              node.updatePosition(x as number, y as number)
            }
          })
        })
        const nodesModel = stack.data.nodes.map(item => item.model)
        this.graph.emit('afterdragnode', nodesModel)
        break
    }

    this.graph.pushStack(stack.type, newData)
  }
}
