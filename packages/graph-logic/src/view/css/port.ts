export default `
.graph-port {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  cursor: pointer;
}
.graph-port.graph-port-linked  {
  fill: #606be1;
  stroke: #606be1;
}
.graph-port.graph-port-active:hover  {
  stroke: #606be1;
  stroke-width: 2;
  fill: #fff;
}
.graph-port.graph-port-enable  {
  stroke: rgba(96, 107, 225, 0.7);
  stroke-width: 4;
  fill: #fff;
}
.graph-port.graph-port-enable:hover  {
  stroke-width: 6;
  fill: rgba(96, 107, 225);
}
`
