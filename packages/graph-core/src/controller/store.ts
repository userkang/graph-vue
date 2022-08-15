import Node from '../item/node'
import Edge from '../item/edge'
import Port from '../item/port'
import EventEmitter from '../util/event-emitter'
import { itemId, Item, itemClass, valuesType } from '../types/type'
import { isKeyof } from '../util/utils'
import { IDataModel, IEdge, IPort } from '../types'
import { ManyToOne } from '../types/many-to-one'

const EVENT_TYPES = [] as const

export default class Store extends EventEmitter<
  valuesType<typeof EVENT_TYPES>,
  false
> {
  readonly itemMap: Record<string, Item> = {}
  readonly outPorts_node = new ManyToOne<Port, Node>()
  readonly inPorts_node = new ManyToOne<Port, Node>()
  readonly edge_fromPorts = new ManyToOne<Edge, Port>()
  readonly edge_toPorts = new ManyToOne<Edge, Port>()
  constructor() {
    super()
  }

  insertItem(item: Item) {
    this.itemMap[item.id] = item
  }

  find(id: itemId): Item | undefined
  find<T extends Item>(id: itemId, itemClass?: itemClass<T>): T | undefined
  find<T extends Item>(id: itemId, itemClass?: itemClass<T>): T | undefined {
    const item = this.itemMap[id]

    if (itemClass) {
      return item instanceof itemClass ? item : void 0
    } else {
      return item as any
    }
  }

  where(search: Record<string, any>) {
    let items = Object.values(this.itemMap)
    for (const key in search) {
      items = items.filter(
        item => isKeyof(key, item) && item[key] === search[key]
      )
    }
    return items
  }

  findBy(search: Record<string, any>) {
    const findKey = Object.keys(search)[0]
    const findVal = search[findKey]
    delete search[findKey]
    return this.where(search).find(item => {
      return isKeyof(findKey, item) && item[findKey] === findVal
    })
  }

  getItemMap(): Record<string, Item>
  getItemMap<T extends Item>(
    itemClass: new (...args: any[]) => T
  ): Record<string, T>
  getItemMap<T extends Item>(itemClass?: new (...args: any[]) => T) {
    if (itemClass) {
      const res: Record<string, InstanceType<typeof itemClass>> = {}
      Object.values(this.itemMap).forEach(item => {
        if (item instanceof itemClass) {
          res[item.id] = item
        }
      })
      return res
    } else {
      return this.itemMap
    }
  }

  getNodeMap() {
    return this.getItemMap(Node)
  }

  getEdgeMap() {
    return this.getItemMap(Edge)
  }

  getPortMap() {
    return this.getItemMap(Port)
  }

  getNodes() {
    return Object.values(this.getNodeMap())
  }

  getEdges() {
    return Object.values(this.getEdgeMap())
  }

  getPorts() {
    return Object.values(this.getPortMap())
  }

  findPort(id: itemId) {
    return this.find(id, Port)
  }

  findEdge(id: itemId) {
    return this.find(id, Edge)
  }

  findNode(id: itemId) {
    return this.find(id, Node)
  }

  findEdgeByState(state: string): IEdge[] {
    return this.getEdges().filter(item => item.hasState(state))
  }

  findNodeByPort(portId: itemId) {
    return this.getNodes().find(node =>
      node.ports.find(port => port.id === portId)
    )
  }

  getDataModel(): IDataModel {
    const nodes = this.getNodes().map(node => node.model)
    const edges = this.getEdges().map(edge => edge.model)
    return { nodes, edges }
  }

  getTreeDataModel() {
    return this.getNodes()[0].model
  }

  deleteItem(id: itemId): Item | undefined
  deleteItem<T extends Item>(id: itemId, itemClass: itemClass<T>): T | undefined
  deleteItem<T extends Item>(
    id: itemId,
    itemClass?: itemClass<T>
  ): T | undefined {
    const item = this.find(id, itemClass)
    if (!item) {
      return
    }
    delete this.itemMap[id]
    return item
  }
}
