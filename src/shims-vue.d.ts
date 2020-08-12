declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'dagre' {
  const vuedraggable: any
  export default vuedraggable
}

declare module '*.svg' {
  const img: any
  export default img
}

