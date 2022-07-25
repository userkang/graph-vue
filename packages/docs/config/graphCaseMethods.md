## 数据

#### data(data: IDataModel): void

> 初始化图数据，具体数据格式如下（？标记，为可选参数）

```typescript
IDataModel {
    nodes: INodeModel[];
    edges: IEdgeModel[];
    [key: string]: unknown;
}
INodeModel {
    id?: string;
    width?: number;
    height?: number;
    ports?: IPortModel[];
    [key: string]: unknown;
}
IEdgeModel {
    id?: string;
    fromNodeId: string;
    toNodeId: string;
    fromPortId?: string;
    toPortId?: string;
    [key: string]: unknown;
}
```

---

## 获取/设置

#### get(key: string): any

> 通过 key 值获取属性值。如：

```typescript
graph.get('action') // 获取当前图 action 的配置，graph 为 Graph 实例
```

#### set<T = any>(key: string | object, val?: T)

> 设置/修改属性值。如：

```typescript
graph.set('drection', 'LR') // 修改图方向为 LR
graph.data(data) // 重新初始化数据
```

---

## 视口操作

#### 1、getZoom(): number

> 获取当前视口的缩放比例。

#### 2、zoom(value: number): void

> 改变视口的缩放比例，value 为要缩放到的比例。

#### 3、translate(x: number, y: number): void

> 平移画布的位置; x, y 参数为要平移的距离。

#### 4、fitView(): void

> 让画布内容自适应视口的大小; 会根据视口大小缩放画布内容。

#### 5、fitCenter(): void

> 平移画布内容到画布中心; 只平移画布内容，不缩放。

#### 6、fullScreen(el?: HTMLElement): void

> 全屏展示。参数为需要全屏的 DOM 对象，默认为初始化中配置的画布 DOM 对象；调用会在“全屏/退出全屏”状态切换。

---

## 元素操作

#### 1、 addNode(item: INodeModel, stack?: boolean): INode

<em>新增节点</em>

- item 为添加节点的对象信息。详情可以查看 INodeModel 的数据格式。
- stack 为是否将该操作记录到撤回栈里，默认为 true。
- 新增节点会返回节点实例对象。后面会介绍节点的实例方法。

#### 2、addEdge(item: IEdgeModel, stack?: boolean): IEdge

<em>新增边</em>

- item 为添加边的对象信息。详情可以查看 IEdgeModel 的数据格式。
- stack 为是否将该操作记录到撤回栈里，默认为 true。
- 新增边会返回边的实例对象。后面同样会介绍边的实例方法。

#### 3、deleteNode(id: string, stack?: boolean): INode

<em>删除节点</em>

- id 为删除节点的 id，可以从节点实例对象上获取。
- stack 为是否将该操作记录到撤回栈里，默认为 true。

#### 4、deleteEdge(id: string, stack?: boolean): IEdge

<em>删除边</em>

- id 为删除边的 id，可以从边实例对象上获取。
- stack 为是否将该操作记录到撤回栈里，默认为 true。

#### 5、updateNode(id: string, model: INodeModel): INode

<em>更新节点</em>

- id 为更新节点的 id;
- model 为修改相关信息。

#### 6、updateEdge(id: string, model?: IEdgeModel): IEdge

<em>更新边</em>

- id 为更新边的 id;
- model 为修改信息;
- 注意：边的起始位置和目标位置（fromNodeId, toNodeId, fromPortId, toPortId）信息不支持修改。

---

## 元素查找

#### findNode(id: string | number): INode

<em>查找节点元素</em>

- id 为节点的 id，兼容数字和字符串类型。
- 返回节点实例。

#### findEdge(id: string | number): IEdge

<em>查找边元素</em>

- id 为边的 id，兼容数字和字符串类型。
- 返回边实例。

#### findPort(id: string | number): IPort

<em>查找节点上插槽元素（边和节点相交的位置）</em>

- id 为插槽的 id，兼容数字和字符串类型。
- 返回插槽实例。

#### findNodeByState(state: string): INode[]

> 通过状态信息查找节点。返回节点实例对象的数组。

```typescript
graph.findNodeByState('selected') // 获取所有被选中状态的接口
```

#### findEdgeByState(state: string): IEdge[]

<em>通过状态信息查找边</em>

- 返回边实例对象的数组。

---

## 行为操作

#### addAction(action: string | string[]): void

> 添加默认行为操作。
> 参数支持单个行为和多个行为。

#### removeAction(action?: string | string[]): void

> 移除默认行为操作。
> 若参数为空，默认移除所有默认行为。

---

## 事件绑定/解绑

#### on(evt: string | string[], callback: (...args: unknown[]) => void): void

> 绑定事件。
>
> - 具体可绑定的事件类型可查看关于 Event 的介绍。
> - 参数支持单个或者批量绑定。

#### emit(evt: string, ...args: unknown[]): void

> 触发事件。

#### off(evt?: string, callback?: (...args: unknown[]) => void): void

> 解绑事件。
> 若参数为空，默认解绑所有已绑定事件。

#### getEvent()

> 获取所有事件队列。

---

## 布局

#### layout(options: ILayout): void

> 对画布内容进行自动布局。
>
> options [参数说明](https://github.com/dagrejs/dagre/wiki)

---

## 操作栈

#### undo(): void

> 执行撤销操作。

#### redo(): void

> 执行回撤操作。

#### pushStack(type: string, data: IDataStack, stackType?: string): void

> 将操作推入撤销/回撤栈中。
>
> stackType 默认为 'undo'。即推入撤销栈中。若 stackType 为 'redo', 即会推入回撤栈中。

#### getUndoStack(): IStack[]

> 获取撤销栈内容。

#### getRedoStack(): IStack[]

> 获取回撤栈内容。

---

## 坐标转换

#### getPointByClient(originX: number, originY: number): {x: number, y:number}

> 将屏幕/页面坐标转换为画布内视口坐标。

---

## 销毁画布

#### destroy(): void

> 销毁画布。自动解绑事件，删除无用实例。

---
