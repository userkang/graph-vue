import Base from '../base'
import { dagMock } from '@/mock/dag'
import { IDagType } from '@/types/dag'

interface IDagState {
  dag: IDagType
}

class Dag extends Base {
  public state: IDagState = {
    dag: {
      dagId: 0,
      nodes: [],
      edges: []
    }
  }

  public getDagContent() {
    this.state.dag = dagMock
  }
}

export const DagStore = new Dag()
