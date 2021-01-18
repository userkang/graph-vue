export default `
.graph-slot {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  cursor: pointer;
}
.graph-slot.graph-slot-linked  {
  fill: #606be1;
  stroke: #606be1;
}
.graph-slot.graph-slot-active:hover  {
  stroke: #606be1;
  stroke-width: 2;
  fill: #fff;
}
.graph-slot.graph-slot-enable  {
  stroke: rgba(96, 107, 225, 0.7);
  stroke-width: 4;
  fill: #fff;
}
.graph-slot.graph-slot-enable:hover  {
  stroke-width: 6;
  fill: rgba(96, 107, 225);
}
`
