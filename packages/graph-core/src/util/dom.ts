export const isTarget = (e: MouseEvent, type: string) => {
  let target = e.target as HTMLElement
  const currentTarget = e.currentTarget

  while (target !== currentTarget) {
    if (target.dataset.type === type) {
      return true
    }

    target = target.parentNode as HTMLElement
  }

  return false
}

export const addEventListener = (
  target: HTMLElement | Window,
  eventType: string,
  callback: any
) => {
  if (target) {
    if (typeof target.addEventListener === 'function') {
      target.addEventListener(eventType, callback, {
        passive: false,
        capture: false
      })
      return {
        remove: () => {
          target.removeEventListener(eventType, callback, false)
        }
      }
    }
  }
}

export const getItemId = (e: MouseEvent) => {
  let target = e.target as HTMLElement
  const currentTarget = e.currentTarget

  while (target !== currentTarget) {
    if (target.dataset.id) {
      return target.dataset.id
    }

    target = target.parentNode as HTMLElement
  }

  return {}
}
