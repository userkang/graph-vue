import EventEmitter from './event-emitter'
import { ManyToOneEvent, valuesType } from '../types/type'

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

  private onAdded(member: M, one: O): void {
    const manySet: Set<M> = this.indexedMap.get(one) || new Set<M>()
    manySet.add(member)
    this.indexedMap.set(one, manySet)
    this.emit('change', <ManyToOneEvent<M, O>>{ type: 'add', member, one })
  }

  private onRemove(member: M, one: O): void {
    const manySet = this.indexedMap.get(one)
    if (manySet) {
      manySet.delete(member)
      manySet.size === 0 && this.indexedMap.delete(one)
      this.emit('change', <ManyToOneEvent<M, O>>{
        type: 'remove',
        member,
        one
      })
    }
  }

  add(member: M, one: O): void {
    this.primaryMap.set(member, one)
    this.onAdded(member, one)
  }

  getMany(item: O): M[] {
    const many = this.indexedMap.get(item)
    return many ? Array.from(many) : []
  }

  getOne(item: M): O | void {
    const one = this.primaryMap.get(item as M)
    return one ? one : void 0
  }

  remove(item: O): void
  remove(item: M): void
  remove(item: O | M): void {
    const one = this.getOne(item as M)
    if (one) {
      this.primaryMap.delete(item as M)
      this.onRemove(item as M, one)
      return
    }
    const many = this.getMany(item as O)
    many?.forEach(m => {
      this.primaryMap.delete(m)
      this.onRemove(m, item as O)
    })
  }
}
