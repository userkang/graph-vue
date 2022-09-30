import Node from './node'
import Edge from './edge'
import { Item } from '../types/type'

const getItemZindex = (item: Node | Edge) =>
  item instanceof Node
    ? item.zIndex
    : Math.max(
        item.zIndex || 0,
        item.fromNode.zIndex || 0,
        item.toNode.zIndex || 0
      )

export const useSortedItems = () => {
  const list: Array<Node | Edge> = []

  const onZIndexChange = (target: Item, key: string, prevValue: unknown) => {
    if (!(target instanceof Node) && !(target instanceof Edge)) {
      return
    }
    if (key !== 'zIndex') {
      return
    }
    if (typeof prevValue !== 'number' && typeof prevValue !== 'undefined') {
      return
    }
    const zIndex = getItemZindex(target)
  }

  const add = (item: Item) => {
    if (item instanceof Node) {
      const zIndex = item.zIndex
      let i = list.length - 1
      for (; i >= 0; i--) {
        if (zIndex >= list[i].zIndex) {
          break
        }
      }
      list.splice(i + 1, 0, item)
    } else if (item instanceof Edge) {
      const zIndex = getItemZindex(item)
      let i = list.length - 1
      for (; i >= 0; i--) {
        if (zIndex > list[i].zIndex) {
          break
        }
      }
      list.splice(i + 1, 0, item)
    }
    item.on('change', onZIndexChange)
  }

  const change = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    const index = list.indexOf(item)
  }

  const remove = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    item.off('change', onZIndexChange)
    const index = list.indexOf(item)
    list.splice(index, 1)
  }

  const clean = () => {
    list.forEach(item => remove(item))
  }

  return {
    items: list,
    add,
    remove,
    clean
  }
}
