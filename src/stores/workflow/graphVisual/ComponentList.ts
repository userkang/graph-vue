import Base from '../../base'

interface ComponentState {
  list: Workflow.WorkflowComponentCategoryVo[]
  tabValue: string
}

class ComponentList extends Base {
  public state: ComponentState = {
    list: [],
    tabValue: 'project'
  }

  public async getComponentList() {
    try {
      const value = await this.$requestHandle(
        'get',
        '/workflow/component/category'
      )
      this.state.list = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const ComponentListStore = new ComponentList()
