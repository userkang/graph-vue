import Graph from '../controller/graph'

abstract class Base {
  graph: Graph
  eventQueue = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  addEvent(type: string, callback: (...args: any[]) => void) {
    const bindFunc = callback.bind(this)
    this.eventQueue.push({ type, bindFunc })
    this.graph.on(type, bindFunc)
  }

  destory() {
    this.eventQueue.forEach(item => {
      this.graph.off(item.type, item.callback)
    })
  }
}

export default Base
