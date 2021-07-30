export default `
:root {
  --edge-color: #d1d1dd;
  --select-color: #4150f6;
}
@keyframes dash {
  from {
    stroke-dashoffset: 320;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.graph-edge-wrapper {
  stroke-width: 10;
  fill: none;
  stroke: transparent;
}
/**
.graph-edge-wrapper:hover +.graph-edge {
  stroke: var(--select-color);
  stroke-width: 2.5;
  cursor: pointer;
}
.graph-edge-wrapper:hover +.graph-edge +.graph-arrow {
  stroke: var(--select-color);
  fill: var(--select-color);
}
*/
.graph-edge {
  stroke: var(--edge-color);
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  /**
  stroke-dasharray: 5;
  animation: dash 10s linear infinite;
  */
  pointer-events: none;
}
.graph-edge-active {
  stroke: var(--select-color);
  stroke-width: 2.5;
  cursor: pointer;
  stroke-linecap: round;
}
.graph-arrow {
  stroke: var(--edge-color);
  fill: var(--edge-color);
}
.graph-arrow-active {
  stroke: var(--select-color);
  fill: var(--select-color);
}
.graph-new-edge {
  pointer-events: none;
  stroke-dasharray: 5;
  stroke-linecap: round;
  stroke-width: 1.5;
  stroke: #d1d1d9;
  fill: transparent;
}
`
