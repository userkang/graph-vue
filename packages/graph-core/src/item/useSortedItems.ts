import Node from './node'
import Edge from './edge'
import { Item } from '../types/type'

const getItemZindex = (item?: Node | Edge) => (item ? item.zIndex || 0 : 0)

export const useSortedItems = () => {
  const list: Array<Node | Edge> = []

  const setItemIndex = (item: Node | Edge, from: number, to: number) => {
    if (to > from) {
      from > 0 && list.splice(from, 1)
      list.splice(Math.min(to + 1, list.length), 0, item)
    } else if (to < from) {
      from > 0 && list.splice(from, 1)
      list.splice(Math.max(to, 0), 0, item)
    }
  }

  // const computeIndex = (item: Node|Edge) => {
  //   let left = 0;
  //   let right = list.length - 1
  //   const zIndexes = list.map(
  //     t => getItemZindex(t) + (t instanceof Edge ? -0.5 : 0)
  //   )
  //   const prevIndex = list.indexOf(item)
  //   const targetZindex = item.zIndex || 0
  //   if(prevIndex === -1) {
  //     let left = prevIndex + 1
  //     let right = list.length - 1
  //     if (targetZindex < zIndexes[left]) {
  //       setItemIndex(item, prevIndex, left - 1)
  //     } else if (targetZindex >= zIndexes[right]) {
  //       setItemIndex(item, prevIndex, right + 1)
  //     } else {
  //       while (left < right - 1) {
  //         const mid = Math.trunc((left + right) / 2)
  //         const midZindex = zIndexes[mid]
  //         if (midZindex <= targetZindex) {
  //           left = mid
  //         } else {
  //           right = mid
  //         }
  //       }
  //   }

  // }

  const moveItem = (item: Item) => {
    if (!(item instanceof Node) && !(item instanceof Edge)) {
      return
    }
    const zIndexes = list.map(
      t => getItemZindex(t) + (t instanceof Edge ? -0.5 : 0)
    )
    const prevIndex = list.indexOf(item)
    const zIndex = item.zIndex || 0

    if (list[prevIndex + 1] && zIndex >= getItemZindex(list[prevIndex + 1])) {
      let left = prevIndex + 1
      let right = list.length - 1
      if (zIndex < zIndexes[left]) {
        setItemIndex(item, prevIndex, left - 1)
      } else if (zIndex >= zIndexes[right]) {
        setItemIndex(item, prevIndex, right + 1)
      } else {
        while (left < right - 1) {
          const mid = Math.trunc((left + right) / 2)
          const midZindex = zIndexes[mid]
          if (midZindex <= zIndex) {
            left = mid
          } else {
            right = mid
          }
        }
        setItemIndex(item, prevIndex, right)
      }
      // 向右移动
    } else if (
      list[prevIndex - 1] &&
      zIndex <= getItemZindex(list[prevIndex - 1])
    ) {
      // 向左移动
      let left = 0
      let right = prevIndex - 1
      if (zIndex < zIndexes[left]) {
        setItemIndex(item, prevIndex, left - 1)
        console.log('left')
      } else if (zIndex >= zIndexes[right]) {
        setItemIndex(item, prevIndex, right + 1)
      } else {
        while (left < right - 1) {
          const mid = Math.trunc((left + right) / 2)
          const midZindex = zIndexes[mid]
          if (midZindex <= zIndex) {
            left = mid
          } else {
            right = mid
          }
        }
        setItemIndex(item, prevIndex, right)
      }
    }
    console.log(list.map(
      t => getItemZindex(t) + (t instanceof Edge ? -0.5 : 0)
    ))
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
