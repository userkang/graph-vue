import Base from '../../base'
import { TaskVo, AfoTmTaskVo, AfoTaskStatusVo } from '@/types/afoManage'

// TODO: 调度的get、post、patch的interface定义含糊不清，需要继续确认
interface AFOManageScheduleState {
  scheduleInfo: TaskVo // NOTE: 名字起得有歧义，先用着吧
  scheduleList: AfoTmTaskVo[]
}

class AFOManageSchedule extends Base {
  state: AFOManageScheduleState = {
    scheduleInfo: {} as TaskVo,
    scheduleList: [],
  }

  /**
   * scheduleInfo相关
   */

  async getSchedule(workflowNodeId: string): Promise<TaskVo> {
    const result = await this.$requestHandle(
      'get',
      `/afo/schedule`,
      { workflowNodeId }
    )
    return this.state.scheduleInfo = result.data.data
  }

  async postSchedule(workflowNodeId: string, scheduleVO: Partial<TaskVo>) {
    return this.$requestHandle(
      'post',
      `/afo/schedule/node/${workflowNodeId}`,
      scheduleVO
    )
  }

  async patchSchedule(workflowNodeId: string, scheduleVO: Partial<TaskVo>) {
    return this.$requestHandle(
      'patch',
      `/afo/schedule/node/${workflowNodeId}`,
      scheduleVO
    )
  }

  async deleteSchedule(workflowNodeId: string) {
    return this.$requestHandle(
      'deleted',
      `/afo/schedule/node/${workflowNodeId}`,
    )
  }

  async reRunScheduleTask(afoTaskId: number, afoTaskExecId: number): Promise<AfoTaskStatusVo> {
    const result = await this.$requestHandle(
      'post',
      `/afo/task/${afoTaskId}/exec/${afoTaskExecId}/retry`,
    )
    return result.data.data
  }
  async reRunScheduleChildTask(afoTaskId: number, dlTaskId: number): Promise<AfoTaskStatusVo> {
    // TODO: 确定接口
    const result = await this.$requestHandle(
      'post',
      `/afo/task/${afoTaskId}/child/${dlTaskId}/retry`,
    )
    return result.data.data
  }

  /**
   * scheduleList相关
   */

  async getScheduleList(workflowNodeId: string): Promise<AfoTmTaskVo[]> {
    const result = await this.$requestHandle(
      'get',
      '/afo/schedule/task',
      { workflowNodeId }
    )
    return this.state.scheduleList = [result.data.data].filter(Boolean)
  }

}

export const AFOManageScheduleStore = new AFOManageSchedule()
