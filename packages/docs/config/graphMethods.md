### 事件 Event

通过实例方法 graph.on 和 graph.off 可以进行事件的绑定和解绑。

```typescript
// 如果有些节点带有 data-type 属性，那在绑定事件的时候会在回调的第二个参数带上该属性值。
graph.on(eventName, (e: MouseEvent, data: { [key: string]: unknown }) => {
  // 操作
})
```

#### 鼠标事件

|   事件   |    通用     |        node 节点 | edge 边          | svg 画布空白区域 |
| :------: | :---------: | ---------------: | ---------------- | ---------------- |
|   单击   |    click    |       node.click | edge.click       | svg.click        |
|   双击   |  dblclick   |    node.dblclick | edge.dblclick    | svg.dblclick     |
|   右键   | contextmenu | node.contextmenu | edge.contextmenu | svg.contextmenu  |
| 鼠标按下 |  mousedown  |   node.mousedown | edge.mousedown   | svg.mousedown    |
| 鼠标移动 |  mousemove  |   node.mousemove | edge.mousemove   | svg.mousemove    |
| 鼠标抬起 |   mouseup   |     node.mouseup | edge.mouseup     | svg.mouseup      |
| 鼠标滚动 |    whell    |       node.whell | edge.whell       | svg.mousewhell   |
| 鼠标进入 | mouseenter  |  node.mouseenter | edge.mouseenter  | svg.mouseenter   |
| 鼠标离开 | mouseleave  |  node.mouseleave | edge.mouseleave  | svg.mouseleave   |
