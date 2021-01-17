export const createSVGElement = type => {
  if (type === 'div') {
    return document.createElementNS('http://www.w3.org/1999/xhtml', type)
  }
  return document.createElementNS('http://www.w3.org/2000/svg', type)
}

export const insertCss = (content: string) => {
  const styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  styleElement.textContent = content

  const head = document.querySelector('head') as HTMLHeadElement
  if (head) {
    head.insertBefore(styleElement, head.firstChild)
  }
}
