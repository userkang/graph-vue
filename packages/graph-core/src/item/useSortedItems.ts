import Node from './node'
import Edge from './edge'
import { Item } from '../types/type'

const getItemZindex = (item?: Node | Edge) => (item ? item.zIndex || 0 : 0)

export const useSortedItems = () => {
  const list: Array<Node | Edge> = []

  const moveItem = (target: Node | Edge) => {
    const zIndexes = list.map(
      t => getItemZindex(t) + (t instanceof Edge ? -0.5 : 0)
    )
    const prevIndex = list.indexOf(target)
    const targetZindex = target.zIndex || 0

    const computeIndex = (left: number, right: number) => {
      if (targetZindex < zIndexes[left]) {
        return [left - 1, left]
      } else if (targetZindex >= zIndexes[right]) {
        return [right, right + 1]
      } else {
        while (left < right - 1) {
          const mid = Math.trunc((left + right) / 2)
          const midZindex = zIndexes[mid]
          if (midZindex <= targetZindex) {
            left = mid
          } else {
            right = mid
          }
        }
      }
      return [left, right]
    }

    if (prevIndex === -1) {
      const [left, right] = computeIndex(0, list.length - 1)
      list.splice(right, 0, target)
    } else if (targetZindex < zIndexes[prevIndex - 1]) {
      // 向左
      const [left, right] = computeIndex(0, prevIndex - 1)
      list.splice(prevIndex, 1)
      list.splice(right, 0, target)
    } else if (targetZindex > zIndexes[prevIndex + 1]) {
      // 向右
      const [left, right] = computeIndex(prevIndex + 1, list.length - 1)
      list.splice(prevIndex, 1)
      list.splice(right, 0, target)
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
    moveItem(item)

    console.log(list.map(item => `${item.id}:${item.zIndex}`).join('; '))
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
