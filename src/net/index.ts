import axios, { AxiosPromise } from 'axios'
const { origin } = location

const generateInstance = (prefix: string) => {
  const apiDomain = `${origin}${prefix}`
  const instance = axios.create({
    baseURL: apiDomain,
    timeout: 8000000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json',
    transformResponse: [
      (data: any) => {
        // 对 data 进行任意转换处理
        if (data instanceof Blob) {
          return data
        }
        if (!data) {
          return data
        }
        return typeof data === 'string' ? JSON.parse(data) : data
      }
    ]
  })
  return instance
}

const mlpAPIInstance = generateInstance('/mlapi')
const wxAPIInstance = generateInstance('/wxapi')
const APIInstance = generateInstance('/api')

export function get(
  url: string,
  param?: any,
  config?: AxiosRequestConfigWithSourceType
): AxiosPromise<AjaxResponse> {
  const params: any[] = []
  if (param) {
    Object.keys(param).forEach((key: any) => {
      let value = param[key]
      // 防止 undefined 和 null 被 encode 了
      if (typeof value !== 'number') {
        value = value || ''
      }
      params.push(`${key}=${encodeURIComponent(value)}`)
    })
    url = url + '&' + params.join('&')
  }
  return mlpAPIInstance.get<AjaxResponse>(url, config)
}

export function post(url: string, param?: any): AxiosPromise<AjaxResponse> {
  return mlpAPIInstance.post<AjaxResponse>(
    `${url}?traceId=${generateUnionId()}`,
    param
  )
}

export function put(url: string, param?: any): AxiosPromise<AjaxResponse> {
  return mlpAPIInstance.put<AjaxResponse>(
    `${url}?traceId=${generateUnionId()}`,
    param
  )
}

export function deleted(url: string, param?: any): AxiosPromise<AjaxResponse> {
  return mlpAPIInstance.delete(`${url}?traceId=${generateUnionId()}`, {
    params: param
  })
}

export function patch(url: string, param?: any): AxiosPromise<AjaxResponse> {
  return mlpAPIInstance.patch<AjaxResponse>(
    `${url}?traceId=${generateUnionId()}`,
    param
  )
}

export function wxGet(url: string, param?: any): AxiosPromise<AjaxResponse> {
  url = `${url}?traceId=${generateUnionId()}`
  const params: any[] = []
  if (param) {
    Object.keys(param).forEach((key: any) => {
      params.push(`${key}=${encodeURIComponent(param[key])}`)
    })
    url = url + '&' + params.join('&')
  }
  return wxAPIInstance.get<AjaxResponse>(url)
}

export function apiGet(url: string, param?: any): AxiosPromise<AjaxResponse> {
  url = `${url}?traceId=${generateUnionId()}`
  const params: any[] = []
  if (param) {
    Object.keys(param).forEach((key: any) => {
      params.push(`${key}=${encodeURIComponent(param[key])}`)
    })
    url = url + '&' + params.join('&')
  }
  return APIInstance.get<AjaxResponse>(url)
}

export default {
  get,
  post,
  put,
  deleted,
  patch,
  wxGet,
  apiGet
}
