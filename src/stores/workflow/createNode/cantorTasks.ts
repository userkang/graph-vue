import Base from '@/stores/base';

interface CantorTasksState {
  cantorTasks: any[]
  show: boolean
  loading: boolean
}

class CantorTasks extends Base {
  state: CantorTasksState = {
    cantorTasks: [],
    show: false,
    loading: false,
  }

  reset() {
    this.state.show = false
    this.state.cantorTasks = []
  }

  async update(taskName: string) {
    this.state.loading = true
    try {
      const res = await this.$requestHandle(
        'get',
        '/workflow/msp/cantor_tasks',
        {jobName: taskName}
      )
      const { show, cantorTasks } = res.data.data as Workflow.MspCantorTaskCreateVo
      this.state.show = show
      this.state.cantorTasks = cantorTasks
    } finally {
      this.state.loading = false
    }
  }
}

export const CantorTasksStore = new CantorTasks()
