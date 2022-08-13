import Node from '../item/node'
import Edge from '../item/edge'
import Port from '../item/port'
import EventEmitter from '../util/event-emitter'
import { itemId, Item, itemClass } from '../types/type'
import { isKeyof } from '../util/utils'
import { IDataModel } from '../types'

export default class Store extends EventEmitter {
  readonly itemMap: Record<string, Item> = {}
  constructor() {
    super()
  }

  insertItem(item: Item) {
    this.itemMap[item.id] = item
    this.emit('insertItem', item)
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

  findEdgeByState(state: string): Edge[] {
    return this.getEdges().filter(edge => edge.hasState(state))
  }

  findNode(id: itemId) {
    return this.find(id, Node)
  }

  findNodeByPort(portId: itemId) {
    return this.getNodes().find(node =>
      node.ports.find(port => port.id === portId)
    )
  }

  findNodeByState(state: string) {
    return this.getNodes().filter(item => item.hasState(state))
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
    this.emit('deleteItem', id)
    return item
  }
}
