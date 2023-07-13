export const insertCss = (content) => {
  const styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  styleElement.textContent = content

  const head = document.querySelector('head')
  if (head) {
    head.insertBefore(styleElement, head.firstChild)
  }
}
