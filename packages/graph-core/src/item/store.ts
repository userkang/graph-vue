import Graph from '../controller/graph'
import Node from './node'
import Edge from './edge'
import Port from './port'

type Item = Node | Edge | Port

const state: Record<
  string,
  {
    graph: Graph
    itemMap: Record<string, Item>
  }
> = {}

const mutations = {
  insertGraph: (graphId: string, graph: Graph) => {
    state[graphId] = {
      graph: graph,
      itemMap: {}
    }
  },
  removeGraph: (graphId: string) => {
    delete state[graphId]
  },
  insertItem: (graphId: string, item: Item) => {
    state[graphId].itemMap[item.id] = item
  },
  removeItem: (graphId: string, itemId: string) => {
    delete state[graphId].itemMap[itemId]
  }
}

function itemMap(graphId: string): Record<string, Item>
function itemMap<T extends Node | Edge | Port>(
  graphId: string,
  itemClass: new (...args: any[]) => T
): Record<string, T>
function itemMap<T extends Node | Edge | Port>(
  graphId: string,
  itemClass?: new (...args: any[]) => T
) {
  if (itemClass) {
    const res: Record<string, InstanceType<typeof itemClass>> = {}
    Object.values(state[graphId].itemMap).forEach(item => {
      if (item instanceof itemClass) {
        res[item.id] = item
      }
    })
    return res
  } else {
    return state[graphId].itemMap
  }
}

const getters = {
  graph: (graphId: string) => state[graphId].graph,
  itemMap,
  nodeMap: (graphId: string) => itemMap(graphId, Node),
  edgeMap: (graphId: string) => itemMap(graphId, Edge),
  portMap: (graphId: string) => itemMap(graphId, Port)
}

const actions = {}

export const store = { state, mutations, getters, actions }
