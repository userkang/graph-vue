import Base from '@/stores/base'
import { ISelectOptionItem } from '@/types/createNode'

interface ITaskInfo {
  value: {
    taskQueue: ISelectOptionItem[]
  }
}

class TaskQueue extends Base {
  public state: ITaskInfo = {
    value: {
      taskQueue: []
    }
  }

  public async getTaskQueue(projectName = '') {
    try {
      const value = await this.$requestHandle('get', '/wx/tenant/queue', {
        projectName
      })
      if (value.data.code === this.$RES_CODE) {
        this.state.value.taskQueue = value.data.data.map((item: string) => ({
          label: item,
          value: item
        }))
      }
      // this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const TaskQueueStore = new TaskQueue()
