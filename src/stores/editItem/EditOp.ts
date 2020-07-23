import Base from '../base'

interface CheckFilePayload {
  customedFile: string
}

class CheckFile extends Base {
  public async request(payload: CheckFilePayload) {
    const { customedFile } = payload
    try {
      // tslint:disable-next-line
      const { data } = await this.$requestHandle('get', `/utils/path/check`, {
        path: customedFile
      })
      // if (data.code !== this.$RES_CODE) {
      //     this.$showMessage(data.message);
      // }
      return data.code === this.$RES_CODE
    } catch (e) {
      // this.$showMessage(e);
    }
  }
}

export const ChackFileStore = new CheckFile()
