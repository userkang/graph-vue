import Base from '../../base'
import { AfoTaskDetailVo, AfoTaskVo, ToolTaskAfoVo, AfoTaskStatusVo } from '@/types/afoManage'

interface AFOManageTaskState {
  taskInfo: AfoTaskDetailVo,
  taskList: AfoTaskVo[],
}

class AFOManageTask extends Base {

  state: AFOManageTaskState = {
    taskInfo: {} as any,
    taskList: [],
  }

  /**
   * taskInfo相关
   */

  async getTask(afoTaskId: number): Promise<AfoTaskDetailVo> {
    const result = await this.$requestHandle(
      'get',
      `/afo/task/${afoTaskId}`,
    )
    return this.state.taskInfo = result.data.data
  }

  async postTask(taskVO: Partial<AfoTaskDetailVo>) {
    return this.$requestHandle(
      'post',
      `/afo/task`,
      taskVO
    )
  }

  async patchTask(afoTaskId: number, taskVO: Partial<AfoTaskDetailVo>) {
    return this.$requestHandle(
      'patch',
      `/afo/task/${afoTaskId}`,
      taskVO,
    )
  }

  async deleteTask(afoTaskId: number) {
    return this.$requestHandle(
      'deleted',
      `/afo/task/${afoTaskId}`,
    )
  }

  async stopTask(afoTaskId: number) {
    return this.$requestHandle(
      'post',
      `/afo/task/${afoTaskId}/stop`
    )
  }

  async stopChildTask(afoTaskId: number, childTaskId: number) {
    return this.$requestHandle(
      'post',
      `/afo/task/${afoTaskId}/child/${childTaskId}/stop`
    )
  }

  async runTask(afoTaskId: number): Promise<AfoTaskStatusVo> {
    const result = await this.$requestHandle(
      'post',
      `/afo/task/${afoTaskId}/exec`
    )
    return result.data.data
  }

  async copyTask(afoTaskId: number): Promise<AfoTaskDetailVo> {
    const result = await this.$requestHandle(
      'post',
      `/afo/task/${afoTaskId}/copy`
    )
    return result.data.data
  }

  /**
   * taskList相关
   */

  async getTaskList(nodeId: string): Promise<AfoTaskVo[]> {
    const result = await this.$requestHandle(
      'get',
      `/afo/tasks`,
      { nodeId }
    )
    const taskList = result.data.data
    // 外层排序
    taskList.sort((a: AfoTaskVo, b: AfoTaskVo) => b.afoTaskId - a.afoTaskId)
    taskList.forEach((task: AfoTaskVo) => {
      if (task.children) {
        task.children.sort((a: AfoTaskVo, b: AfoTaskVo) => b.dlTaskId - a.dlTaskId)
      }
    })
    return this.state.taskList = taskList
  }


  /**
   * 其他
   */
  async getTaskArgsTemplate() {
    const result = await this.$requestHandle(
      'get',
      `/afo/task/args/template`,
    )
    return result.data.data
  }

  async getLatestAfoTaskInfo(nodeId: string): Promise<AfoTaskDetailVo> {
    const result = await this.$requestHandle(
      'get',
      `/afo/latest/task`,
      { nodeId }
    )
    return result.data.data
  }

  async getNodeInfo(workflowId: number, nodeId: number): Promise<ToolTaskAfoVo> {
    const result = await this.$requestHandle(
      'get',
      `/workflow/${workflowId}/node/${nodeId}/toolTask/afo/get`
    )
    return result.data.data
  }

}

export const AFOManageTaskStore = new AFOManageTask()
