import Node from './node'
import Edge from './edge'
import { Item } from '../types/type'

const getItemZindex = (item?: Node | Edge) => (item ? item.zIndex || 0 : 0)

export const useSortedItems = () => {
  const list: Array<Node | Edge> = []

  const setItemIndex = (item: Node | Edge, from: number, to: number) => {
    list.splice(to, 0, item)
    from > 0 && list.splice(from, 1)
  }

  const moveItem = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    const prevIndex = list.indexOf(item)
    const zIndex = item.zIndex || 0

    if (list[prevIndex + 1] && zIndex >= getItemZindex(list[prevIndex + 1])) {
      // 向右移动
      let i = prevIndex + 1
      for (; i < list.length; i++) {
        const rightZindex = getItemZindex(list[i])
        if (
          zIndex < rightZindex ||
          (zIndex === rightZindex && item instanceof Edge)
        ) {
          break
        }
      }
      setItemIndex(item, prevIndex, i)
    } else if (
      list[prevIndex - 1] &&
      zIndex <= getItemZindex(list[prevIndex - 1])
    ) {
      // 向左移动
      let i = prevIndex - 1
      for (; i >= 0; i--) {
        const leftZindex = getItemZindex(list[i])
        if (
          zIndex > leftZindex ||
          (zIndex === leftZindex && item instanceof Node)
        ) {
          break
        }
      }
      setItemIndex(item, prevIndex, i)
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
    list.push(item)
    moveItem(item)
    item.on('change', onZIndexChange)
  }

  const remove = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    item.off('change', onZIndexChange)
    const index = list.indexOf(item)
    index > -1 && list.splice(index, 1)
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
