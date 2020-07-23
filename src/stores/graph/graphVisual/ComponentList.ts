import Base from '../../base'
import { ComponentCategoryVoType } from '@/types/graph'

interface GraphComponentState {
  value: ComponentCategoryVoType[]
}

class ComponentList extends Base {
  public state: GraphComponentState = {
    value: []
  }

  public async request() {
    try {
      const value = await this.$requestHandle('get', '/training/component')
      this.state.value = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
  }

  public async getTestComponent() {
    const res = await this.$requestHandle('get', '/training/component/test')
    this.state.value = res.data.data
  }
}

export const ComponentListStore = new ComponentList()
