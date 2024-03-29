export const insertCss = (content: string) => {
  const styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  styleElement.textContent = content

  const head = document.querySelector('head') as HTMLHeadElement
  if (head) {
    head.insertBefore(styleElement, head.firstChild)
  }
}
