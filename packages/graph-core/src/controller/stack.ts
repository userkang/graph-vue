import { IStack, IStackData } from '../types'
import Graph from './graph'
import { clone } from '../util/utils'

const DEEP = 10

export default class Stack {
  private graph: Graph

  public undoStack: IStack[] = []

  public redoStack: IStack[] = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  public pushStack(type: string, data: IStackData[], stackType = 'undo') {
    let stack = []
    if (stackType === 'undo') {
      stack = this.undoStack
    } else {
      stack = this.redoStack
    }

    stack.push({ type, data: clone(data) })
    if (stack.length > DEEP) {
      stack = stack.slice(-DEEP)
    }
  }

  public undo() {
    const redoItem = this.undoStack.pop()

    if (!redoItem) {
      return
    }

    // this.graph.pushStack(redoItem.type, redoItem.data, 'redo')

    switch (redoItem.type) {
      case 'addNode':
        redoItem.data.forEach(item => {
          this.graph.deleteNode(item.id, false)
        })
        break
      case 'updateNodePosition':
        redoItem.data.forEach(item => {
          this.graph.getNodes().forEach(node => {
            if (item.id === node.id) {
              node.updatePosition(item.x as number, item.y as number)
            }
          })
        })
        break
    }
  }

  public redo() {
    const undoItem = this.redoStack.pop()
    if (!undoItem) {
      return
    }

    // this.pushStack()
  }
}
