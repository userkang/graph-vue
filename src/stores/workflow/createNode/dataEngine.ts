import Base from '@/stores/base'
import { ISelectOptionItem } from '@/types/createNode'

export interface IEngineState {
  source: ISelectOptionItem[]
  target: ISelectOptionItem[]
}

class DataEngine extends Base {
  public state: IEngineState = {
    source: [],
    target: []
  }

  public async getSourceEngine() {
    try {
      const value = await this.$requestHandle(
        'get',
        '/workflow/toolTaskXt/syncSourceEngine/get'
      )
      if (value.data.code === this.$RES_CODE) {
        this.state.source = value.data.data.sourceEngines.map((item: string) => ({
          label: item,
          value: item
        }))
      }
      // tslint:disable-next-line
    } catch (e) {}
    return this.state.source
  }

  public async getTargetEngine(payload: string) {
    try {
      const value = await this.$requestHandle(
        'get',
        '/workflow/toolTaskXt/syncTargetEngine/get',
        {
          sourceEngine: payload
        }
      )
      if (value.data.code === this.$RES_CODE) {
        this.state.target = value.data.data.targetEngines.map((item: string) => ({
          label: item,
          value: item
        }))
      }
      // tslint:disable-next-line
    } catch (e) {}
    return this.state.target
  }
}

export const DataEngineStore = new DataEngine()
