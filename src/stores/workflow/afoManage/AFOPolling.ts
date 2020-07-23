import Base from '../../base'
import { AfoTaskStatusVo } from '@/types/afoManage'


interface AFOPollingState {
  latestTaskStatus: AfoTaskStatusVo[]
  latestScheduleStatus: any[]
}

class AFOPolling extends Base {
  state: AFOPollingState = {
    latestTaskStatus:[],
    latestScheduleStatus: []
  }

  async getTaskStatus(idList: string[]): Promise<AfoTaskStatusVo[]> {
    const result = await this.$requestHandle(
      'post',
      `/afo/tasks/status`,
      {
        afoTaskIdList: idList
      }
    )
    // NOTE: 在这个接口里，不管父任务还是子任务，id都叫taskId
    function sortByTaskId(a: AfoTaskStatusVo, b: AfoTaskStatusVo) {
      return b.taskId - a.taskId
    }
    const taskStatusList = result.data.data
    taskStatusList.sort(sortByTaskId)
    taskStatusList.forEach((taskStatus: AfoTaskStatusVo) => {
      if (taskStatus.children) {
        taskStatus.children.sort(sortByTaskId)
      }
    })
    return this.state.latestTaskStatus = taskStatusList
  }

}

export const AFOPollingStore = new AFOPolling()
