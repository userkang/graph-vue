import request, {  } from '../net/index'
import { MethodType, PageVoType } from '@/types/common'
import Axios from 'axios'

class Message {
  public state = {
    message: ''
  }
  public showMessage(value: string) {
    this.state.message = value
  }

  public cleanMessage() {
    this.state.message = ''
  }
}

export const messageStore = new Message()

class Base {
  protected readonly $api = request
  protected readonly $message = messageStore
  protected readonly $RES_CODE = 0
  protected readonly $STATUS_LOADING = 'LOADING'
  protected readonly $STATUS_LOADED = 'LOADED'

  protected $cancelRequest = request.cancelRequest

  protected $showMessage(value: string | Error) {
    try {
      if (typeof value === 'string') {
        this.$message.showMessage(value)
      } else {
        this.$message.showMessage(`${(value as any).response.status}`)
      }
      // tslint:disable-next-line
    } catch (e) {}
  }

  protected $setState(state: any, value: any) {
    if (value.data.code === this.$RES_CODE) {
      state.value = value.data.data
    } else {
      this.$showMessage(value.data.message)
    }
  }

  protected $extractItems(state: any, value: any) {
    if (value.data.code === this.$RES_CODE) {
      state.value = value.data.data.items
    } else {
      this.$showMessage(value.data.message)
    }
  }

  protected $extractPage(state: any, data: PageVoType) {
    const { currentPageNo, pageSize, totalCount, totalPageCount } = data
    state.page = {
      currentPageNo,
      pageSize,
      totalCount,
      totalPageCount
    }
  }

  protected async $requestHandle(
    method: MethodType,
    path: string,
    payload?: any,
    filter: boolean = true,
    config?: AxiosRequestConfigWithSourceType
  ): Promise<any> {
    try {
      const value = await this.$api[method](path, payload, config)
      if (value.data.code === this.$RES_CODE || !filter) {
        return value
      } else {
        this.$showMessage(value.data.message)
        return Promise.reject(value.data)
      }
    } catch (e) {
      // 外界需要获取是否为cancel
      if (Axios.isCancel(e)) {
        throw e
      }
      this.$showMessage(e)
    }
  }

  protected async $requestDownloadHandle(
    path: string,
    payload?: any
  ): Promise<any> {
    try {
      const value = await this.$api.download(path, payload)
      if (value.data instanceof Blob) {
        return value.data
      } else {
        this.$showMessage('下载异常')
      }
    } catch (e) {
      this.$showMessage(e)
    }
  }
}
export default Base
