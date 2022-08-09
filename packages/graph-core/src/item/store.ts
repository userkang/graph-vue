import Graph from '../controller/graph'
import Node from './node'
import Edge from './edge'
import Port from './port'

export const store: Record<
  string,
  {
    graph: Graph
    nodes: Record<string, Node>
    edges: Record<string, Edge>
    ports: Record<string, Port>
  }
> = {}
export const getGraph = (id: string) => store[id].graph
;(window as any).store = store
