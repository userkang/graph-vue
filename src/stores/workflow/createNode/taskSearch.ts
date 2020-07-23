import Base from '@/stores/base'

interface ITaskSearchState {
  value: {
    taskList: string[]
  }
}

const taskListSourceType = Symbol('taskList')

class TaskSearch extends Base {
  public state: ITaskSearchState = {
    value: {
      taskList: []
    }
  }

  public async getTaskList(jobName: string) {
    this.$cancelRequest(taskListSourceType)
    try {
      const value = await this.$requestHandle('get', `/workflow/msp/search`, {
        jobName
      }, true, {
        sourceType: taskListSourceType
      })
      this.state.value.taskList = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const TaskSearchStore = new TaskSearch()
