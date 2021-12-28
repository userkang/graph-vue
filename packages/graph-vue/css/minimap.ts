export default `
.graph-minimap {
  box-sizing: border-box;
  position: relative;
  position: absolute;
  left: 10px;
  bottom: 10px;
  overflow: hidden;
  user-select: none;
}
.graph-minimap:hover > .graph-minimap-viewport {
  background-color: rgba(var(--color-main), 0.15);
}
.graph-minimap-viewport {
  position: absolute;
  left: 0%;
  top: 0%;
  background-color: rgba(var(--color-main), 0.1);
  cursor: move;
  transform-origin: center;
}
.graph-minimap-viewport:hover {
  background-color: rgba(var(--color-main), 0.2);
}
.graph-minimap-resize {
  position: absolute;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: rgb(var(--color-shadow));
  cursor: nwse-resize;
}
`
