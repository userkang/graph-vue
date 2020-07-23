export interface MenuTipsState {
  value: MenuTipsPayload
}

export interface MenuTipsPayload {
  isShow?: boolean
  data?: Workflow.WorkflowBasicVo | Workflow.WorkflowGroupVo
  x: number
  y: number,
  type: string
}

class ProjectMenu {
  public state: MenuTipsState = {
    value: {
      isShow: false,
      data: undefined,
      x: 0,
      y: 0,
      type: ''
    }
  }

  public show(payload: MenuTipsPayload) {
    this.state.value = {
      ...payload,
      isShow: true
    }
  }

  public hide() {
    this.state.value = {
      x: 0,
      y: 0,
      isShow: false,
      type: ''
    }
  }
}

export const ProjectMenuStore = new ProjectMenu()
