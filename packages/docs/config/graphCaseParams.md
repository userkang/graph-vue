### Graph 配置参数

> 对 Graph 类进行实例化，需要传递以下参数。

```typescript
IGraphConfig {
  // svg 的 DOM 容器，需要传入 HTML 节点对象
  container: HTMLElement
  // 图的方向： LR 从左到右， TB 自上到下
  direction: 'LR' | 'TB'
  // 节点默认的宽高，如果节点没有单独配置宽高，会取该默认值。 单位：px
  nodeInfo: {
    width: number
    height: number
  }
  // 默认行为配置。目前支持的默认行为有：drag-svg,drag-node,click-select,create-edge,wheel-move,wheel-zoom,brush-select
  action: string[]
}
```
