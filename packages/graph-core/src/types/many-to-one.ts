import EventEmitter from '../util/event-emitter'
import { ManyToOneEvent, valuesType } from './type'

const EVENT_TYPES = ['change'] as const

export class ManyToOne<M, O> extends EventEmitter<
  valuesType<typeof EVENT_TYPES>,
  false
> {
  primaryMap: Map<M, O> = new Map()
  indexedMap: Map<O, Set<M>> = new Map()
  constructor() {
    super()
  }

  private onAdded(many: M, one: O): void {
    const setMany: Set<M> = this.indexedMap.get(one) || new Set<M>()
    setMany.add(many)
    this.indexedMap.set(one, setMany)
    this.emit('change', <ManyToOneEvent<M, O>>{ type: 'add', many, one })
  }

  private onRemove(many: M, one: O): void {
    const setMany = this.indexedMap.get(one)
    if (setMany) {
      setMany.delete(many)
      setMany.size === 0 && this.indexedMap.delete(one)
      this.emit('change', <ManyToOneEvent<M, O>>{ type: 'remove', many, one })
    }
  }

  add(many: M, one: O): void {
    this.primaryMap.set(many, one)
    this.onAdded(many, one)
  }

  find(item: O): M[] | void
  find(item: M): O | void
  find(item: O | M): M[] | O | void {
    const one = this.primaryMap.get(item as M)
    if (one) {
      return one
    }
    const setMany = this.indexedMap.get(item as O)
    if (setMany) {
      return Array.from(setMany)
    }
  }

  remove(item: O): void
  remove(item: M): void
  remove(item: O | M): void {
    const one = this.find(item as M)
    if (one) {
      this.primaryMap.delete(item as M)
      this.onRemove(item as M, one)
      return
    }
    const manys = this.find(item as O)
    manys?.forEach(m => {
      this.primaryMap.delete(m)
      this.onRemove(m, item as O)
    })
  }
}
