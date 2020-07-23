import Base from '../../base'
import { AfoDlLogVo } from '@/types/afoManage'

class AFOLog extends Base {
  state = {}

  async getTaskLog(dlTaskId: number): Promise<AfoDlLogVo> {
    const result = await this.$requestHandle(
      'get',
      `/afo/task/${dlTaskId}/log`,
    )
    return result.data.data
  }
}

export const AFOLogStore = new AFOLog()
