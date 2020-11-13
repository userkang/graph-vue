import Graph from './graph'

export default class Stack {
  private graph: Graph

  private initialStates: any = {
    nodes: [],
    edges: []
  }

  private undoStack: any[] = []

  private redoStack: any[] = []

  constructor(graph: Graph) {
    this.graph = graph
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()
    const data = JSON.parse(
      JSON.stringify({
        nodes,
        edges
      })
    )
    this.initialStates.nodes = data.nodes
    this.initialStates.edges = data.edges
  }

  public push(data: any) {
    this.undoStack.push(JSON.parse(JSON.stringify(data)))
  }

  undo() {
    const redoItem = this.undoStack.pop()
    if (redoItem) {
      this.redoStack.push(redoItem)
    }

    if (!this.undoStack.length) {
      this.graph.set('nodes', this.initialStates.nodes)
      this.graph.set('edges', this.initialStates.edges)
      return
    }
    this.graph.set('nodes', this.undoStack[this.undoStack.length - 1].nodes)
    this.graph.set('edges', this.undoStack[this.undoStack.length - 1].edges)
  }

  redo() {
    if (!this.redoStack.length) {
      return
    }
    const redoItem = this.redoStack.pop()
    if (redoItem) {
      this.push(redoItem)
    }
    this.graph.set('nodes', redoItem!.nodes)
    this.graph.set('edges', redoItem!.edges)
  }
}
