declare global {
  interface Document {
    mozCancelFullScreen(): Promise<void>
    webkitExitFullscreen(): Promise<void>
    msExitFullscreen(): Promise<void>
    mozFullScreenElement: Element
    webkitFullscreenElement: Element
    msFullscreenElement: Element
  }
  interface Element {
    mozRequestFullScreen(): Promise<void>
    webkitRequestFullscreen(): Promise<void>
    msRequestFullscreen(): Promise<void>
  }
}

export {}
