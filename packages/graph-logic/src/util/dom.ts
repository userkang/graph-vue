export const getEventPath = (
  event: Event & { path?: EventTarget[] }
): EventTarget[] => {
  return event.path || (event['composedPath'] && event['composedPath']())
}

export const isTarget = (e: MouseEvent, type: string) => {
  const path = getEventPath(e)
  for (const target of path) {
    if (
      target instanceof Element &&
      target.getAttribute('graph-type') === type
    ) {
      return true
    }
    if (target instanceof SVGSVGElement) {
      break
    }
  }
  return false
}

export const addEventListener = (
  target: HTMLElement | Window | SVGSVGElement,
  eventType: string,
  callback: (args: any) => void
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

export const getItemData = (e: MouseEvent) => {
  let target = e.target as HTMLElement
  const currentTarget = e.currentTarget

  while (target !== currentTarget) {
    if (target.getAttribute('graph-type')) {
      const attrNames = target.getAttributeNames()
      const data: Record<string, string | null> = {}
      attrNames.forEach(item => {
        if (/graph-(.+)/.test(item)) {
          const type = item.replace('graph-', '')
          data[type] = target.getAttribute(item)
        }
      })
      return data
    }

    target = target.parentNode as HTMLElement
  }

  return {}
}

export const getItemType = (e: MouseEvent) => {
  let type: string | null | false = ''
  const path = getEventPath(e)
  for (const target of path) {
    type = target instanceof Element && target.getAttribute('graph-type')
    if (type || target instanceof SVGSVGElement) {
      break
    }
  }

  return type
}
