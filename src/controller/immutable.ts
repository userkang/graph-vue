import Graph from './graph'

export default class Immutable {
  private graph: Graph

  private initialStates: IDataItem = {
    nodes: [],
    edges: []
  }

  private undoStack: IDataItem[] = []

  private redoStack: IDataItem[] = []

  constructor(graph: Graph) {
    this.graph = graph
    const data = JSON.parse(
      JSON.stringify({
        nodes: graph.nodes,
        edges: graph.edges
      })
    )
    this.initialStates.nodes = data.nodes
    this.initialStates.edges = data.edges
  }

  public push(data: IDataItem) {
    this.undoStack.push(JSON.parse(JSON.stringify(data)))
  }

  undo() {
    const redoItem = this.undoStack.pop()
    if (redoItem) {
      this.redoStack.push(redoItem)
    }
    console.log(JSON.stringify(this.initialStates))
    if (!this.undoStack.length) {
      this.graph.nodes = this.initialStates.nodes
      this.graph.edges = this.initialStates.edges
      return
    }
    this.graph.nodes = this.undoStack[this.undoStack.length - 1].nodes
    this.graph.edges = this.undoStack[this.undoStack.length - 1].edges
  }

  redo() {
    if (!this.redoStack.length) {
      return
    }
    const redoItem = this.redoStack.pop()
    if (redoItem) {
      this.push(redoItem)
    }
    this.graph.nodes = redoItem!.nodes
    this.graph.edges = redoItem!.edges
  }

  // restore() {
  //   this.states.length = this.
  //   this.historyIndex = 0
  // }
}
