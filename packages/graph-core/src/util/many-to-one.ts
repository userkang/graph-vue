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
    const memberSet: Set<M> = this.indexedMap.get(one) || new Set<M>()
    memberSet.add(member)
    this.indexedMap.set(one, memberSet)
    this.emit('change', <ManyToOneEvent<M, O>>{ type: 'add', member, one })
  }

  private onRemove(member: M, one: O): void {
    const memberSet = this.indexedMap.get(one)
    if (memberSet) {
      memberSet.delete(member)
      memberSet.size === 0 && this.indexedMap.delete(one)
      this.emit('change', <ManyToOneEvent<M, O>>{
        type: 'remove',
        member,
        one
      })
    }
  }

  addMember(member: M, one: O): void {
    this.primaryMap.set(member, one)
    this.onAdded(member, one)
  }

  getMembers(item: O): M[] {
    const members = this.indexedMap.get(item)
    return members ? Array.from(members) : []
  }

  getSingle(item: M): O | void {
    const one = this.primaryMap.get(item as M)
    return one ? one : void 0
  }

  remove(item: O): void
  remove(item: M): void
  remove(item: O | M): void {
    const one = this.getSingle(item as M)
    if (one) {
      this.primaryMap.delete(item as M)
      this.onRemove(item as M, one)
      return
    }
    const members = this.getMembers(item as O)
    members?.forEach(m => {
      this.primaryMap.delete(m)
      this.onRemove(m, item as O)
    })
  }
}
