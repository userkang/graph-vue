import Graph from '../controller/graph'
type Callback = (...args: any[]) => void
interface GraphEvent { type: string, bindFunc: Callback }
abstract class Base {
  graph: Graph
  /**
   * @todo 为什么事件队列不在拥有on函数的对象里？应该是on函数添加事件队列
   */
  eventQueue: GraphEvent[] = []

  constructor(graph: Graph) {
    this.graph = graph
  }

  /**
   * 监听事件
   * @param type 事件类型
   * @param callback 事件回调
   */
  addEvent(type: string, callback: Callback) {
    const bindFunc: Callback = callback.bind(this)
    this.eventQueue.push({ type, bindFunc })
    this.graph.on(type, bindFunc)
  }

  destory() {
    for (let i = this.eventQueue.length - 1; i >= 0; i--) {
      const event = this.eventQueue[i];
      this.graph.off(event.type, event.bindFunc)
    }
  }
}

export default Base
