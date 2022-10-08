import Node from './node'
import Edge from './edge'
import { Item } from '../types/type'

const getItemZindex = (item?: Node | Edge) => (item ? item.zIndex || 0 : 0)

export const useSortedItems = () => {
  const list: Array<Node | Edge> = []

  const insertItem = (target: Node | Edge) => {
    const getLocalZindex = (t: Node | Edge) =>
      getItemZindex(t) + (t instanceof Edge ? -0.5 : 0)
    const prevIndex = list.indexOf(target)
    const targetZindex = getLocalZindex(target)

    const getNextIndex = (left: number, right: number): number => {
      if (targetZindex < getLocalZindex(list[left])) {
        return left
      } else if (targetZindex >= getLocalZindex(list[right])) {
        return right + 1
      } else {
        while (left < right - 1) {
          const mid = Math.trunc((left + right) / 2)
          const midZindex = getLocalZindex(list[mid])
          if (midZindex <= targetZindex) {
            left = mid
          } else {
            right = mid
          }
        }
      }
      return right
    }

    if (prevIndex === -1) {
      const nextIndex = getNextIndex(0, list.length - 1)
      list.splice(nextIndex, 0, target)
    } else if (targetZindex < getLocalZindex(list[prevIndex - 1])) {
      // 向左
      const nextIndex = getNextIndex(0, prevIndex - 1)
      list.splice(prevIndex, 1)
      list.splice(nextIndex, 0, target)
    } else if (targetZindex > getLocalZindex(list[prevIndex + 1])) {
      // 向右
      const nextIndex = getNextIndex(prevIndex + 1, list.length - 1)
      list.splice(prevIndex, 1)
      list.splice(nextIndex, 0, target)
    }
  }

  const onZIndexChange = (item: Item, key: string) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    if (key !== 'zIndex') {
      return
    }
    insertItem(item)
  }

  const add = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    insertItem(item)
    item.on('change', onZIndexChange)
  }

  const remove = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    const index = list.indexOf(item)
    if (index === -1) {
      return
    }
    item.off('change', onZIndexChange)
    list.splice(index, 1)
  }

  return {
    items: list,
    add,
    remove
  }
}
