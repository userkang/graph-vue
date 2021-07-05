// 邻接矩阵
let graph = {}
// 结点个数和边的个数
// 标记矩阵,0为当前结点未访问,1为访问过,-1表示当前结点后边的结点都被访问过。
let visited = {}
// 是否是DAG（有向无环图）
let isDAG = true
let nodes = []
let edges = []

// 图的深度遍历函数
function DFS(i) {
  visited[nodes[i].id] = 1
  for (let j = 0; j < nodes.length; j++) {
    // 如果当前结点有指向的结点
    if (graph[nodes[i].id][nodes[j].id] !== 0) {
      // 并且已经被访问过
      if (visited[nodes[j].id] === 1) {
        isDAG = false
        // 有环
        break
      } else if (visited[nodes[j].id] === -1) {
        // 当前结点后边的结点都被访问过，直接跳至下一个结点
        continue
      } else {
        DFS(j)
        // 否则递归访问
      }
    }
  }
  // 遍历过所有相连的结点后，把本节点标记为-1
  visited[nodes[i].id] = -1
}

// 创建图,以邻接矩阵表示
const create = () => {
  for (const node of nodes) {
    const pre = node.id
    visited[pre] = 0
    graph[pre] = {}
    for (const item of nodes) {
      const next = item.id
      graph[pre][next] = 0
    }
  }
  for (const edge of edges) {
    graph[edge.fromNodeId][edge.toNodeId] = 1
  }
}

const detectDirectedCycle = graphData => {
  // 邻接矩阵
  graph = {}
  // 结点个数和边的个数
  // 标记矩阵,0为当前结点未访问,1为访问过,-1表示当前结点后边的结点都被访问过。
  visited = {}
  // 是否是DAG（有向无环图）
  isDAG = true

  nodes = graphData.nodes
  edges = graphData.edges

  // 创建邻接矩阵
  create()

  for (let i = 0; i < nodes.length; i++) {
    // 该结点后边的结点都被访问过了，跳过它
    if (visited[nodes[i].id] === -1) {
      continue
    }
    DFS(i)
    if (!isDAG) {
      break
    }
  }

  return !isDAG
}

export default detectDirectedCycle
