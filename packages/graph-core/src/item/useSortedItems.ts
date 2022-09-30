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

  const moveItem = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    const prevIndex = list.indexOf(item)
    const zIndex = getItemZindex(item)
    if (list[prevIndex + 1] && zIndex >= getItemZindex(list[prevIndex + 1])) {
      console.log('right')
      // 向右移动
      let i = prevIndex + 1
      for (; i < list.length; i++) {
        const rightZindex = getItemZindex(list[i])
        if (zIndex < rightZindex) {
          break
        } else if (zIndex === rightZindex && item instanceof Edge) {
          break
        }
      }
      list.splice(i, 0, item)
      list.splice(prevIndex, 1)
    } else if (
      list[prevIndex - 1] &&
      zIndex <= getItemZindex(list[prevIndex - 1])
    ) {
      // 向左移动
      console.log('left')
      let i = prevIndex - 1
      for (; i >= 0; i--) {
        const leftZindex = getItemZindex(list[i])
        if (zIndex > leftZindex) {
          break
        } else if (zIndex === leftZindex && item instanceof Node) {
          break
        }
      }
      list.splice(prevIndex, 1)
      list.splice(i + 1, 0, item)
    }
  }

  const onZIndexChange = (item: Item, key: string) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    if (key !== 'zIndex') {
      return
    }
    moveItem(item)
  }

  const add = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    item instanceof Node ? list.push(item) : list.unshift(item)
    moveItem(item)
    item.on('change', onZIndexChange)
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
