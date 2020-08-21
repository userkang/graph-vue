import Base from './base'
import { componentListMock, componentMock } from '@/mock/component-list'

interface IComponentListState {
  list: IComponentType[]
  dragingInfo: {
    component: IComponentType
    offsetX: number
    offsetY: number
  }
}

class ComponentList extends Base {
  public state: IComponentListState = {
    list: [],
    dragingInfo: {
      component: componentMock,
      offsetX: 0,
      offsetY: 0
    }
  }

  public async getComponentList() {
    this.state.list = componentListMock
  }
}

export const ComponentListStore = new ComponentList()
