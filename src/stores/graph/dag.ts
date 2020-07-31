import Base from '../base'
import { dagMock } from '@/mock/dag'
import { IDagType, ITransform } from '@/types/dag'

interface IDagState {
  dag: IDagType
  transfrom: ITransform
  dagDom: HTMLElement
}

class Dag extends Base {
  public state: IDagState = {
    dag: {
      dagId: 0,
      nodes: [],
      edges: []
    },
    transfrom: {
      scale: 1,
      translateX: 0,
      translateY: 0
    },
    dagDom: {} as HTMLElement
  }

  public getDagContent() {
    this.state.dag = dagMock
  }
}

export const DagStore = new Dag()
