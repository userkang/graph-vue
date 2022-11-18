import EventEmitter from './event-emitter'
import { MembersToSingleEvent, valuesType } from '../types/type'

const EVENT_TYPES = ['change'] as const

export class MembersToSingle<M, S> extends EventEmitter<
  valuesType<typeof EVENT_TYPES>,
  false
> {
  primaryMap: Map<M, S> = new Map()
  indexedMap: Map<S, Set<M>> = new Map()
  constructor() {
    super()
  }

  private onAdded(member: M, single: S): void {
    const memberSet: Set<M> = this.indexedMap.get(single) || new Set<M>()
    memberSet.add(member)
    this.indexedMap.set(single, memberSet)
    this.emit('change', <MembersToSingleEvent<M, S>>{ type: 'add', member, single })
  }

  private onRemove(member: M, single: S): void {
    const memberSet = this.indexedMap.get(single)
    if (memberSet) {
      memberSet.delete(member)
      memberSet.size === 0 && this.indexedMap.delete(single)
      this.emit('change', <MembersToSingleEvent<M, S>>{
        type: 'remove',
        member,
        single
      })
    }
  }

  addMember(member: M, single: S): void {
    this.primaryMap.set(member, single)
    this.onAdded(member, single)
  }

  getMembers(item: S): M[] | void {
    const members = this.indexedMap.get(item)
    return members ? Array.from(members) : []
  }

  getSingle(item: M): S | void {
    const single = this.primaryMap.get(item as M)
    return single ? single : void 0
  }

  remove(item: S): void
  remove(item: M): void
  remove(item: S | M): void {
    const single = this.getSingle(item as M)
    if (single) {
      this.primaryMap.delete(item as M)
      this.onRemove(item as M, single)
      return
    }
    const members = this.getMembers(item as S)
    members?.forEach(m => {
      this.primaryMap.delete(m)
      this.onRemove(m, item as S)
    })
  }
}
