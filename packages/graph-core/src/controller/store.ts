import Node from '../item/node'
import Edge from '../item/edge'
import Port from '../item/port'
import EventEmitter from '../util/event-emitter'
import { itemId } from '../types/type'
import { isKeyof } from '../util/utils'
import { IDataModel } from '../types'

type Item = Node | Edge | Port
export default class Store extends EventEmitter {
  readonly itemMap: Record<string, Item> = {}
  constructor() {
    super()
  }

  insertItem(item: Item) {
    this.itemMap[item.id] = item
    this.emit('insertItem', item)
  }

  deleteItem(id: itemId) {
    if (!(id in this.itemMap)) {
      return
    }
    delete this.itemMap[id]
    this.emit('deleteItem', id)
  }

  find(id: itemId): Item | void
  find<T extends Item>(
    id: itemId,
    itemClass: new (...args: any[]) => T
  ): T | void
  find<T extends Item>(
    id: itemId,
    itemClass?: new (...args: any[]) => T
  ): Item | void {
    const item = this.itemMap[id]
    if (itemClass) {
      return item instanceof itemClass ? item : void 0
    } else {
      return item
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

  getNodes() {
    return Object.values(this.getItemMap(Node))
  }

  getEdges() {
    return Object.values(this.getItemMap(Edge))
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

  getDataModel(): IDataModel {
    const nodes = this.getNodes().map(node => node.model)
    const edges = this.getEdges().map(edge => edge.model)
    return { nodes, edges }
  }

  getTreeDataModel() {
    return this.getNodes()[0].model
  }

  clear() {
    const itemMap = this.itemMap
    for (const key in itemMap) {
      if (Object.prototype.hasOwnProperty.call(itemMap, key)) {
        delete itemMap[key]
      }
    }
    this.emit('clear')
  }
}
