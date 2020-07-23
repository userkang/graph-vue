import Base from '@/stores/base';

interface CantorTasksState {
  cantorTasks: Workflow.MspCantorTaskVo[]
  loading: boolean
  postLoading: boolean
}

class CantorTasks extends Base {
  state: CantorTasksState = {
    cantorTasks: [],
    loading: false,
    postLoading: false
  }

  reset() {
    this.state.cantorTasks = []
  }

  async update(workflowId: number, nodeId: number) {
    this.reset()
    this.state.loading = true
    try {
      const res = await this.$requestHandle(
        'get',
        `/workflow/${workflowId}/node/${nodeId}/tool/msp/get/cantor_task`
      )
      const cantorTasks = res.data.data as Workflow.MspCantorTaskVo[]
      this.state.cantorTasks = cantorTasks
    } finally {
      this.state.loading = false
    }
  }

  async postMspChangeCantorTask(workflowId: number, nodeId: number, cantorTask: string) {
    this.state.postLoading = true
    try {
      await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/node/${nodeId}/tool/msp/change/cantor_task`,
        {
          cantorTask
        }
      )
    } finally {
      this.state.postLoading = false
    }

  }
}

export const CantorTasksStore = new CantorTasks()
