const stringifyDate = (value: number) =>
  value >= 10 ? `${value}` : `0${value}`

export function parseDate(value: Date | null) {
  return value
    ? `${value.getFullYear()}-${stringifyDate(
        value.getMonth() + 1
      )}-${stringifyDate(value.getDate())}`
    : ''
}

export function parseTime(value: Date) {
  return `${parseDate(value)} 00:00:00`
}

export function parsePreciseTime(value: Date) {
  return (
    `${parseDate(value)} ${stringifyDate(value.getHours())}` +
    `:${stringifyDate(value.getMinutes())}:${stringifyDate(value.getSeconds())}`
  )
}

export function formatTime(value: string) {
  type TimeArray = [number, number, number]
  const [date, time] = value.split(' ')
  const dateArray = date.split('-').map(item => Number(item)) as TimeArray
  const timeArray = time.split(':').map(item => Number(item)) as TimeArray
  return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], ...timeArray)
}

export function calculateDuration(value: number) {
  const hours = Math.floor(value / (3600 * 1000)) // 计算相差分钟数
  const leave2 = value % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)
  return `${stringifyDate(hours)}:${stringifyDate(minutes)}:${stringifyDate(
    seconds
  )}`
}

export function routeNumberFilter(value: number) {
  return isNaN(value) ? 0 : value
}

export function escapeHtml(content: string = '') {
  const matchHtmlRegExp = /["'&<>]/
  const str = `${content}`
  const match = matchHtmlRegExp.exec(str)

  if (!match) {
    return str
  }
  let escape
  let html = ''
  let index = 0
  let lastIndex = 0

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;'
        break
      case 38: // &
        escape = '&amp;'
        break
      case 39: // '
        escape = '&#x27;' // modified from escape-html; used to be '&#39'
        break
      case 60: // <
        escape = '&lt;'
        break
      case 62: // >
        escape = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index)
    }
    lastIndex = index + 1
    html += escape
  }
  return lastIndex !== index ? html + str.substring(lastIndex, index) : html
}

// 垂直方向
export const calculateCurve = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const qx1 = x1
  const qy1 = (y2 - y1) / 3 + y1
  const qx2 = x2
  const qy2 = ((y2 - y1) * 2) / 3 + y1
  return `M ${x1} ${y1} C ${qx1} ${qy1}, ${qx2} ${qy2}, ${x2} ${y2}`
}

// 水平方向
export const calculateCurve2 = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const qx1 = (x2 - x1) / 3 + x1
  const qy1 = y1
  const qx2 = ((x2 - x1) * 2) / 3 + x1
  const qy2 = y2
  return `M ${x1} ${y1} C ${qx1} ${qy1}, ${qx2} ${qy2}, ${x2} ${y2}`
}

// tslint:disable-next-line
export const ipRegexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

export const portRegexp = /^\d{2, 6}$/

export const promiseTimeout = (time: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })

export const download = (data: Blob, fileName: string = 'data') => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${fileName}.xls`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getCharsLen = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}

export const chartAssemblyToolTip = (
  color: string,
  value: string,
  unit: string
): string => {
  let str = ''
  unit = unit || ''
  str += `<span style='display:inline-block;margin-right:5px;
  border-radius:1.5px;width:7px;height:7px;background-color:${color}'></span>`
  str += `<span>${value}${value !== '-' ? unit : ''}</span><br/>`
  return str
}
