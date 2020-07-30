import Base from '../base'
import { componentListMock } from '@/mock/componentList'

class ComponentList extends Base {
  public state: { list: IComponentType[] } = {
    list: []
  }

  public async getComponentList() {
    this.state.list = componentListMock
  }
}

export const ComponentListStore = new ComponentList()
