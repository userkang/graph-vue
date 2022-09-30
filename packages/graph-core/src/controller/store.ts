import Node from '../item/node'
import Edge from '../item/edge'
import Port from '../item/port'
import EventEmitter from '../util/event-emitter'
import { itemId, Item, itemClass, valuesType } from '../types/type'
import { isKeyof } from '../util/utils'
import { IDataModel, IEdge, INode } from '../types'
import { ManyToOne } from '../util/many-to-one'
import edgeView from '../view/edge'
import nodeView from '../view/node'
import { useSortedItems } from '../item/useSortedItems'

const EVENT_TYPES = ['add', 'remove'] as const

export default class Store extends EventEmitter<
  valuesType<typeof EVENT_TYPES>,
  false
> {
  private sorted: ReturnType<typeof useSortedItems>
  items: ReturnType<typeof useSortedItems>['items']
  itemMap: Record<string, Item> = {}
  node_ports = new ManyToOne<Port, Node>()
  node_nodes = new ManyToOne<Node, Node>()
  fromPort_edges = new ManyToOne<Edge, Port>()
  toPort_edges = new ManyToOne<Edge, Port>()
  viewMap = new Map<Item, nodeView | edgeView>()
  constructor() {
    super()
    this.sorted = useSortedItems()
    this.items = this.sorted.items
    this.reset()
  }

  private getItemMap(): Record<string, Item>
  private getItemMap<T extends Item>(
    itemClass: new (...args: any[]) => T
  ): Record<string, T>
  private getItemMap<T extends Item>(itemClass?: new (...args: any[]) => T) {
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

  add(item: Item) {
    if (this.itemMap[item.id] === item) {
      return
    }
    const prev = this.itemMap[item.id]
    this.itemMap[item.id] = item
    if (!prev) {
      this.sorted.add(item)
    } else if (prev !== item) {
      this.sorted.remove(prev)
      this.sorted.add(item)
    }

    this.emit('add', item, prev)
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

  getEdges = () => {
    return Object.values(this.getEdgeMap())
  }

  getPorts() {
    return Object.values(this.getPortMap())
  }

  findPort = (id: itemId) => {
    return this.find(id, Port)
  }

  findEdge = (id: itemId) => {
    return this.find(id, Edge)
  }

  findNode = (id: itemId) => {
    return this.find(id, Node)
  }

  findEdgeByState = (state: string): IEdge[] => {
    return this.getEdges().filter(item => item.hasState(state))
  }

  findNodeByPort = (portId: itemId) => {
    return this.getNodes().find(node =>
      node.ports.find(port => port.id === portId)
    )
  }

  getDataModel = (): IDataModel => {
    const nodes = this.getNodes().map(node => node.model)
    const edges = this.getEdges().map(edge => edge.model)
    return { nodes, edges }
  }

  getTreeDataModel = () => {
    return this.getNodes()[0].model
  }

  remove(id: itemId): Item | undefined
  remove<T extends Item>(id: itemId, itemClass: itemClass<T>): T | undefined
  remove<T extends Item>(id: itemId, itemClass?: itemClass<T>): T | undefined {
    const item = this.find(id, itemClass)
    if (!item) {
      return
    }
    delete this.itemMap[id]
    this.sorted.remove(item)

    this.emit('remove', item)
    return item
  }

  reset() {
    this.itemMap = {}
    this.sorted.clean()
    this.node_ports = new ManyToOne<Port, Node>()
    this.node_nodes = new ManyToOne<Node, Node>()
    this.fromPort_edges = new ManyToOne<Edge, Port>()
    this.toPort_edges = new ManyToOne<Edge, Port>()
    this.viewMap = new Map<Item, nodeView | edgeView>()
  }
}
