export default `
.graph-tool-box {
  position: absolute;
  display: flex;
  right: 10px;
  top: 10px;
  background: #383838;
  border: 1px solid #222;
  color: #ddd;
  font-weight: 400;
  font-size: 18px;
}
.graph-tool-box > li {
  display: flex;
  height: 30px;
  width: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.graph-tool-box > li:hover {
  background: #484848;
}
.graph-tool-box-select {
  color: #ff9801;
}
#undo,
#redo {
  font-size: 14px;
}
.graph-tool-box-disable {
  cursor: not-allowed;
  color: #585858;
}
.graph-tool-box-disable:hover {
  background: none;
}
`
