import Graph from './graph'

export default class Immutable {
  private graph: Graph
  private initialStates: {
    nodes: INodeType[],
    edges: IEdgeType[]
  } = {
    nodes: [],
    edges: []
  }
  private states: Array<{
    nodes: INodeType[],
    edges: IEdgeType[]
  }> = []

  private historyIndex = 0

  constructor(graph: Graph) {
    this.graph = graph
    this.initialStates.nodes = JSON.parse(JSON.stringify(graph.nodes))
    this.initialStates.edges = JSON.parse(JSON.stringify(graph.edges))
    console.log(this.initialStates)
  }

  private push() {
    if (this.historyIndex < this.states.length - 1) {
      this.states.length = this.historyIndex + 1
    }
    this.states.push({
      nodes: JSON.parse(JSON.stringify(this.graph.nodes)),
      edges: JSON.parse(JSON.stringify(this.graph.edges))
    })
    this.historyIndex = this.states.length - 1
    console.log(this.states.map(item => item.nodes.map(el => el.nodeName).join('-')))
  }

  addEdge() {
    this.push()
  }

  addNode() {
    this.push()
  }

  undo() {
    console.log(this.historyIndex, 'undo')
    if (this.historyIndex <= 0) {
      this.historyIndex = -1
      return this.initialStates
    }
    return this.states[--this.historyIndex]
  }

  redo() {
    console.log(this.historyIndex, 'redo')
    if (this.historyIndex >= this.states.length - 1) {
      return
    }
    return this.states[++this.historyIndex]
  }

  // restore() {
  //   this.states.length = this.
  //   this.historyIndex = 0
  // }
}
