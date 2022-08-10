import Graph from '../controller/graph'
import Node from './node'
import Edge from './edge'
import Port from './port'

type Item = Node | Edge | Port

const state: {
  graph: Graph
  itemMap: Record<string, Item>
} = {
  graph: null as any,
  itemMap: {}
}

const mutations = {
  insertItem: (item: Item) => {
    state.itemMap[item.id] = item
  },
  removeItem: (itemId: string) => {
    delete state.itemMap[itemId]
  }
} as const

function itemMap(): Record<string, Item>
function itemMap<T extends Item>(
  itemClass: new (...args: any[]) => T
): Record<string, T>
function itemMap<T extends Item>(itemClass?: new (...args: any[]) => T) {
  if (itemClass) {
    const res: Record<string, InstanceType<typeof itemClass>> = {}
    Object.values(state.itemMap).forEach(item => {
      if (item instanceof itemClass) {
        res[item.id] = item
      }
    })
    return res
  } else {
    return state.itemMap
  }
}

const getters = {
  graph: () => state.graph,
  itemMap,
  nodeMap: () => itemMap(Node),
  edgeMap: () => itemMap(Edge),
  portMap: () => itemMap(Port)
} as const

const actions = {} as const

export const useStore = () => {
  return {state, mutations, getters, actions}
}