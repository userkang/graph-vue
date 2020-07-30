import Base from '../base'
import { IDagType } from '@/types/dag'
import { dagMock } from '@/mock/dag'

interface IDagState {
  value: IDagType
}

class Dag extends Base {
  public state: IDagState = {
    value: {
      dagId: 0,
      nodes: [],
      edges: []
    }
  }

  public getDagContent() {
    this.state.value = dagMock
  }
}

export const DagStore = new Dag()
