(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define(["vue"], factory);
	else if(typeof exports === 'object')
		exports["graph-vue"] = factory(require("vue"));
	else
		root["graph-vue"] = factory(root["Vue"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__806__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 577:
/***/ (function(module) {

!function(t,e){if(true)module.exports=e();else { var r, n; }}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=292)}([function(t,e,n){var r;try{r={cloneDeep:n(230),constant:n(55),defaults:n(231),each:n(80),filter:n(83),find:n(232),flatten:n(110),forEach:n(81),forIn:n(239),has:n(94),isUndefined:n(95),last:n(240),map:n(96),mapValues:n(241),max:n(242),merge:n(244),min:n(250),minBy:n(251),now:n(252),pick:n(253),range:n(258),reduce:n(98),sortBy:n(261),uniqueId:n(266),values:n(103),zipObject:n(267)}}catch(t){}r||(r=window._),t.exports=r},function(t,e){var n=Array.isArray;t.exports=n},function(t,e,n){"use strict";var r=n(0),o=n(5).Graph;function i(t,e,n,o){var i;do{i=r.uniqueId(o)}while(t.hasNode(i));return n.dummy=e,t.setNode(i,n),i}function a(t){return r.max(r.map(t.nodes(),(function(e){var n=t.node(e).rank;if(!r.isUndefined(n))return n})))}t.exports={addDummyNode:i,simplify:function(t){var e=(new o).setGraph(t.graph());return r.forEach(t.nodes(),(function(n){e.setNode(n,t.node(n))})),r.forEach(t.edges(),(function(n){var r=e.edge(n.v,n.w)||{weight:0,minlen:1},o=t.edge(n);e.setEdge(n.v,n.w,{weight:r.weight+o.weight,minlen:Math.max(r.minlen,o.minlen)})})),e},asNonCompoundGraph:function(t){var e=new o({multigraph:t.isMultigraph()}).setGraph(t.graph());return r.forEach(t.nodes(),(function(n){t.children(n).length||e.setNode(n,t.node(n))})),r.forEach(t.edges(),(function(n){e.setEdge(n,t.edge(n))})),e},successorWeights:function(t){var e=r.map(t.nodes(),(function(e){var n={};return r.forEach(t.outEdges(e),(function(e){n[e.w]=(n[e.w]||0)+t.edge(e).weight})),n}));return r.zipObject(t.nodes(),e)},predecessorWeights:function(t){var e=r.map(t.nodes(),(function(e){var n={};return r.forEach(t.inEdges(e),(function(e){n[e.v]=(n[e.v]||0)+t.edge(e).weight})),n}));return r.zipObject(t.nodes(),e)},intersectRect:function(t,e){var n,r,o=t.x,i=t.y,a=e.x-o,s=e.y-i,u=t.width/2,c=t.height/2;if(!a&&!s)throw new Error("Not possible to find intersection inside of the rectangle");Math.abs(s)*u>Math.abs(a)*c?(s<0&&(c=-c),n=c*a/s,r=c):(a<0&&(u=-u),n=u,r=u*s/a);return{x:o+n,y:i+r}},buildLayerMatrix:function(t){var e=r.map(r.range(a(t)+1),(function(){return[]}));return r.forEach(t.nodes(),(function(n){var o=t.node(n),i=o.rank;r.isUndefined(i)||(e[i][o.order]=n)})),e},normalizeRanks:function(t){var e=r.min(r.map(t.nodes(),(function(e){return t.node(e).rank})));r.forEach(t.nodes(),(function(n){var o=t.node(n);r.has(o,"rank")&&(o.rank-=e)}))},removeEmptyRanks:function(t){var e=r.min(r.map(t.nodes(),(function(e){return t.node(e).rank}))),n=[];r.forEach(t.nodes(),(function(r){var o=t.node(r).rank-e;n[o]||(n[o]=[]),n[o].push(r)}));var o=0,i=t.graph().nodeRankFactor;r.forEach(n,(function(e,n){r.isUndefined(e)&&n%i!=0?--o:o&&r.forEach(e,(function(e){t.node(e).rank+=o}))}))},addBorderNode:function(t,e,n,r){var o={width:0,height:0};arguments.length>=4&&(o.rank=n,o.order=r);return i(t,"border",o,e)},maxRank:a,partition:function(t,e){var n={lhs:[],rhs:[]};return r.forEach(t,(function(t){e(t)?n.lhs.push(t):n.rhs.push(t)})),n},time:function(t,e){var n=r.now();try{return e()}finally{console.log(t+" time: "+(r.now()-n)+"ms")}},notime:function(t,e){return e()}}},function(t,e,n){var r;try{r={clone:n(117),constant:n(55),each:n(80),filter:n(83),has:n(94),isArray:n(1),isEmpty:n(194),isFunction:n(20),isUndefined:n(95),keys:n(10),map:n(96),reduce:n(98),size:n(197),transform:n(203),union:n(204),values:n(103)}}catch(t){}r||(r=window._),t.exports=r},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},function(t,e,n){var r;try{r=n(115)}catch(t){}r||(r=window.graphlib),t.exports=r},function(t,e,n){var r=n(63),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();t.exports=i},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}},function(t,e,n){var r=n(20),o=n(49);t.exports=function(t){return null!=t&&o(t.length)&&!r(t)}},function(t,e,n){var r=n(174),o=n(184),i=n(14),a=n(1),s=n(191);t.exports=function(t){return"function"==typeof t?t:null==t?i:"object"==typeof t?a(t)?o(t[0],t[1]):r(t):s(t)}},function(t,e,n){var r=n(66),o=n(51),i=n(8);t.exports=function(t){return i(t)?r(t):o(t)}},function(t,e,n){var r=n(128),o=n(134);t.exports=function(t,e){var n=o(t,e);return r(n)?n:void 0}},function(t,e,n){var r=n(16),o=n(130),i=n(131),a=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":a&&a in Object(t)?o(t):i(t)}},function(t,e,n){var r=n(66),o=n(154),i=n(8);t.exports=function(t){return i(t)?r(t,!0):o(t)}},function(t,e){t.exports=function(t){return t}},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e}},function(t,e,n){var r=n(6).Symbol;t.exports=r},function(t,e,n){(function(t){var r=n(6),o=n(150),i=e&&!e.nodeType&&e,a=i&&"object"==typeof t&&t&&!t.nodeType&&t,s=a&&a.exports===i?r.Buffer:void 0,u=(s?s.isBuffer:void 0)||o;t.exports=u}).call(this,n(48)(t))},function(t,e,n){var r=n(159),o=n(45),i=n(160),a=n(75),s=n(161),u=n(12),c=n(64),d=c(r),f=c(o),h=c(i),p=c(a),l=c(s),g=u;(r&&"[object DataView]"!=g(new r(new ArrayBuffer(1)))||o&&"[object Map]"!=g(new o)||i&&"[object Promise]"!=g(i.resolve())||a&&"[object Set]"!=g(new a)||s&&"[object WeakMap]"!=g(new s))&&(g=function(t){var e=u(t),n="[object Object]"==e?t.constructor:void 0,r=n?c(n):"";if(r)switch(r){case d:return"[object DataView]";case f:return"[object Map]";case h:return"[object Promise]";case p:return"[object Set]";case l:return"[object WeakMap]"}return e}),t.exports=g},function(t,e,n){var r=n(12),o=n(7);t.exports=function(t){return"symbol"==typeof t||o(t)&&"[object Symbol]"==r(t)}},function(t,e,n){var r=n(12),o=n(4);t.exports=function(t){if(!o(t))return!1;var e=r(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e}},function(t,e,n){var r=n(30),o=n(31);t.exports=function(t,e,n,i){var a=!n;n||(n={});for(var s=-1,u=e.length;++s<u;){var c=e[s],d=i?i(n[c],t[c],c,n,t):void 0;void 0===d&&(d=t[c]),a?o(n,c,d):r(n,c,d)}return n}},function(t,e,n){var r=n(149),o=n(7),i=Object.prototype,a=i.hasOwnProperty,s=i.propertyIsEnumerable,u=r(function(){return arguments}())?r:function(t){return o(t)&&a.call(t,"callee")&&!s.call(t,"callee")};t.exports=u},function(t,e,n){var r=n(151),o=n(33),i=n(50),a=i&&i.isTypedArray,s=a?o(a):r;t.exports=s},function(t,e,n){var r=n(19);t.exports=function(t){if("string"==typeof t||r(t))return t;var e=t+"";return"0"==e&&1/t==-1/0?"-0":e}},function(t,e,n){var r=n(26),o=n(123),i=n(124),a=n(125),s=n(126),u=n(127);function c(t){var e=this.__data__=new r(t);this.size=e.size}c.prototype.clear=o,c.prototype.delete=i,c.prototype.get=a,c.prototype.has=s,c.prototype.set=u,t.exports=c},function(t,e,n){var r=n(118),o=n(119),i=n(120),a=n(121),s=n(122);function u(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}u.prototype.clear=r,u.prototype.delete=o,u.prototype.get=i,u.prototype.has=a,u.prototype.set=s,t.exports=u},function(t,e,n){var r=n(15);t.exports=function(t,e){for(var n=t.length;n--;)if(r(t[n][0],e))return n;return-1}},function(t,e,n){var r=n(11)(Object,"create");t.exports=r},function(t,e,n){var r=n(143);t.exports=function(t,e){var n=t.__data__;return r(e)?n["string"==typeof e?"string":"hash"]:n.map}},function(t,e,n){var r=n(31),o=n(15),i=Object.prototype.hasOwnProperty;t.exports=function(t,e,n){var a=t[e];i.call(t,e)&&o(a,n)&&(void 0!==n||e in t)||r(t,e,n)}},function(t,e,n){var r=n(65);t.exports=function(t,e,n){"__proto__"==e&&r?r(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}},function(t,e){var n=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var r=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==r||"symbol"!=r&&n.test(t))&&t>-1&&t%1==0&&t<e}},function(t,e){t.exports=function(t){return function(e){return t(e)}}},function(t,e){var n=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||n)}},function(t,e,n){var r=n(67)(Object.getPrototypeOf,Object);t.exports=r},function(t,e,n){var r=n(56),o=n(172)(r);t.exports=o},function(t,e,n){var r=n(38),o=n(24);t.exports=function(t,e){for(var n=0,i=(e=r(e,t)).length;null!=t&&n<i;)t=t[o(e[n++])];return n&&n==i?t:void 0}},function(t,e,n){var r=n(1),o=n(59),i=n(186),a=n(90);t.exports=function(t,e){return r(t)?t:o(t,e)?[t]:i(a(t))}},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}},function(t,e,n){var r=n(14),o=n(99),i=n(100);t.exports=function(t,e){return i(o(t,e,r),t+"")}},function(t,e,n){var r=n(15),o=n(8),i=n(32),a=n(4);t.exports=function(t,e,n){if(!a(n))return!1;var s=typeof e;return!!("number"==s?o(n)&&i(e,n.length):"string"==s&&e in n)&&r(n[e],t)}},function(t,e,n){"use strict";var r=n(0);t.exports={longestPath:function(t){var e={};r.forEach(t.sources(),(function n(o){var i=t.node(o);if(r.has(e,o))return i.rank;e[o]=!0;var a=r.min(r.map(t.outEdges(o),(function(e){return n(e.w)-t.edge(e).minlen})));return a!==Number.POSITIVE_INFINITY&&null!=a||(a=0),i.rank=a}))},slack:function(t,e){return t.node(e.w).rank-t.node(e.v).rank-t.edge(e).minlen}}},function(t,e,n){t.exports={graphlib:n(5),layout:n(229),debug:n(290),util:{time:n(2).time,notime:n(2).notime},version:n(291)}},function(t,e,n){"use strict";var r=n(3);t.exports=o;function o(t){this._isDirected=!r.has(t,"directed")||t.directed,this._isMultigraph=!!r.has(t,"multigraph")&&t.multigraph,this._isCompound=!!r.has(t,"compound")&&t.compound,this._label=void 0,this._defaultNodeLabelFn=r.constant(void 0),this._defaultEdgeLabelFn=r.constant(void 0),this._nodes={},this._isCompound&&(this._parent={},this._children={},this._children["\0"]={}),this._in={},this._preds={},this._out={},this._sucs={},this._edgeObjs={},this._edgeLabels={}}function i(t,e){t[e]?t[e]++:t[e]=1}function a(t,e){--t[e]||delete t[e]}function s(t,e,n,o){var i=""+e,a=""+n;if(!t&&i>a){var s=i;i=a,a=s}return i+""+a+""+(r.isUndefined(o)?"\0":o)}function u(t,e,n,r){var o=""+e,i=""+n;if(!t&&o>i){var a=o;o=i,i=a}var s={v:o,w:i};return r&&(s.name=r),s}function c(t,e){return s(t,e.v,e.w,e.name)}o.prototype._nodeCount=0,o.prototype._edgeCount=0,o.prototype.isDirected=function(){return this._isDirected},o.prototype.isMultigraph=function(){return this._isMultigraph},o.prototype.isCompound=function(){return this._isCompound},o.prototype.setGraph=function(t){return this._label=t,this},o.prototype.graph=function(){return this._label},o.prototype.setDefaultNodeLabel=function(t){return r.isFunction(t)||(t=r.constant(t)),this._defaultNodeLabelFn=t,this},o.prototype.nodeCount=function(){return this._nodeCount},o.prototype.nodes=function(){return r.keys(this._nodes)},o.prototype.sources=function(){var t=this;return r.filter(this.nodes(),(function(e){return r.isEmpty(t._in[e])}))},o.prototype.sinks=function(){var t=this;return r.filter(this.nodes(),(function(e){return r.isEmpty(t._out[e])}))},o.prototype.setNodes=function(t,e){var n=arguments,o=this;return r.each(t,(function(t){n.length>1?o.setNode(t,e):o.setNode(t)})),this},o.prototype.setNode=function(t,e){return r.has(this._nodes,t)?(arguments.length>1&&(this._nodes[t]=e),this):(this._nodes[t]=arguments.length>1?e:this._defaultNodeLabelFn(t),this._isCompound&&(this._parent[t]="\0",this._children[t]={},this._children["\0"][t]=!0),this._in[t]={},this._preds[t]={},this._out[t]={},this._sucs[t]={},++this._nodeCount,this)},o.prototype.node=function(t){return this._nodes[t]},o.prototype.hasNode=function(t){return r.has(this._nodes,t)},o.prototype.removeNode=function(t){var e=this;if(r.has(this._nodes,t)){var n=function(t){e.removeEdge(e._edgeObjs[t])};delete this._nodes[t],this._isCompound&&(this._removeFromParentsChildList(t),delete this._parent[t],r.each(this.children(t),(function(t){e.setParent(t)})),delete this._children[t]),r.each(r.keys(this._in[t]),n),delete this._in[t],delete this._preds[t],r.each(r.keys(this._out[t]),n),delete this._out[t],delete this._sucs[t],--this._nodeCount}return this},o.prototype.setParent=function(t,e){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(r.isUndefined(e))e="\0";else{for(var n=e+="";!r.isUndefined(n);n=this.parent(n))if(n===t)throw new Error("Setting "+e+" as parent of "+t+" would create a cycle");this.setNode(e)}return this.setNode(t),this._removeFromParentsChildList(t),this._parent[t]=e,this._children[e][t]=!0,this},o.prototype._removeFromParentsChildList=function(t){delete this._children[this._parent[t]][t]},o.prototype.parent=function(t){if(this._isCompound){var e=this._parent[t];if("\0"!==e)return e}},o.prototype.children=function(t){if(r.isUndefined(t)&&(t="\0"),this._isCompound){var e=this._children[t];if(e)return r.keys(e)}else{if("\0"===t)return this.nodes();if(this.hasNode(t))return[]}},o.prototype.predecessors=function(t){var e=this._preds[t];if(e)return r.keys(e)},o.prototype.successors=function(t){var e=this._sucs[t];if(e)return r.keys(e)},o.prototype.neighbors=function(t){var e=this.predecessors(t);if(e)return r.union(e,this.successors(t))},o.prototype.isLeaf=function(t){return 0===(this.isDirected()?this.successors(t):this.neighbors(t)).length},o.prototype.filterNodes=function(t){var e=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});e.setGraph(this.graph());var n=this;r.each(this._nodes,(function(n,r){t(r)&&e.setNode(r,n)})),r.each(this._edgeObjs,(function(t){e.hasNode(t.v)&&e.hasNode(t.w)&&e.setEdge(t,n.edge(t))}));var o={};return this._isCompound&&r.each(e.nodes(),(function(t){e.setParent(t,function t(r){var i=n.parent(r);return void 0===i||e.hasNode(i)?(o[r]=i,i):i in o?o[i]:t(i)}(t))})),e},o.prototype.setDefaultEdgeLabel=function(t){return r.isFunction(t)||(t=r.constant(t)),this._defaultEdgeLabelFn=t,this},o.prototype.edgeCount=function(){return this._edgeCount},o.prototype.edges=function(){return r.values(this._edgeObjs)},o.prototype.setPath=function(t,e){var n=this,o=arguments;return r.reduce(t,(function(t,r){return o.length>1?n.setEdge(t,r,e):n.setEdge(t,r),r})),this},o.prototype.setEdge=function(){var t,e,n,o,a=!1,c=arguments[0];"object"==typeof c&&null!==c&&"v"in c?(t=c.v,e=c.w,n=c.name,2===arguments.length&&(o=arguments[1],a=!0)):(t=c,e=arguments[1],n=arguments[3],arguments.length>2&&(o=arguments[2],a=!0)),t=""+t,e=""+e,r.isUndefined(n)||(n=""+n);var d=s(this._isDirected,t,e,n);if(r.has(this._edgeLabels,d))return a&&(this._edgeLabels[d]=o),this;if(!r.isUndefined(n)&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(t),this.setNode(e),this._edgeLabels[d]=a?o:this._defaultEdgeLabelFn(t,e,n);var f=u(this._isDirected,t,e,n);return t=f.v,e=f.w,Object.freeze(f),this._edgeObjs[d]=f,i(this._preds[e],t),i(this._sucs[t],e),this._in[e][d]=f,this._out[t][d]=f,this._edgeCount++,this},o.prototype.edge=function(t,e,n){var r=1===arguments.length?c(this._isDirected,arguments[0]):s(this._isDirected,t,e,n);return this._edgeLabels[r]},o.prototype.hasEdge=function(t,e,n){var o=1===arguments.length?c(this._isDirected,arguments[0]):s(this._isDirected,t,e,n);return r.has(this._edgeLabels,o)},o.prototype.removeEdge=function(t,e,n){var r=1===arguments.length?c(this._isDirected,arguments[0]):s(this._isDirected,t,e,n),o=this._edgeObjs[r];return o&&(t=o.v,e=o.w,delete this._edgeLabels[r],delete this._edgeObjs[r],a(this._preds[e],t),a(this._sucs[t],e),delete this._in[e][r],delete this._out[t][r],this._edgeCount--),this},o.prototype.inEdges=function(t,e){var n=this._in[t];if(n){var o=r.values(n);return e?r.filter(o,(function(t){return t.v===e})):o}},o.prototype.outEdges=function(t,e){var n=this._out[t];if(n){var o=r.values(n);return e?r.filter(o,(function(t){return t.w===e})):o}},o.prototype.nodeEdges=function(t,e){var n=this.inEdges(t,e);if(n)return n.concat(this.outEdges(t,e))}},function(t,e,n){var r=n(11)(n(6),"Map");t.exports=r},function(t,e,n){var r=n(135),o=n(142),i=n(144),a=n(145),s=n(146);function u(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}u.prototype.clear=r,u.prototype.delete=o,u.prototype.get=i,u.prototype.has=a,u.prototype.set=s,t.exports=u},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););return t}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}},function(t,e,n){(function(t){var r=n(63),o=e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,a=i&&i.exports===o&&r.process,s=function(){try{var t=i&&i.require&&i.require("util").types;return t||a&&a.binding&&a.binding("util")}catch(t){}}();t.exports=s}).call(this,n(48)(t))},function(t,e,n){var r=n(34),o=n(152),i=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return o(t);var e=[];for(var n in Object(t))i.call(t,n)&&"constructor"!=n&&e.push(n);return e}},function(t,e,n){var r=n(70),o=n(71),i=Object.prototype.propertyIsEnumerable,a=Object.getOwnPropertySymbols,s=a?function(t){return null==t?[]:(t=Object(t),r(a(t),(function(e){return i.call(t,e)})))}:o;t.exports=s},function(t,e){t.exports=function(t,e){for(var n=-1,r=e.length,o=t.length;++n<r;)t[o+n]=e[n];return t}},function(t,e,n){var r=n(76);t.exports=function(t){var e=new t.constructor(t.byteLength);return new r(e).set(new r(t)),e}},function(t,e){t.exports=function(t){return function(){return t}}},function(t,e,n){var r=n(57),o=n(10);t.exports=function(t,e){return t&&r(t,e,o)}},function(t,e,n){var r=n(171)();t.exports=r},function(t,e){t.exports=function(t){var e=-1,n=Array(t.size);return t.forEach((function(t){n[++e]=t})),n}},function(t,e,n){var r=n(1),o=n(19),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/;t.exports=function(t,e){if(r(t))return!1;var n=typeof t;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!o(t))||(a.test(t)||!i.test(t)||null!=e&&t in Object(e))}},function(t,e,n){var r=n(53),o=n(205);t.exports=function t(e,n,i,a,s){var u=-1,c=e.length;for(i||(i=o),s||(s=[]);++u<c;){var d=e[u];n>0&&i(d)?n>1?t(d,n-1,i,a,s):r(s,d):a||(s[s.length]=d)}return s}},function(t,e,n){var r=n(19);t.exports=function(t,e,n){for(var o=-1,i=t.length;++o<i;){var a=t[o],s=e(a);if(null!=s&&(void 0===u?s==s&&!r(s):n(s,u)))var u=s,c=a}return c}},function(t,e,n){var r=n(25),o=n(47),i=n(30),a=n(147),s=n(153),u=n(68),c=n(69),d=n(156),f=n(157),h=n(73),p=n(158),l=n(18),g=n(162),v=n(163),y=n(78),m=n(1),b=n(17),x=n(167),w=n(4),E=n(169),_=n(10),N=n(13),k={};k["[object Arguments]"]=k["[object Array]"]=k["[object ArrayBuffer]"]=k["[object DataView]"]=k["[object Boolean]"]=k["[object Date]"]=k["[object Float32Array]"]=k["[object Float64Array]"]=k["[object Int8Array]"]=k["[object Int16Array]"]=k["[object Int32Array]"]=k["[object Map]"]=k["[object Number]"]=k["[object Object]"]=k["[object RegExp]"]=k["[object Set]"]=k["[object String]"]=k["[object Symbol]"]=k["[object Uint8Array]"]=k["[object Uint8ClampedArray]"]=k["[object Uint16Array]"]=k["[object Uint32Array]"]=!0,k["[object Error]"]=k["[object Function]"]=k["[object WeakMap]"]=!1,t.exports=function t(e,n,j,S,P,I){var O,M=1&n,C=2&n,$=4&n;if(j&&(O=P?j(e,S,P,I):j(e)),void 0!==O)return O;if(!w(e))return e;var T=m(e);if(T){if(O=g(e),!M)return c(e,O)}else{var D=l(e),A="[object Function]"==D||"[object GeneratorFunction]"==D;if(b(e))return u(e,M);if("[object Object]"==D||"[object Arguments]"==D||A&&!P){if(O=C||A?{}:y(e),!M)return C?f(e,s(O,e)):d(e,a(O,e))}else{if(!k[D])return P?e:{};O=v(e,D,M)}}I||(I=new r);var B=I.get(e);if(B)return B;I.set(e,O),E(e)?e.forEach((function(r){O.add(t(r,n,j,r,e,I))})):x(e)&&e.forEach((function(r,o){O.set(o,t(r,n,j,o,e,I))}));var L=T?void 0:($?C?p:h:C?N:_)(e);return o(L||e,(function(r,o){L&&(r=e[o=r]),i(O,o,t(r,n,j,o,e,I))})),O}},function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(this,n(129))},function(t,e){var n=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},function(t,e,n){var r=n(11),o=function(){try{var t=r(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=o},function(t,e,n){var r=n(148),o=n(22),i=n(1),a=n(17),s=n(32),u=n(23),c=Object.prototype.hasOwnProperty;t.exports=function(t,e){var n=i(t),d=!n&&o(t),f=!n&&!d&&a(t),h=!n&&!d&&!f&&u(t),p=n||d||f||h,l=p?r(t.length,String):[],g=l.length;for(var v in t)!e&&!c.call(t,v)||p&&("length"==v||f&&("offset"==v||"parent"==v)||h&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||s(v,g))||l.push(v);return l}},function(t,e){t.exports=function(t,e){return function(n){return t(e(n))}}},function(t,e,n){(function(t){var r=n(6),o=e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,a=i&&i.exports===o?r.Buffer:void 0,s=a?a.allocUnsafe:void 0;t.exports=function(t,e){if(e)return t.slice();var n=t.length,r=s?s(n):new t.constructor(n);return t.copy(r),r}}).call(this,n(48)(t))},function(t,e){t.exports=function(t,e){var n=-1,r=t.length;for(e||(e=Array(r));++n<r;)e[n]=t[n];return e}},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=0,i=[];++n<r;){var a=t[n];e(a,n,t)&&(i[o++]=a)}return i}},function(t,e){t.exports=function(){return[]}},function(t,e,n){var r=n(53),o=n(35),i=n(52),a=n(71),s=Object.getOwnPropertySymbols?function(t){for(var e=[];t;)r(e,i(t)),t=o(t);return e}:a;t.exports=s},function(t,e,n){var r=n(74),o=n(52),i=n(10);t.exports=function(t){return r(t,i,o)}},function(t,e,n){var r=n(53),o=n(1);t.exports=function(t,e,n){var i=e(t);return o(t)?i:r(i,n(t))}},function(t,e,n){var r=n(11)(n(6),"Set");t.exports=r},function(t,e,n){var r=n(6).Uint8Array;t.exports=r},function(t,e,n){var r=n(54);t.exports=function(t,e){var n=e?r(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)}},function(t,e,n){var r=n(79),o=n(35),i=n(34);t.exports=function(t){return"function"!=typeof t.constructor||i(t)?{}:r(o(t))}},function(t,e,n){var r=n(4),o=Object.create,i=function(){function t(){}return function(e){if(!r(e))return{};if(o)return o(e);t.prototype=e;var n=new t;return t.prototype=void 0,n}}();t.exports=i},function(t,e,n){t.exports=n(81)},function(t,e,n){var r=n(47),o=n(36),i=n(82),a=n(1);t.exports=function(t,e){return(a(t)?r:o)(t,i(e))}},function(t,e,n){var r=n(14);t.exports=function(t){return"function"==typeof t?t:r}},function(t,e,n){var r=n(70),o=n(173),i=n(9),a=n(1);t.exports=function(t,e){return(a(t)?r:o)(t,i(e,3))}},function(t,e,n){var r=n(176),o=n(7);t.exports=function t(e,n,i,a,s){return e===n||(null==e||null==n||!o(e)&&!o(n)?e!=e&&n!=n:r(e,n,i,a,t,s))}},function(t,e,n){var r=n(86),o=n(179),i=n(87);t.exports=function(t,e,n,a,s,u){var c=1&n,d=t.length,f=e.length;if(d!=f&&!(c&&f>d))return!1;var h=u.get(t),p=u.get(e);if(h&&p)return h==e&&p==t;var l=-1,g=!0,v=2&n?new r:void 0;for(u.set(t,e),u.set(e,t);++l<d;){var y=t[l],m=e[l];if(a)var b=c?a(m,y,l,e,t,u):a(y,m,l,t,e,u);if(void 0!==b){if(b)continue;g=!1;break}if(v){if(!o(e,(function(t,e){if(!i(v,e)&&(y===t||s(y,t,n,a,u)))return v.push(e)}))){g=!1;break}}else if(y!==m&&!s(y,m,n,a,u)){g=!1;break}}return u.delete(t),u.delete(e),g}},function(t,e,n){var r=n(46),o=n(177),i=n(178);function a(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new r;++e<n;)this.add(t[e])}a.prototype.add=a.prototype.push=o,a.prototype.has=i,t.exports=a},function(t,e){t.exports=function(t,e){return t.has(e)}},function(t,e,n){var r=n(4);t.exports=function(t){return t==t&&!r(t)}},function(t,e){t.exports=function(t,e){return function(n){return null!=n&&(n[t]===e&&(void 0!==e||t in Object(n)))}}},function(t,e,n){var r=n(189);t.exports=function(t){return null==t?"":r(t)}},function(t,e,n){var r=n(190),o=n(92);t.exports=function(t,e){return null!=t&&o(t,e,r)}},function(t,e,n){var r=n(38),o=n(22),i=n(1),a=n(32),s=n(49),u=n(24);t.exports=function(t,e,n){for(var c=-1,d=(e=r(e,t)).length,f=!1;++c<d;){var h=u(e[c]);if(!(f=null!=t&&n(t,h)))break;t=t[h]}return f||++c!=d?f:!!(d=null==t?0:t.length)&&s(d)&&a(h,d)&&(i(t)||o(t))}},function(t,e){t.exports=function(t){return function(e){return null==e?void 0:e[t]}}},function(t,e,n){var r=n(193),o=n(92);t.exports=function(t,e){return null!=t&&o(t,e,r)}},function(t,e){t.exports=function(t){return void 0===t}},function(t,e,n){var r=n(39),o=n(9),i=n(97),a=n(1);t.exports=function(t,e){return(a(t)?r:i)(t,o(e,3))}},function(t,e,n){var r=n(36),o=n(8);t.exports=function(t,e){var n=-1,i=o(t)?Array(t.length):[];return r(t,(function(t,r,o){i[++n]=e(t,r,o)})),i}},function(t,e,n){var r=n(195),o=n(36),i=n(9),a=n(196),s=n(1);t.exports=function(t,e,n){var u=s(t)?r:a,c=arguments.length<3;return u(t,i(e,4),n,c,o)}},function(t,e,n){var r=n(206),o=Math.max;t.exports=function(t,e,n){return e=o(void 0===e?t.length-1:e,0),function(){for(var i=arguments,a=-1,s=o(i.length-e,0),u=Array(s);++a<s;)u[a]=i[e+a];a=-1;for(var c=Array(e+1);++a<e;)c[a]=i[a];return c[e]=n(u),r(t,this,c)}}},function(t,e,n){var r=n(207),o=n(208)(r);t.exports=o},function(t,e){t.exports=function(t,e,n,r){for(var o=t.length,i=n+(r?1:-1);r?i--:++i<o;)if(e(t[i],i,t))return i;return-1}},function(t,e,n){var r=n(8),o=n(7);t.exports=function(t){return o(t)&&r(t)}},function(t,e,n){var r=n(217),o=n(10);t.exports=function(t){return null==t?[]:r(t,o(t))}},function(t,e,n){var r=n(3),o=n(105);t.exports=function(t,e,n,r){return function(t,e,n,r){var i,a,s={},u=new o,c=function(t){var e=t.v!==i?t.v:t.w,r=s[e],o=n(t),c=a.distance+o;if(o<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+t+" Weight: "+o);c<r.distance&&(r.distance=c,r.predecessor=i,u.decrease(e,c))};t.nodes().forEach((function(t){var n=t===e?0:Number.POSITIVE_INFINITY;s[t]={distance:n},u.add(t,n)}));for(;u.size()>0&&(i=u.removeMin(),(a=s[i]).distance!==Number.POSITIVE_INFINITY);)r(i).forEach(c);return s}(t,String(e),n||i,r||function(e){return t.outEdges(e)})};var i=r.constant(1)},function(t,e,n){var r=n(3);function o(){this._arr=[],this._keyIndices={}}t.exports=o,o.prototype.size=function(){return this._arr.length},o.prototype.keys=function(){return this._arr.map((function(t){return t.key}))},o.prototype.has=function(t){return r.has(this._keyIndices,t)},o.prototype.priority=function(t){var e=this._keyIndices[t];if(void 0!==e)return this._arr[e].priority},o.prototype.min=function(){if(0===this.size())throw new Error("Queue underflow");return this._arr[0].key},o.prototype.add=function(t,e){var n=this._keyIndices;if(t=String(t),!r.has(n,t)){var o=this._arr,i=o.length;return n[t]=i,o.push({key:t,priority:e}),this._decrease(i),!0}return!1},o.prototype.removeMin=function(){this._swap(0,this._arr.length-1);var t=this._arr.pop();return delete this._keyIndices[t.key],this._heapify(0),t.key},o.prototype.decrease=function(t,e){var n=this._keyIndices[t];if(e>this._arr[n].priority)throw new Error("New priority is greater than current priority. Key: "+t+" Old: "+this._arr[n].priority+" New: "+e);this._arr[n].priority=e,this._decrease(n)},o.prototype._heapify=function(t){var e=this._arr,n=2*t,r=n+1,o=t;n<e.length&&(o=e[n].priority<e[o].priority?n:o,r<e.length&&(o=e[r].priority<e[o].priority?r:o),o!==t&&(this._swap(t,o),this._heapify(o)))},o.prototype._decrease=function(t){for(var e,n=this._arr,r=n[t].priority;0!==t&&!(n[e=t>>1].priority<r);)this._swap(t,e),t=e},o.prototype._swap=function(t,e){var n=this._arr,r=this._keyIndices,o=n[t],i=n[e];n[t]=i,n[e]=o,r[i.key]=t,r[o.key]=e}},function(t,e,n){var r=n(3);t.exports=function(t){var e=0,n=[],o={},i=[];return t.nodes().forEach((function(a){r.has(o,a)||function a(s){var u=o[s]={onStack:!0,lowlink:e,index:e++};if(n.push(s),t.successors(s).forEach((function(t){r.has(o,t)?o[t].onStack&&(u.lowlink=Math.min(u.lowlink,o[t].index)):(a(t),u.lowlink=Math.min(u.lowlink,o[t].lowlink))})),u.lowlink===u.index){var c,d=[];do{c=n.pop(),o[c].onStack=!1,d.push(c)}while(s!==c);i.push(d)}}(a)})),i}},function(t,e,n){var r=n(3);function o(t){var e={},n={},o=[];if(r.each(t.sinks(),(function a(s){if(r.has(n,s))throw new i;r.has(e,s)||(n[s]=!0,e[s]=!0,r.each(t.predecessors(s),a),delete n[s],o.push(s))})),r.size(e)!==t.nodeCount())throw new i;return o}function i(){}t.exports=o,o.CycleException=i,i.prototype=new Error},function(t,e,n){var r=n(3);t.exports=function(t,e,n){r.isArray(e)||(e=[e]);var o=(t.isDirected()?t.successors:t.neighbors).bind(t),i=[],a={};return r.each(e,(function(e){if(!t.hasNode(e))throw new Error("Graph does not have node: "+e);!function t(e,n,o,i,a,s){r.has(i,n)||(i[n]=!0,o||s.push(n),r.each(a(n),(function(n){t(e,n,o,i,a,s)})),o&&s.push(n))}(t,e,"post"===n,a,o,i)})),i}},function(t,e,n){var r=n(236);t.exports=function(t){return t?(t=r(t))===1/0||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0}},function(t,e,n){var r=n(60);t.exports=function(t){return(null==t?0:t.length)?r(t,1):[]}},function(t,e,n){var r=n(31),o=n(15);t.exports=function(t,e,n){(void 0!==n&&!o(t[e],n)||void 0===n&&!(e in t))&&r(t,e,n)}},function(t,e){t.exports=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]}},function(t,e){t.exports=function(t,e){return t<e}},function(t,e,n){"use strict";var r=n(0),o=n(5).Graph,i=n(42).slack;function a(t,e){return r.forEach(t.nodes(),(function n(o){r.forEach(e.nodeEdges(o),(function(r){var a=r.v,s=o===a?r.w:a;t.hasNode(s)||i(e,r)||(t.setNode(s,{}),t.setEdge(o,s,{}),n(s))}))})),t.nodeCount()}function s(t,e){return r.minBy(e.edges(),(function(n){if(t.hasNode(n.v)!==t.hasNode(n.w))return i(e,n)}))}function u(t,e,n){r.forEach(t.nodes(),(function(t){e.node(t).rank+=n}))}t.exports=function(t){var e,n,r=new o({directed:!1}),c=t.nodes()[0],d=t.nodeCount();r.setNode(c,{});for(;a(r,t)<d;)e=s(r,t),n=r.hasNode(e.v)?i(t,e):-i(t,e),u(r,t,n);return r}},function(t,e,n){var r=n(116);t.exports={Graph:r.Graph,json:n(219),alg:n(220),version:r.version}},function(t,e,n){t.exports={Graph:n(44),version:n(218)}},function(t,e,n){var r=n(62);t.exports=function(t){return r(t,4)}},function(t,e){t.exports=function(){this.__data__=[],this.size=0}},function(t,e,n){var r=n(27),o=Array.prototype.splice;t.exports=function(t){var e=this.__data__,n=r(e,t);return!(n<0)&&(n==e.length-1?e.pop():o.call(e,n,1),--this.size,!0)}},function(t,e,n){var r=n(27);t.exports=function(t){var e=this.__data__,n=r(e,t);return n<0?void 0:e[n][1]}},function(t,e,n){var r=n(27);t.exports=function(t){return r(this.__data__,t)>-1}},function(t,e,n){var r=n(27);t.exports=function(t,e){var n=this.__data__,o=r(n,t);return o<0?(++this.size,n.push([t,e])):n[o][1]=e,this}},function(t,e,n){var r=n(26);t.exports=function(){this.__data__=new r,this.size=0}},function(t,e){t.exports=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n}},function(t,e){t.exports=function(t){return this.__data__.get(t)}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e,n){var r=n(26),o=n(45),i=n(46);t.exports=function(t,e){var n=this.__data__;if(n instanceof r){var a=n.__data__;if(!o||a.length<199)return a.push([t,e]),this.size=++n.size,this;n=this.__data__=new i(a)}return n.set(t,e),this.size=n.size,this}},function(t,e,n){var r=n(20),o=n(132),i=n(4),a=n(64),s=/^\[object .+?Constructor\]$/,u=Function.prototype,c=Object.prototype,d=u.toString,f=c.hasOwnProperty,h=RegExp("^"+d.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!i(t)||o(t))&&(r(t)?h:s).test(a(t))}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){var r=n(16),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,s=r?r.toStringTag:void 0;t.exports=function(t){var e=i.call(t,s),n=t[s];try{t[s]=void 0;var r=!0}catch(t){}var o=a.call(t);return r&&(e?t[s]=n:delete t[s]),o}},function(t,e){var n=Object.prototype.toString;t.exports=function(t){return n.call(t)}},function(t,e,n){var r,o=n(133),i=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";t.exports=function(t){return!!i&&i in t}},function(t,e,n){var r=n(6)["__core-js_shared__"];t.exports=r},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]}},function(t,e,n){var r=n(136),o=n(26),i=n(45);t.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r}}},function(t,e,n){var r=n(137),o=n(138),i=n(139),a=n(140),s=n(141);function u(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}u.prototype.clear=r,u.prototype.delete=o,u.prototype.get=i,u.prototype.has=a,u.prototype.set=s,t.exports=u},function(t,e,n){var r=n(28);t.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}},function(t,e,n){var r=n(28),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(r){var n=e[t];return"__lodash_hash_undefined__"===n?void 0:n}return o.call(e,t)?e[t]:void 0}},function(t,e,n){var r=n(28),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return r?void 0!==e[t]:o.call(e,t)}},function(t,e,n){var r=n(28);t.exports=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=r&&void 0===e?"__lodash_hash_undefined__":e,this}},function(t,e,n){var r=n(29);t.exports=function(t){var e=r(this,t).delete(t);return this.size-=e?1:0,e}},function(t,e){t.exports=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}},function(t,e,n){var r=n(29);t.exports=function(t){return r(this,t).get(t)}},function(t,e,n){var r=n(29);t.exports=function(t){return r(this,t).has(t)}},function(t,e,n){var r=n(29);t.exports=function(t,e){var n=r(this,t),o=n.size;return n.set(t,e),this.size+=n.size==o?0:1,this}},function(t,e,n){var r=n(21),o=n(10);t.exports=function(t,e){return t&&r(e,o(e),t)}},function(t,e){t.exports=function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}},function(t,e,n){var r=n(12),o=n(7);t.exports=function(t){return o(t)&&"[object Arguments]"==r(t)}},function(t,e){t.exports=function(){return!1}},function(t,e,n){var r=n(12),o=n(49),i=n(7),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,t.exports=function(t){return i(t)&&o(t.length)&&!!a[r(t)]}},function(t,e,n){var r=n(67)(Object.keys,Object);t.exports=r},function(t,e,n){var r=n(21),o=n(13);t.exports=function(t,e){return t&&r(e,o(e),t)}},function(t,e,n){var r=n(4),o=n(34),i=n(155),a=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return i(t);var e=o(t),n=[];for(var s in t)("constructor"!=s||!e&&a.call(t,s))&&n.push(s);return n}},function(t,e){t.exports=function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}},function(t,e,n){var r=n(21),o=n(52);t.exports=function(t,e){return r(t,o(t),e)}},function(t,e,n){var r=n(21),o=n(72);t.exports=function(t,e){return r(t,o(t),e)}},function(t,e,n){var r=n(74),o=n(72),i=n(13);t.exports=function(t){return r(t,i,o)}},function(t,e,n){var r=n(11)(n(6),"DataView");t.exports=r},function(t,e,n){var r=n(11)(n(6),"Promise");t.exports=r},function(t,e,n){var r=n(11)(n(6),"WeakMap");t.exports=r},function(t,e){var n=Object.prototype.hasOwnProperty;t.exports=function(t){var e=t.length,r=new t.constructor(e);return e&&"string"==typeof t[0]&&n.call(t,"index")&&(r.index=t.index,r.input=t.input),r}},function(t,e,n){var r=n(54),o=n(164),i=n(165),a=n(166),s=n(77);t.exports=function(t,e,n){var u=t.constructor;switch(e){case"[object ArrayBuffer]":return r(t);case"[object Boolean]":case"[object Date]":return new u(+t);case"[object DataView]":return o(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return s(t,n);case"[object Map]":return new u;case"[object Number]":case"[object String]":return new u(t);case"[object RegExp]":return i(t);case"[object Set]":return new u;case"[object Symbol]":return a(t)}}},function(t,e,n){var r=n(54);t.exports=function(t,e){var n=e?r(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}},function(t,e){var n=/\w*$/;t.exports=function(t){var e=new t.constructor(t.source,n.exec(t));return e.lastIndex=t.lastIndex,e}},function(t,e,n){var r=n(16),o=r?r.prototype:void 0,i=o?o.valueOf:void 0;t.exports=function(t){return i?Object(i.call(t)):{}}},function(t,e,n){var r=n(168),o=n(33),i=n(50),a=i&&i.isMap,s=a?o(a):r;t.exports=s},function(t,e,n){var r=n(18),o=n(7);t.exports=function(t){return o(t)&&"[object Map]"==r(t)}},function(t,e,n){var r=n(170),o=n(33),i=n(50),a=i&&i.isSet,s=a?o(a):r;t.exports=s},function(t,e,n){var r=n(18),o=n(7);t.exports=function(t){return o(t)&&"[object Set]"==r(t)}},function(t,e){t.exports=function(t){return function(e,n,r){for(var o=-1,i=Object(e),a=r(e),s=a.length;s--;){var u=a[t?s:++o];if(!1===n(i[u],u,i))break}return e}}},function(t,e,n){var r=n(8);t.exports=function(t,e){return function(n,o){if(null==n)return n;if(!r(n))return t(n,o);for(var i=n.length,a=e?i:-1,s=Object(n);(e?a--:++a<i)&&!1!==o(s[a],a,s););return n}}},function(t,e,n){var r=n(36);t.exports=function(t,e){var n=[];return r(t,(function(t,r,o){e(t,r,o)&&n.push(t)})),n}},function(t,e,n){var r=n(175),o=n(183),i=n(89);t.exports=function(t){var e=o(t);return 1==e.length&&e[0][2]?i(e[0][0],e[0][1]):function(n){return n===t||r(n,t,e)}}},function(t,e,n){var r=n(25),o=n(84);t.exports=function(t,e,n,i){var a=n.length,s=a,u=!i;if(null==t)return!s;for(t=Object(t);a--;){var c=n[a];if(u&&c[2]?c[1]!==t[c[0]]:!(c[0]in t))return!1}for(;++a<s;){var d=(c=n[a])[0],f=t[d],h=c[1];if(u&&c[2]){if(void 0===f&&!(d in t))return!1}else{var p=new r;if(i)var l=i(f,h,d,t,e,p);if(!(void 0===l?o(h,f,3,i,p):l))return!1}}return!0}},function(t,e,n){var r=n(25),o=n(85),i=n(180),a=n(182),s=n(18),u=n(1),c=n(17),d=n(23),f="[object Object]",h=Object.prototype.hasOwnProperty;t.exports=function(t,e,n,p,l,g){var v=u(t),y=u(e),m=v?"[object Array]":s(t),b=y?"[object Array]":s(e),x=(m="[object Arguments]"==m?f:m)==f,w=(b="[object Arguments]"==b?f:b)==f,E=m==b;if(E&&c(t)){if(!c(e))return!1;v=!0,x=!1}if(E&&!x)return g||(g=new r),v||d(t)?o(t,e,n,p,l,g):i(t,e,m,n,p,l,g);if(!(1&n)){var _=x&&h.call(t,"__wrapped__"),N=w&&h.call(e,"__wrapped__");if(_||N){var k=_?t.value():t,j=N?e.value():e;return g||(g=new r),l(k,j,n,p,g)}}return!!E&&(g||(g=new r),a(t,e,n,p,l,g))}},function(t,e){t.exports=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}},function(t,e,n){var r=n(16),o=n(76),i=n(15),a=n(85),s=n(181),u=n(58),c=r?r.prototype:void 0,d=c?c.valueOf:void 0;t.exports=function(t,e,n,r,c,f,h){switch(n){case"[object DataView]":if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case"[object ArrayBuffer]":return!(t.byteLength!=e.byteLength||!f(new o(t),new o(e)));case"[object Boolean]":case"[object Date]":case"[object Number]":return i(+t,+e);case"[object Error]":return t.name==e.name&&t.message==e.message;case"[object RegExp]":case"[object String]":return t==e+"";case"[object Map]":var p=s;case"[object Set]":var l=1&r;if(p||(p=u),t.size!=e.size&&!l)return!1;var g=h.get(t);if(g)return g==e;r|=2,h.set(t,e);var v=a(p(t),p(e),r,c,f,h);return h.delete(t),v;case"[object Symbol]":if(d)return d.call(t)==d.call(e)}return!1}},function(t,e){t.exports=function(t){var e=-1,n=Array(t.size);return t.forEach((function(t,r){n[++e]=[r,t]})),n}},function(t,e,n){var r=n(73),o=Object.prototype.hasOwnProperty;t.exports=function(t,e,n,i,a,s){var u=1&n,c=r(t),d=c.length;if(d!=r(e).length&&!u)return!1;for(var f=d;f--;){var h=c[f];if(!(u?h in e:o.call(e,h)))return!1}var p=s.get(t),l=s.get(e);if(p&&l)return p==e&&l==t;var g=!0;s.set(t,e),s.set(e,t);for(var v=u;++f<d;){var y=t[h=c[f]],m=e[h];if(i)var b=u?i(m,y,h,e,t,s):i(y,m,h,t,e,s);if(!(void 0===b?y===m||a(y,m,n,i,s):b)){g=!1;break}v||(v="constructor"==h)}if(g&&!v){var x=t.constructor,w=e.constructor;x==w||!("constructor"in t)||!("constructor"in e)||"function"==typeof x&&x instanceof x&&"function"==typeof w&&w instanceof w||(g=!1)}return s.delete(t),s.delete(e),g}},function(t,e,n){var r=n(88),o=n(10);t.exports=function(t){for(var e=o(t),n=e.length;n--;){var i=e[n],a=t[i];e[n]=[i,a,r(a)]}return e}},function(t,e,n){var r=n(84),o=n(185),i=n(91),a=n(59),s=n(88),u=n(89),c=n(24);t.exports=function(t,e){return a(t)&&s(e)?u(c(t),e):function(n){var a=o(n,t);return void 0===a&&a===e?i(n,t):r(e,a,3)}}},function(t,e,n){var r=n(37);t.exports=function(t,e,n){var o=null==t?void 0:r(t,e);return void 0===o?n:o}},function(t,e,n){var r=n(187),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,a=r((function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(o,(function(t,n,r,o){e.push(r?o.replace(i,"$1"):n||t)})),e}));t.exports=a},function(t,e,n){var r=n(188);t.exports=function(t){var e=r(t,(function(t){return 500===n.size&&n.clear(),t})),n=e.cache;return e}},function(t,e,n){var r=n(46);function o(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError("Expected a function");var n=function(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=t.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(o.Cache||r),n}o.Cache=r,t.exports=o},function(t,e,n){var r=n(16),o=n(39),i=n(1),a=n(19),s=r?r.prototype:void 0,u=s?s.toString:void 0;t.exports=function t(e){if("string"==typeof e)return e;if(i(e))return o(e,t)+"";if(a(e))return u?u.call(e):"";var n=e+"";return"0"==n&&1/e==-1/0?"-0":n}},function(t,e){t.exports=function(t,e){return null!=t&&e in Object(t)}},function(t,e,n){var r=n(93),o=n(192),i=n(59),a=n(24);t.exports=function(t){return i(t)?r(a(t)):o(t)}},function(t,e,n){var r=n(37);t.exports=function(t){return function(e){return r(e,t)}}},function(t,e){var n=Object.prototype.hasOwnProperty;t.exports=function(t,e){return null!=t&&n.call(t,e)}},function(t,e,n){var r=n(51),o=n(18),i=n(22),a=n(1),s=n(8),u=n(17),c=n(34),d=n(23),f=Object.prototype.hasOwnProperty;t.exports=function(t){if(null==t)return!0;if(s(t)&&(a(t)||"string"==typeof t||"function"==typeof t.splice||u(t)||d(t)||i(t)))return!t.length;var e=o(t);if("[object Map]"==e||"[object Set]"==e)return!t.size;if(c(t))return!r(t).length;for(var n in t)if(f.call(t,n))return!1;return!0}},function(t,e){t.exports=function(t,e,n,r){var o=-1,i=null==t?0:t.length;for(r&&i&&(n=t[++o]);++o<i;)n=e(n,t[o],o,t);return n}},function(t,e){t.exports=function(t,e,n,r,o){return o(t,(function(t,o,i){n=r?(r=!1,t):e(n,t,o,i)})),n}},function(t,e,n){var r=n(51),o=n(18),i=n(8),a=n(198),s=n(199);t.exports=function(t){if(null==t)return 0;if(i(t))return a(t)?s(t):t.length;var e=o(t);return"[object Map]"==e||"[object Set]"==e?t.size:r(t).length}},function(t,e,n){var r=n(12),o=n(1),i=n(7);t.exports=function(t){return"string"==typeof t||!o(t)&&i(t)&&"[object String]"==r(t)}},function(t,e,n){var r=n(200),o=n(201),i=n(202);t.exports=function(t){return o(t)?i(t):r(t)}},function(t,e,n){var r=n(93)("length");t.exports=r},function(t,e){var n=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");t.exports=function(t){return n.test(t)}},function(t,e){var n="[\\ud800-\\udfff]",r="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",o="\\ud83c[\\udffb-\\udfff]",i="[^\\ud800-\\udfff]",a="(?:\\ud83c[\\udde6-\\uddff]){2}",s="[\\ud800-\\udbff][\\udc00-\\udfff]",u="(?:"+r+"|"+o+")"+"?",c="[\\ufe0e\\ufe0f]?"+u+("(?:\\u200d(?:"+[i,a,s].join("|")+")[\\ufe0e\\ufe0f]?"+u+")*"),d="(?:"+[i+r+"?",r,a,s,n].join("|")+")",f=RegExp(o+"(?="+o+")|"+d+c,"g");t.exports=function(t){for(var e=f.lastIndex=0;f.test(t);)++e;return e}},function(t,e,n){var r=n(47),o=n(79),i=n(56),a=n(9),s=n(35),u=n(1),c=n(17),d=n(20),f=n(4),h=n(23);t.exports=function(t,e,n){var p=u(t),l=p||c(t)||h(t);if(e=a(e,4),null==n){var g=t&&t.constructor;n=l?p?new g:[]:f(t)&&d(g)?o(s(t)):{}}return(l?r:i)(t,(function(t,r,o){return e(n,t,r,o)})),n}},function(t,e,n){var r=n(60),o=n(40),i=n(209),a=n(102),s=o((function(t){return i(r(t,1,a,!0))}));t.exports=s},function(t,e,n){var r=n(16),o=n(22),i=n(1),a=r?r.isConcatSpreadable:void 0;t.exports=function(t){return i(t)||o(t)||!!(a&&t&&t[a])}},function(t,e){t.exports=function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}},function(t,e,n){var r=n(55),o=n(65),i=n(14),a=o?function(t,e){return o(t,"toString",{configurable:!0,enumerable:!1,value:r(e),writable:!0})}:i;t.exports=a},function(t,e){var n=Date.now;t.exports=function(t){var e=0,r=0;return function(){var o=n(),i=16-(o-r);if(r=o,i>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}},function(t,e,n){var r=n(86),o=n(210),i=n(214),a=n(87),s=n(215),u=n(58);t.exports=function(t,e,n){var c=-1,d=o,f=t.length,h=!0,p=[],l=p;if(n)h=!1,d=i;else if(f>=200){var g=e?null:s(t);if(g)return u(g);h=!1,d=a,l=new r}else l=e?[]:p;t:for(;++c<f;){var v=t[c],y=e?e(v):v;if(v=n||0!==v?v:0,h&&y==y){for(var m=l.length;m--;)if(l[m]===y)continue t;e&&l.push(y),p.push(v)}else d(l,y,n)||(l!==p&&l.push(y),p.push(v))}return p}},function(t,e,n){var r=n(211);t.exports=function(t,e){return!!(null==t?0:t.length)&&r(t,e,0)>-1}},function(t,e,n){var r=n(101),o=n(212),i=n(213);t.exports=function(t,e,n){return e==e?i(t,e,n):r(t,o,n)}},function(t,e){t.exports=function(t){return t!=t}},function(t,e){t.exports=function(t,e,n){for(var r=n-1,o=t.length;++r<o;)if(t[r]===e)return r;return-1}},function(t,e){t.exports=function(t,e,n){for(var r=-1,o=null==t?0:t.length;++r<o;)if(n(e,t[r]))return!0;return!1}},function(t,e,n){var r=n(75),o=n(216),i=n(58),a=r&&1/i(new r([,-0]))[1]==1/0?function(t){return new r(t)}:o;t.exports=a},function(t,e){t.exports=function(){}},function(t,e,n){var r=n(39);t.exports=function(t,e){return r(e,(function(e){return t[e]}))}},function(t,e){t.exports="2.1.8"},function(t,e,n){var r=n(3),o=n(44);function i(t){return r.map(t.nodes(),(function(e){var n=t.node(e),o=t.parent(e),i={v:e};return r.isUndefined(n)||(i.value=n),r.isUndefined(o)||(i.parent=o),i}))}function a(t){return r.map(t.edges(),(function(e){var n=t.edge(e),o={v:e.v,w:e.w};return r.isUndefined(e.name)||(o.name=e.name),r.isUndefined(n)||(o.value=n),o}))}t.exports={write:function(t){var e={options:{directed:t.isDirected(),multigraph:t.isMultigraph(),compound:t.isCompound()},nodes:i(t),edges:a(t)};r.isUndefined(t.graph())||(e.value=r.clone(t.graph()));return e},read:function(t){var e=new o(t.options).setGraph(t.value);return r.each(t.nodes,(function(t){e.setNode(t.v,t.value),t.parent&&e.setParent(t.v,t.parent)})),r.each(t.edges,(function(t){e.setEdge({v:t.v,w:t.w,name:t.name},t.value)})),e}}},function(t,e,n){t.exports={components:n(221),dijkstra:n(104),dijkstraAll:n(222),findCycles:n(223),floydWarshall:n(224),isAcyclic:n(225),postorder:n(226),preorder:n(227),prim:n(228),tarjan:n(106),topsort:n(107)}},function(t,e,n){var r=n(3);t.exports=function(t){var e,n={},o=[];function i(o){r.has(n,o)||(n[o]=!0,e.push(o),r.each(t.successors(o),i),r.each(t.predecessors(o),i))}return r.each(t.nodes(),(function(t){e=[],i(t),e.length&&o.push(e)})),o}},function(t,e,n){var r=n(104),o=n(3);t.exports=function(t,e,n){return o.transform(t.nodes(),(function(o,i){o[i]=r(t,i,e,n)}),{})}},function(t,e,n){var r=n(3),o=n(106);t.exports=function(t){return r.filter(o(t),(function(e){return e.length>1||1===e.length&&t.hasEdge(e[0],e[0])}))}},function(t,e,n){var r=n(3);t.exports=function(t,e,n){return function(t,e,n){var r={},o=t.nodes();return o.forEach((function(t){r[t]={},r[t][t]={distance:0},o.forEach((function(e){t!==e&&(r[t][e]={distance:Number.POSITIVE_INFINITY})})),n(t).forEach((function(n){var o=n.v===t?n.w:n.v,i=e(n);r[t][o]={distance:i,predecessor:t}}))})),o.forEach((function(t){var e=r[t];o.forEach((function(n){var i=r[n];o.forEach((function(n){var r=i[t],o=e[n],a=i[n],s=r.distance+o.distance;s<a.distance&&(a.distance=s,a.predecessor=o.predecessor)}))}))})),r}(t,e||o,n||function(e){return t.outEdges(e)})};var o=r.constant(1)},function(t,e,n){var r=n(107);t.exports=function(t){try{r(t)}catch(t){if(t instanceof r.CycleException)return!1;throw t}return!0}},function(t,e,n){var r=n(108);t.exports=function(t,e){return r(t,e,"post")}},function(t,e,n){var r=n(108);t.exports=function(t,e){return r(t,e,"pre")}},function(t,e,n){var r=n(3),o=n(44),i=n(105);t.exports=function(t,e){var n,a=new o,s={},u=new i;function c(t){var r=t.v===n?t.w:t.v,o=u.priority(r);if(void 0!==o){var i=e(t);i<o&&(s[r]=n,u.decrease(r,i))}}if(0===t.nodeCount())return a;r.each(t.nodes(),(function(t){u.add(t,Number.POSITIVE_INFINITY),a.setNode(t)})),u.decrease(t.nodes()[0],0);var d=!1;for(;u.size()>0;){if(n=u.removeMin(),r.has(s,n))a.setEdge(n,s[n]);else{if(d)throw new Error("Input graph is not connected: "+t);d=!0}t.nodeEdges(n).forEach(c)}return a}},function(t,e,n){"use strict";var r=n(0),o=n(269),i=n(272),a=n(273),s=n(2).normalizeRanks,u=n(275),c=n(2).removeEmptyRanks,d=n(276),f=n(277),h=n(278),p=n(279),l=n(288),g=n(2),v=n(5).Graph;t.exports=function(t,e){var n=e&&e.debugTiming?g.time:g.notime;n("layout",(function(){var e=n("  buildLayoutGraph",(function(){return function(t){var e=new v({multigraph:!0,compound:!0}),n=j(t.graph());return e.setGraph(r.merge({},m,k(n,y),r.pick(n,b))),r.forEach(t.nodes(),(function(n){var o=j(t.node(n));e.setNode(n,r.defaults(k(o,x),w)),e.setParent(n,t.parent(n))})),r.forEach(t.edges(),(function(n){var o=j(t.edge(n));e.setEdge(n,r.merge({},_,k(o,E),r.pick(o,N)))})),e}(t)}));n("  runLayout",(function(){!function(t,e){e("    makeSpaceForEdgeLabels",(function(){!function(t){var e=t.graph();e.ranksep/=2,r.forEach(t.edges(),(function(n){var r=t.edge(n);r.minlen*=2,"c"!==r.labelpos.toLowerCase()&&("TB"===e.rankdir||"BT"===e.rankdir?r.width+=r.labeloffset:r.height+=r.labeloffset)}))}(t)})),e("    removeSelfEdges",(function(){!function(t){r.forEach(t.edges(),(function(e){if(e.v===e.w){var n=t.node(e.v);n.selfEdges||(n.selfEdges=[]),n.selfEdges.push({e:e,label:t.edge(e)}),t.removeEdge(e)}}))}(t)})),e("    acyclic",(function(){o.run(t)})),e("    nestingGraph.run",(function(){d.run(t)})),e("    rank",(function(){a(g.asNonCompoundGraph(t))})),e("    injectEdgeLabelProxies",(function(){!function(t){r.forEach(t.edges(),(function(e){var n=t.edge(e);if(n.width&&n.height){var r=t.node(e.v),o={rank:(t.node(e.w).rank-r.rank)/2+r.rank,e:e};g.addDummyNode(t,"edge-proxy",o,"_ep")}}))}(t)})),e("    removeEmptyRanks",(function(){c(t)})),e("    nestingGraph.cleanup",(function(){d.cleanup(t)})),e("    normalizeRanks",(function(){s(t)})),e("    assignRankMinMax",(function(){!function(t){var e=0;r.forEach(t.nodes(),(function(n){var o=t.node(n);o.borderTop&&(o.minRank=t.node(o.borderTop).rank,o.maxRank=t.node(o.borderBottom).rank,e=r.max(e,o.maxRank))})),t.graph().maxRank=e}(t)})),e("    removeEdgeLabelProxies",(function(){!function(t){r.forEach(t.nodes(),(function(e){var n=t.node(e);"edge-proxy"===n.dummy&&(t.edge(n.e).labelRank=n.rank,t.removeNode(e))}))}(t)})),e("    normalize.run",(function(){i.run(t)})),e("    parentDummyChains",(function(){u(t)})),e("    addBorderSegments",(function(){f(t)})),e("    order",(function(){p(t)})),e("    insertSelfEdges",(function(){!function(t){var e=g.buildLayerMatrix(t);r.forEach(e,(function(e){var n=0;r.forEach(e,(function(e,o){var i=t.node(e);i.order=o+n,r.forEach(i.selfEdges,(function(e){g.addDummyNode(t,"selfedge",{width:e.label.width,height:e.label.height,rank:i.rank,order:o+ ++n,e:e.e,label:e.label},"_se")})),delete i.selfEdges}))}))}(t)})),e("    adjustCoordinateSystem",(function(){h.adjust(t)})),e("    position",(function(){l(t)})),e("    positionSelfEdges",(function(){!function(t){r.forEach(t.nodes(),(function(e){var n=t.node(e);if("selfedge"===n.dummy){var r=t.node(n.e.v),o=r.x+r.width/2,i=r.y,a=n.x-o,s=r.height/2;t.setEdge(n.e,n.label),t.removeNode(e),n.label.points=[{x:o+2*a/3,y:i-s},{x:o+5*a/6,y:i-s},{x:o+a,y:i},{x:o+5*a/6,y:i+s},{x:o+2*a/3,y:i+s}],n.label.x=n.x,n.label.y=n.y}}))}(t)})),e("    removeBorderNodes",(function(){!function(t){r.forEach(t.nodes(),(function(e){if(t.children(e).length){var n=t.node(e),o=t.node(n.borderTop),i=t.node(n.borderBottom),a=t.node(r.last(n.borderLeft)),s=t.node(r.last(n.borderRight));n.width=Math.abs(s.x-a.x),n.height=Math.abs(i.y-o.y),n.x=a.x+n.width/2,n.y=o.y+n.height/2}})),r.forEach(t.nodes(),(function(e){"border"===t.node(e).dummy&&t.removeNode(e)}))}(t)})),e("    normalize.undo",(function(){i.undo(t)})),e("    fixupEdgeLabelCoords",(function(){!function(t){r.forEach(t.edges(),(function(e){var n=t.edge(e);if(r.has(n,"x"))switch("l"!==n.labelpos&&"r"!==n.labelpos||(n.width-=n.labeloffset),n.labelpos){case"l":n.x-=n.width/2+n.labeloffset;break;case"r":n.x+=n.width/2+n.labeloffset}}))}(t)})),e("    undoCoordinateSystem",(function(){h.undo(t)})),e("    translateGraph",(function(){!function(t){var e=Number.POSITIVE_INFINITY,n=0,o=Number.POSITIVE_INFINITY,i=0,a=t.graph(),s=a.marginx||0,u=a.marginy||0;function c(t){var r=t.x,a=t.y,s=t.width,u=t.height;e=Math.min(e,r-s/2),n=Math.max(n,r+s/2),o=Math.min(o,a-u/2),i=Math.max(i,a+u/2)}r.forEach(t.nodes(),(function(e){c(t.node(e))})),r.forEach(t.edges(),(function(e){var n=t.edge(e);r.has(n,"x")&&c(n)})),e-=s,o-=u,r.forEach(t.nodes(),(function(n){var r=t.node(n);r.x-=e,r.y-=o})),r.forEach(t.edges(),(function(n){var i=t.edge(n);r.forEach(i.points,(function(t){t.x-=e,t.y-=o})),r.has(i,"x")&&(i.x-=e),r.has(i,"y")&&(i.y-=o)})),a.width=n-e+s,a.height=i-o+u}(t)})),e("    assignNodeIntersects",(function(){!function(t){r.forEach(t.edges(),(function(e){var n,r,o=t.edge(e),i=t.node(e.v),a=t.node(e.w);o.points?(n=o.points[0],r=o.points[o.points.length-1]):(o.points=[],n=a,r=i),o.points.unshift(g.intersectRect(i,n)),o.points.push(g.intersectRect(a,r))}))}(t)})),e("    reversePoints",(function(){!function(t){r.forEach(t.edges(),(function(e){var n=t.edge(e);n.reversed&&n.points.reverse()}))}(t)})),e("    acyclic.undo",(function(){o.undo(t)}))}(e,n)})),n("  updateInputGraph",(function(){!function(t,e){r.forEach(t.nodes(),(function(n){var r=t.node(n),o=e.node(n);r&&(r.x=o.x,r.y=o.y,e.children(n).length&&(r.width=o.width,r.height=o.height))})),r.forEach(t.edges(),(function(n){var o=t.edge(n),i=e.edge(n);o.points=i.points,r.has(i,"x")&&(o.x=i.x,o.y=i.y)})),t.graph().width=e.graph().width,t.graph().height=e.graph().height}(t,e)}))}))};var y=["nodesep","edgesep","ranksep","marginx","marginy"],m={ranksep:50,edgesep:20,nodesep:50,rankdir:"tb"},b=["acyclicer","ranker","rankdir","align"],x=["width","height"],w={width:0,height:0},E=["minlen","weight","width","height","labeloffset"],_={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},N=["labelpos"];function k(t,e){return r.mapValues(r.pick(t,e),Number)}function j(t){var e={};return r.forEach(t,(function(t,n){e[n.toLowerCase()]=t})),e}},function(t,e,n){var r=n(62);t.exports=function(t){return r(t,5)}},function(t,e,n){var r=n(40),o=n(15),i=n(41),a=n(13),s=Object.prototype,u=s.hasOwnProperty,c=r((function(t,e){t=Object(t);var n=-1,r=e.length,c=r>2?e[2]:void 0;for(c&&i(e[0],e[1],c)&&(r=1);++n<r;)for(var d=e[n],f=a(d),h=-1,p=f.length;++h<p;){var l=f[h],g=t[l];(void 0===g||o(g,s[l])&&!u.call(t,l))&&(t[l]=d[l])}return t}));t.exports=c},function(t,e,n){var r=n(233)(n(234));t.exports=r},function(t,e,n){var r=n(9),o=n(8),i=n(10);t.exports=function(t){return function(e,n,a){var s=Object(e);if(!o(e)){var u=r(n,3);e=i(e),n=function(t){return u(s[t],t,s)}}var c=t(e,n,a);return c>-1?s[u?e[c]:c]:void 0}}},function(t,e,n){var r=n(101),o=n(9),i=n(235),a=Math.max;t.exports=function(t,e,n){var s=null==t?0:t.length;if(!s)return-1;var u=null==n?0:i(n);return u<0&&(u=a(s+u,0)),r(t,o(e,3),u)}},function(t,e,n){var r=n(109);t.exports=function(t){var e=r(t),n=e%1;return e==e?n?e-n:e:0}},function(t,e,n){var r=n(237),o=n(4),i=n(19),a=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,u=/^0o[0-7]+$/i,c=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(i(t))return NaN;if(o(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=o(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=r(t);var n=s.test(t);return n||u.test(t)?c(t.slice(2),n?2:8):a.test(t)?NaN:+t}},function(t,e,n){var r=n(238),o=/^\s+/;t.exports=function(t){return t?t.slice(0,r(t)+1).replace(o,""):t}},function(t,e){var n=/\s/;t.exports=function(t){for(var e=t.length;e--&&n.test(t.charAt(e)););return e}},function(t,e,n){var r=n(57),o=n(82),i=n(13);t.exports=function(t,e){return null==t?t:r(t,o(e),i)}},function(t,e){t.exports=function(t){var e=null==t?0:t.length;return e?t[e-1]:void 0}},function(t,e,n){var r=n(31),o=n(56),i=n(9);t.exports=function(t,e){var n={};return e=i(e,3),o(t,(function(t,o,i){r(n,o,e(t,o,i))})),n}},function(t,e,n){var r=n(61),o=n(243),i=n(14);t.exports=function(t){return t&&t.length?r(t,i,o):void 0}},function(t,e){t.exports=function(t,e){return t>e}},function(t,e,n){var r=n(245),o=n(249)((function(t,e,n){r(t,e,n)}));t.exports=o},function(t,e,n){var r=n(25),o=n(111),i=n(57),a=n(246),s=n(4),u=n(13),c=n(112);t.exports=function t(e,n,d,f,h){e!==n&&i(n,(function(i,u){if(h||(h=new r),s(i))a(e,n,u,d,t,f,h);else{var p=f?f(c(e,u),i,u+"",e,n,h):void 0;void 0===p&&(p=i),o(e,u,p)}}),u)}},function(t,e,n){var r=n(111),o=n(68),i=n(77),a=n(69),s=n(78),u=n(22),c=n(1),d=n(102),f=n(17),h=n(20),p=n(4),l=n(247),g=n(23),v=n(112),y=n(248);t.exports=function(t,e,n,m,b,x,w){var E=v(t,n),_=v(e,n),N=w.get(_);if(N)r(t,n,N);else{var k=x?x(E,_,n+"",t,e,w):void 0,j=void 0===k;if(j){var S=c(_),P=!S&&f(_),I=!S&&!P&&g(_);k=_,S||P||I?c(E)?k=E:d(E)?k=a(E):P?(j=!1,k=o(_,!0)):I?(j=!1,k=i(_,!0)):k=[]:l(_)||u(_)?(k=E,u(E)?k=y(E):p(E)&&!h(E)||(k=s(_))):j=!1}j&&(w.set(_,k),b(k,_,m,x,w),w.delete(_)),r(t,n,k)}}},function(t,e,n){var r=n(12),o=n(35),i=n(7),a=Function.prototype,s=Object.prototype,u=a.toString,c=s.hasOwnProperty,d=u.call(Object);t.exports=function(t){if(!i(t)||"[object Object]"!=r(t))return!1;var e=o(t);if(null===e)return!0;var n=c.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&u.call(n)==d}},function(t,e,n){var r=n(21),o=n(13);t.exports=function(t){return r(t,o(t))}},function(t,e,n){var r=n(40),o=n(41);t.exports=function(t){return r((function(e,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,s=i>2?n[2]:void 0;for(a=t.length>3&&"function"==typeof a?(i--,a):void 0,s&&o(n[0],n[1],s)&&(a=i<3?void 0:a,i=1),e=Object(e);++r<i;){var u=n[r];u&&t(e,u,r,a)}return e}))}},function(t,e,n){var r=n(61),o=n(113),i=n(14);t.exports=function(t){return t&&t.length?r(t,i,o):void 0}},function(t,e,n){var r=n(61),o=n(9),i=n(113);t.exports=function(t,e){return t&&t.length?r(t,o(e,2),i):void 0}},function(t,e,n){var r=n(6);t.exports=function(){return r.Date.now()}},function(t,e,n){var r=n(254),o=n(257)((function(t,e){return null==t?{}:r(t,e)}));t.exports=o},function(t,e,n){var r=n(255),o=n(91);t.exports=function(t,e){return r(t,e,(function(e,n){return o(t,n)}))}},function(t,e,n){var r=n(37),o=n(256),i=n(38);t.exports=function(t,e,n){for(var a=-1,s=e.length,u={};++a<s;){var c=e[a],d=r(t,c);n(d,c)&&o(u,i(c,t),d)}return u}},function(t,e,n){var r=n(30),o=n(38),i=n(32),a=n(4),s=n(24);t.exports=function(t,e,n,u){if(!a(t))return t;for(var c=-1,d=(e=o(e,t)).length,f=d-1,h=t;null!=h&&++c<d;){var p=s(e[c]),l=n;if("__proto__"===p||"constructor"===p||"prototype"===p)return t;if(c!=f){var g=h[p];void 0===(l=u?u(g,p,h):void 0)&&(l=a(g)?g:i(e[c+1])?[]:{})}r(h,p,l),h=h[p]}return t}},function(t,e,n){var r=n(110),o=n(99),i=n(100);t.exports=function(t){return i(o(t,void 0,r),t+"")}},function(t,e,n){var r=n(259)();t.exports=r},function(t,e,n){var r=n(260),o=n(41),i=n(109);t.exports=function(t){return function(e,n,a){return a&&"number"!=typeof a&&o(e,n,a)&&(n=a=void 0),e=i(e),void 0===n?(n=e,e=0):n=i(n),a=void 0===a?e<n?1:-1:i(a),r(e,n,a,t)}}},function(t,e){var n=Math.ceil,r=Math.max;t.exports=function(t,e,o,i){for(var a=-1,s=r(n((e-t)/(o||1)),0),u=Array(s);s--;)u[i?s:++a]=t,t+=o;return u}},function(t,e,n){var r=n(60),o=n(262),i=n(40),a=n(41),s=i((function(t,e){if(null==t)return[];var n=e.length;return n>1&&a(t,e[0],e[1])?e=[]:n>2&&a(e[0],e[1],e[2])&&(e=[e[0]]),o(t,r(e,1),[])}));t.exports=s},function(t,e,n){var r=n(39),o=n(37),i=n(9),a=n(97),s=n(263),u=n(33),c=n(264),d=n(14),f=n(1);t.exports=function(t,e,n){e=e.length?r(e,(function(t){return f(t)?function(e){return o(e,1===t.length?t[0]:t)}:t})):[d];var h=-1;e=r(e,u(i));var p=a(t,(function(t,n,o){return{criteria:r(e,(function(e){return e(t)})),index:++h,value:t}}));return s(p,(function(t,e){return c(t,e,n)}))}},function(t,e){t.exports=function(t,e){var n=t.length;for(t.sort(e);n--;)t[n]=t[n].value;return t}},function(t,e,n){var r=n(265);t.exports=function(t,e,n){for(var o=-1,i=t.criteria,a=e.criteria,s=i.length,u=n.length;++o<s;){var c=r(i[o],a[o]);if(c)return o>=u?c:c*("desc"==n[o]?-1:1)}return t.index-e.index}},function(t,e,n){var r=n(19);t.exports=function(t,e){if(t!==e){var n=void 0!==t,o=null===t,i=t==t,a=r(t),s=void 0!==e,u=null===e,c=e==e,d=r(e);if(!u&&!d&&!a&&t>e||a&&s&&c&&!u&&!d||o&&s&&c||!n&&c||!i)return 1;if(!o&&!a&&!d&&t<e||d&&n&&i&&!o&&!a||u&&n&&i||!s&&i||!c)return-1}return 0}},function(t,e,n){var r=n(90),o=0;t.exports=function(t){var e=++o;return r(t)+e}},function(t,e,n){var r=n(30),o=n(268);t.exports=function(t,e){return o(t||[],e||[],r)}},function(t,e){t.exports=function(t,e,n){for(var r=-1,o=t.length,i=e.length,a={};++r<o;){var s=r<i?e[r]:void 0;n(a,t[r],s)}return a}},function(t,e,n){"use strict";var r=n(0),o=n(270);t.exports={run:function(t){var e="greedy"===t.graph().acyclicer?o(t,function(t){return function(e){return t.edge(e).weight}}(t)):function(t){var e=[],n={},o={};function i(a){r.has(o,a)||(o[a]=!0,n[a]=!0,r.forEach(t.outEdges(a),(function(t){r.has(n,t.w)?e.push(t):i(t.w)})),delete n[a])}return r.forEach(t.nodes(),i),e}(t);r.forEach(e,(function(e){var n=t.edge(e);t.removeEdge(e),n.forwardName=e.name,n.reversed=!0,t.setEdge(e.w,e.v,n,r.uniqueId("rev"))}))},undo:function(t){r.forEach(t.edges(),(function(e){var n=t.edge(e);if(n.reversed){t.removeEdge(e);var r=n.forwardName;delete n.reversed,delete n.forwardName,t.setEdge(e.w,e.v,n,r)}}))}}},function(t,e,n){var r=n(0),o=n(5).Graph,i=n(271);t.exports=function(t,e){if(t.nodeCount()<=1)return[];var n=function(t,e){var n=new o,a=0,s=0;r.forEach(t.nodes(),(function(t){n.setNode(t,{v:t,in:0,out:0})})),r.forEach(t.edges(),(function(t){var r=n.edge(t.v,t.w)||0,o=e(t),i=r+o;n.setEdge(t.v,t.w,i),s=Math.max(s,n.node(t.v).out+=o),a=Math.max(a,n.node(t.w).in+=o)}));var c=r.range(s+a+3).map((function(){return new i})),d=a+1;return r.forEach(n.nodes(),(function(t){u(c,d,n.node(t))})),{graph:n,buckets:c,zeroIdx:d}}(t,e||a),c=function(t,e,n){var r,o=[],i=e[e.length-1],a=e[0];for(;t.nodeCount();){for(;r=a.dequeue();)s(t,e,n,r);for(;r=i.dequeue();)s(t,e,n,r);if(t.nodeCount())for(var u=e.length-2;u>0;--u)if(r=e[u].dequeue()){o=o.concat(s(t,e,n,r,!0));break}}return o}(n.graph,n.buckets,n.zeroIdx);return r.flatten(r.map(c,(function(e){return t.outEdges(e.v,e.w)})),!0)};var a=r.constant(1);function s(t,e,n,o,i){var a=i?[]:void 0;return r.forEach(t.inEdges(o.v),(function(r){var o=t.edge(r),s=t.node(r.v);i&&a.push({v:r.v,w:r.w}),s.out-=o,u(e,n,s)})),r.forEach(t.outEdges(o.v),(function(r){var o=t.edge(r),i=r.w,a=t.node(i);a.in-=o,u(e,n,a)})),t.removeNode(o.v),a}function u(t,e,n){n.out?n.in?t[n.out-n.in+e].enqueue(n):t[t.length-1].enqueue(n):t[0].enqueue(n)}},function(t,e){function n(){var t={};t._next=t._prev=t,this._sentinel=t}function r(t){t._prev._next=t._next,t._next._prev=t._prev,delete t._next,delete t._prev}function o(t,e){if("_next"!==t&&"_prev"!==t)return e}t.exports=n,n.prototype.dequeue=function(){var t=this._sentinel,e=t._prev;if(e!==t)return r(e),e},n.prototype.enqueue=function(t){var e=this._sentinel;t._prev&&t._next&&r(t),t._next=e._next,e._next._prev=t,e._next=t,t._prev=e},n.prototype.toString=function(){for(var t=[],e=this._sentinel,n=e._prev;n!==e;)t.push(JSON.stringify(n,o)),n=n._prev;return"["+t.join(", ")+"]"}},function(t,e,n){"use strict";var r=n(0),o=n(2);t.exports={run:function(t){t.graph().dummyChains=[],r.forEach(t.edges(),(function(e){!function(t,e){var n,r,i,a=e.v,s=t.node(a).rank,u=e.w,c=t.node(u).rank,d=e.name,f=t.edge(e),h=f.labelRank;if(c===s+1)return;for(t.removeEdge(e),i=0,++s;s<c;++i,++s)f.points=[],r={width:0,height:0,edgeLabel:f,edgeObj:e,rank:s},n=o.addDummyNode(t,"edge",r,"_d"),s===h&&(r.width=f.width,r.height=f.height,r.dummy="edge-label",r.labelpos=f.labelpos),t.setEdge(a,n,{weight:f.weight},d),0===i&&t.graph().dummyChains.push(n),a=n;t.setEdge(a,u,{weight:f.weight},d)}(t,e)}))},undo:function(t){r.forEach(t.graph().dummyChains,(function(e){var n,r=t.node(e),o=r.edgeLabel;for(t.setEdge(r.edgeObj,o);r.dummy;)n=t.successors(e)[0],t.removeNode(e),o.points.push({x:r.x,y:r.y}),"edge-label"===r.dummy&&(o.x=r.x,o.y=r.y,o.width=r.width,o.height=r.height),e=n,r=t.node(e)}))}}},function(t,e,n){"use strict";var r=n(42).longestPath,o=n(114),i=n(274);t.exports=function(t){switch(t.graph().ranker){case"network-simplex":s(t);break;case"tight-tree":!function(t){r(t),o(t)}(t);break;case"longest-path":a(t);break;default:s(t)}};var a=r;function s(t){i(t)}},function(t,e,n){"use strict";var r=n(0),o=n(114),i=n(42).slack,a=n(42).longestPath,s=n(5).alg.preorder,u=n(5).alg.postorder,c=n(2).simplify;function d(t){t=c(t),a(t);var e,n=o(t);for(p(n),f(n,t);e=g(n);)y(n,t,e,v(n,t,e))}function f(t,e){var n=u(t,t.nodes());n=n.slice(0,n.length-1),r.forEach(n,(function(n){!function(t,e,n){var r=t.node(n).parent;t.edge(n,r).cutvalue=h(t,e,n)}(t,e,n)}))}function h(t,e,n){var o=t.node(n).parent,i=!0,a=e.edge(n,o),s=0;return a||(i=!1,a=e.edge(o,n)),s=a.weight,r.forEach(e.nodeEdges(n),(function(r){var a,u,c=r.v===n,d=c?r.w:r.v;if(d!==o){var f=c===i,h=e.edge(r).weight;if(s+=f?h:-h,a=n,u=d,t.hasEdge(a,u)){var p=t.edge(n,d).cutvalue;s+=f?-p:p}}})),s}function p(t,e){arguments.length<2&&(e=t.nodes()[0]),l(t,{},1,e)}function l(t,e,n,o,i){var a=n,s=t.node(o);return e[o]=!0,r.forEach(t.neighbors(o),(function(i){r.has(e,i)||(n=l(t,e,n,i,o))})),s.low=a,s.lim=n++,i?s.parent=i:delete s.parent,n}function g(t){return r.find(t.edges(),(function(e){return t.edge(e).cutvalue<0}))}function v(t,e,n){var o=n.v,a=n.w;e.hasEdge(o,a)||(o=n.w,a=n.v);var s=t.node(o),u=t.node(a),c=s,d=!1;s.lim>u.lim&&(c=u,d=!0);var f=r.filter(e.edges(),(function(e){return d===m(t,t.node(e.v),c)&&d!==m(t,t.node(e.w),c)}));return r.minBy(f,(function(t){return i(e,t)}))}function y(t,e,n,o){var i=n.v,a=n.w;t.removeEdge(i,a),t.setEdge(o.v,o.w,{}),p(t),f(t,e),function(t,e){var n=r.find(t.nodes(),(function(t){return!e.node(t).parent})),o=s(t,n);o=o.slice(1),r.forEach(o,(function(n){var r=t.node(n).parent,o=e.edge(n,r),i=!1;o||(o=e.edge(r,n),i=!0),e.node(n).rank=e.node(r).rank+(i?o.minlen:-o.minlen)}))}(t,e)}function m(t,e,n){return n.low<=e.lim&&e.lim<=n.lim}t.exports=d,d.initLowLimValues=p,d.initCutValues=f,d.calcCutValue=h,d.leaveEdge=g,d.enterEdge=v,d.exchangeEdges=y},function(t,e,n){var r=n(0);t.exports=function(t){var e=function(t){var e={},n=0;function o(i){var a=n;r.forEach(t.children(i),o),e[i]={low:a,lim:n++}}return r.forEach(t.children(),o),e}(t);r.forEach(t.graph().dummyChains,(function(n){for(var r=t.node(n),o=r.edgeObj,i=function(t,e,n,r){var o,i,a=[],s=[],u=Math.min(e[n].low,e[r].low),c=Math.max(e[n].lim,e[r].lim);o=n;do{o=t.parent(o),a.push(o)}while(o&&(e[o].low>u||c>e[o].lim));i=o,o=r;for(;(o=t.parent(o))!==i;)s.push(o);return{path:a.concat(s.reverse()),lca:i}}(t,e,o.v,o.w),a=i.path,s=i.lca,u=0,c=a[u],d=!0;n!==o.w;){if(r=t.node(n),d){for(;(c=a[u])!==s&&t.node(c).maxRank<r.rank;)u++;c===s&&(d=!1)}if(!d){for(;u<a.length-1&&t.node(c=a[u+1]).minRank<=r.rank;)u++;c=a[u]}t.setParent(n,c),n=t.successors(n)[0]}}))}},function(t,e,n){var r=n(0),o=n(2);t.exports={run:function(t){var e=o.addDummyNode(t,"root",{},"_root"),n=function(t){var e={};return r.forEach(t.children(),(function(n){!function n(o,i){var a=t.children(o);a&&a.length&&r.forEach(a,(function(t){n(t,i+1)}));e[o]=i}(n,1)})),e}(t),i=r.max(r.values(n))-1,a=2*i+1;t.graph().nestingRoot=e,r.forEach(t.edges(),(function(e){t.edge(e).minlen*=a}));var s=function(t){return r.reduce(t.edges(),(function(e,n){return e+t.edge(n).weight}),0)}(t)+1;r.forEach(t.children(),(function(u){!function t(e,n,i,a,s,u,c){var d=e.children(c);if(!d.length)return void(c!==n&&e.setEdge(n,c,{weight:0,minlen:i}));var f=o.addBorderNode(e,"_bt"),h=o.addBorderNode(e,"_bb"),p=e.node(c);e.setParent(f,c),p.borderTop=f,e.setParent(h,c),p.borderBottom=h,r.forEach(d,(function(r){t(e,n,i,a,s,u,r);var o=e.node(r),d=o.borderTop?o.borderTop:r,p=o.borderBottom?o.borderBottom:r,l=o.borderTop?a:2*a,g=d!==p?1:s-u[c]+1;e.setEdge(f,d,{weight:l,minlen:g,nestingEdge:!0}),e.setEdge(p,h,{weight:l,minlen:g,nestingEdge:!0})})),e.parent(c)||e.setEdge(n,f,{weight:0,minlen:s+u[c]})}(t,e,a,s,i,n,u)})),t.graph().nodeRankFactor=a},cleanup:function(t){var e=t.graph();t.removeNode(e.nestingRoot),delete e.nestingRoot,r.forEach(t.edges(),(function(e){t.edge(e).nestingEdge&&t.removeEdge(e)}))}}},function(t,e,n){var r=n(0),o=n(2);function i(t,e,n,r,i,a){var s={width:0,height:0,rank:a,borderType:e},u=i[e][a-1],c=o.addDummyNode(t,"border",s,n);i[e][a]=c,t.setParent(c,r),u&&t.setEdge(u,c,{weight:1})}t.exports=function(t){r.forEach(t.children(),(function e(n){var o=t.children(n),a=t.node(n);if(o.length&&r.forEach(o,e),r.has(a,"minRank")){a.borderLeft=[],a.borderRight=[];for(var s=a.minRank,u=a.maxRank+1;s<u;++s)i(t,"borderLeft","_bl",n,a,s),i(t,"borderRight","_br",n,a,s)}}))}},function(t,e,n){"use strict";var r=n(0);function o(t){r.forEach(t.nodes(),(function(e){i(t.node(e))})),r.forEach(t.edges(),(function(e){i(t.edge(e))}))}function i(t){var e=t.width;t.width=t.height,t.height=e}function a(t){t.y=-t.y}function s(t){var e=t.x;t.x=t.y,t.y=e}t.exports={adjust:function(t){var e=t.graph().rankdir.toLowerCase();"lr"!==e&&"rl"!==e||o(t)},undo:function(t){var e=t.graph().rankdir.toLowerCase();"bt"!==e&&"rl"!==e||function(t){r.forEach(t.nodes(),(function(e){a(t.node(e))})),r.forEach(t.edges(),(function(e){var n=t.edge(e);r.forEach(n.points,a),r.has(n,"y")&&a(n)}))}(t);"lr"!==e&&"rl"!==e||(!function(t){r.forEach(t.nodes(),(function(e){s(t.node(e))})),r.forEach(t.edges(),(function(e){var n=t.edge(e);r.forEach(n.points,s),r.has(n,"x")&&s(n)}))}(t),o(t))}}},function(t,e,n){"use strict";var r=n(0),o=n(280),i=n(281),a=n(282),s=n(286),u=n(287),c=n(5).Graph,d=n(2);function f(t,e,n){return r.map(e,(function(e){return s(t,e,n)}))}function h(t,e){var n=new c;r.forEach(t,(function(t){var o=t.graph().root,i=a(t,o,n,e);r.forEach(i.vs,(function(e,n){t.node(e).order=n})),u(t,n,i.vs)}))}function p(t,e){r.forEach(e,(function(e){r.forEach(e,(function(e,n){t.node(e).order=n}))}))}t.exports=function(t){var e=d.maxRank(t),n=f(t,r.range(1,e+1),"inEdges"),a=f(t,r.range(e-1,-1,-1),"outEdges"),s=o(t);p(t,s);for(var u,c=Number.POSITIVE_INFINITY,l=0,g=0;g<4;++l,++g){h(l%2?n:a,l%4>=2),s=d.buildLayerMatrix(t);var v=i(t,s);v<c&&(g=0,u=r.cloneDeep(s),c=v)}p(t,u)}},function(t,e,n){"use strict";var r=n(0);t.exports=function(t){var e={},n=r.filter(t.nodes(),(function(e){return!t.children(e).length})),o=r.max(r.map(n,(function(e){return t.node(e).rank}))),i=r.map(r.range(o+1),(function(){return[]}));var a=r.sortBy(n,(function(e){return t.node(e).rank}));return r.forEach(a,(function n(o){if(r.has(e,o))return;e[o]=!0;var a=t.node(o);i[a.rank].push(o),r.forEach(t.successors(o),n)})),i}},function(t,e,n){"use strict";var r=n(0);function o(t,e,n){for(var o=r.zipObject(n,r.map(n,(function(t,e){return e}))),i=r.flatten(r.map(e,(function(e){return r.sortBy(r.map(t.outEdges(e),(function(e){return{pos:o[e.w],weight:t.edge(e).weight}})),"pos")})),!0),a=1;a<n.length;)a<<=1;var s=2*a-1;a-=1;var u=r.map(new Array(s),(function(){return 0})),c=0;return r.forEach(i.forEach((function(t){var e=t.pos+a;u[e]+=t.weight;for(var n=0;e>0;)e%2&&(n+=u[e+1]),u[e=e-1>>1]+=t.weight;c+=t.weight*n}))),c}t.exports=function(t,e){for(var n=0,r=1;r<e.length;++r)n+=o(t,e[r-1],e[r]);return n}},function(t,e,n){var r=n(0),o=n(283),i=n(284),a=n(285);t.exports=function t(e,n,s,u){var c=e.children(n),d=e.node(n),f=d?d.borderLeft:void 0,h=d?d.borderRight:void 0,p={};f&&(c=r.filter(c,(function(t){return t!==f&&t!==h})));var l=o(e,c);r.forEach(l,(function(n){if(e.children(n.v).length){var o=t(e,n.v,s,u);p[n.v]=o,r.has(o,"barycenter")&&(i=n,a=o,r.isUndefined(i.barycenter)?(i.barycenter=a.barycenter,i.weight=a.weight):(i.barycenter=(i.barycenter*i.weight+a.barycenter*a.weight)/(i.weight+a.weight),i.weight+=a.weight))}var i,a}));var g=i(l,s);!function(t,e){r.forEach(t,(function(t){t.vs=r.flatten(t.vs.map((function(t){return e[t]?e[t].vs:t})),!0)}))}(g,p);var v=a(g,u);if(f&&(v.vs=r.flatten([f,v.vs,h],!0),e.predecessors(f).length)){var y=e.node(e.predecessors(f)[0]),m=e.node(e.predecessors(h)[0]);r.has(v,"barycenter")||(v.barycenter=0,v.weight=0),v.barycenter=(v.barycenter*v.weight+y.order+m.order)/(v.weight+2),v.weight+=2}return v}},function(t,e,n){var r=n(0);t.exports=function(t,e){return r.map(e,(function(e){var n=t.inEdges(e);if(n.length){var o=r.reduce(n,(function(e,n){var r=t.edge(n),o=t.node(n.v);return{sum:e.sum+r.weight*o.order,weight:e.weight+r.weight}}),{sum:0,weight:0});return{v:e,barycenter:o.sum/o.weight,weight:o.weight}}return{v:e}}))}},function(t,e,n){"use strict";var r=n(0);t.exports=function(t,e){var n={};return r.forEach(t,(function(t,e){var o=n[t.v]={indegree:0,in:[],out:[],vs:[t.v],i:e};r.isUndefined(t.barycenter)||(o.barycenter=t.barycenter,o.weight=t.weight)})),r.forEach(e.edges(),(function(t){var e=n[t.v],o=n[t.w];r.isUndefined(e)||r.isUndefined(o)||(o.indegree++,e.out.push(n[t.w]))})),function(t){var e=[];function n(t){return function(e){e.merged||(r.isUndefined(e.barycenter)||r.isUndefined(t.barycenter)||e.barycenter>=t.barycenter)&&function(t,e){var n=0,r=0;t.weight&&(n+=t.barycenter*t.weight,r+=t.weight);e.weight&&(n+=e.barycenter*e.weight,r+=e.weight);t.vs=e.vs.concat(t.vs),t.barycenter=n/r,t.weight=r,t.i=Math.min(e.i,t.i),e.merged=!0}(t,e)}}function o(e){return function(n){n.in.push(e),0==--n.indegree&&t.push(n)}}for(;t.length;){var i=t.pop();e.push(i),r.forEach(i.in.reverse(),n(i)),r.forEach(i.out,o(i))}return r.map(r.filter(e,(function(t){return!t.merged})),(function(t){return r.pick(t,["vs","i","barycenter","weight"])}))}(r.filter(n,(function(t){return!t.indegree})))}},function(t,e,n){var r=n(0),o=n(2);function i(t,e,n){for(var o;e.length&&(o=r.last(e)).i<=n;)e.pop(),t.push(o.vs),n++;return n}t.exports=function(t,e){var n=o.partition(t,(function(t){return r.has(t,"barycenter")})),a=n.lhs,s=r.sortBy(n.rhs,(function(t){return-t.i})),u=[],c=0,d=0,f=0;a.sort((h=!!e,function(t,e){return t.barycenter<e.barycenter?-1:t.barycenter>e.barycenter?1:h?e.i-t.i:t.i-e.i})),f=i(u,s,f),r.forEach(a,(function(t){f+=t.vs.length,u.push(t.vs),c+=t.barycenter*t.weight,d+=t.weight,f=i(u,s,f)}));var h;var p={vs:r.flatten(u,!0)};d&&(p.barycenter=c/d,p.weight=d);return p}},function(t,e,n){var r=n(0),o=n(5).Graph;t.exports=function(t,e,n){var i=function(t){var e;for(;t.hasNode(e=r.uniqueId("_root")););return e}(t),a=new o({compound:!0}).setGraph({root:i}).setDefaultNodeLabel((function(e){return t.node(e)}));return r.forEach(t.nodes(),(function(o){var s=t.node(o),u=t.parent(o);(s.rank===e||s.minRank<=e&&e<=s.maxRank)&&(a.setNode(o),a.setParent(o,u||i),r.forEach(t[n](o),(function(e){var n=e.v===o?e.w:e.v,i=a.edge(n,o),s=r.isUndefined(i)?0:i.weight;a.setEdge(n,o,{weight:t.edge(e).weight+s})})),r.has(s,"minRank")&&a.setNode(o,{borderLeft:s.borderLeft[e],borderRight:s.borderRight[e]}))})),a}},function(t,e,n){var r=n(0);t.exports=function(t,e,n){var o,i={};r.forEach(n,(function(n){for(var r,a,s=t.parent(n);s;){if((r=t.parent(s))?(a=i[r],i[r]=s):(a=o,o=s),a&&a!==s)return void e.setEdge(a,s);s=r}}))}},function(t,e,n){"use strict";var r=n(0),o=n(2),i=n(289).positionX;t.exports=function(t){(function(t){var e=o.buildLayerMatrix(t),n=t.graph().ranksep,i=0;r.forEach(e,(function(e){var o=r.max(r.map(e,(function(e){return t.node(e).height})));r.forEach(e,(function(e){t.node(e).y=i+o/2})),i+=o+n}))})(t=o.asNonCompoundGraph(t)),r.forEach(i(t),(function(e,n){t.node(n).x=e}))}},function(t,e,n){"use strict";var r=n(0),o=n(5).Graph,i=n(2);function a(t,e){var n={};return r.reduce(e,(function(e,o){var i=0,a=0,s=e.length,c=r.last(o);return r.forEach(o,(function(e,d){var f=function(t,e){if(t.node(e).dummy)return r.find(t.predecessors(e),(function(e){return t.node(e).dummy}))}(t,e),h=f?t.node(f).order:s;(f||e===c)&&(r.forEach(o.slice(a,d+1),(function(e){r.forEach(t.predecessors(e),(function(r){var o=t.node(r),a=o.order;!(a<i||h<a)||o.dummy&&t.node(e).dummy||u(n,r,e)}))})),a=d+1,i=h)})),o})),n}function s(t,e){var n={};function o(e,o,i,a,s){var c;r.forEach(r.range(o,i),(function(o){c=e[o],t.node(c).dummy&&r.forEach(t.predecessors(c),(function(e){var r=t.node(e);r.dummy&&(r.order<a||r.order>s)&&u(n,e,c)}))}))}return r.reduce(e,(function(e,n){var i,a=-1,s=0;return r.forEach(n,(function(r,u){if("border"===t.node(r).dummy){var c=t.predecessors(r);c.length&&(i=t.node(c[0]).order,o(n,s,u,a,i),s=u,a=i)}o(n,s,n.length,i,e.length)})),n})),n}function u(t,e,n){if(e>n){var r=e;e=n,n=r}var o=t[e];o||(t[e]=o={}),o[n]=!0}function c(t,e,n){if(e>n){var o=e;e=n,n=o}return r.has(t[e],n)}function d(t,e,n,o){var i={},a={},s={};return r.forEach(e,(function(t){r.forEach(t,(function(t,e){i[t]=t,a[t]=t,s[t]=e}))})),r.forEach(e,(function(t){var e=-1;r.forEach(t,(function(t){var u=o(t);if(u.length)for(var d=((u=r.sortBy(u,(function(t){return s[t]}))).length-1)/2,f=Math.floor(d),h=Math.ceil(d);f<=h;++f){var p=u[f];a[t]===t&&e<s[p]&&!c(n,t,p)&&(a[p]=t,a[t]=i[t]=i[p],e=s[p])}}))})),{root:i,align:a}}function f(t,e,n,i,a){var s={},u=function(t,e,n,i){var a=new o,s=t.graph(),u=function(t,e,n){return function(o,i,a){var s,u=o.node(i),c=o.node(a),d=0;if(d+=u.width/2,r.has(u,"labelpos"))switch(u.labelpos.toLowerCase()){case"l":s=-u.width/2;break;case"r":s=u.width/2}if(s&&(d+=n?s:-s),s=0,d+=(u.dummy?e:t)/2,d+=(c.dummy?e:t)/2,d+=c.width/2,r.has(c,"labelpos"))switch(c.labelpos.toLowerCase()){case"l":s=c.width/2;break;case"r":s=-c.width/2}return s&&(d+=n?s:-s),s=0,d}}(s.nodesep,s.edgesep,i);return r.forEach(e,(function(e){var o;r.forEach(e,(function(e){var r=n[e];if(a.setNode(r),o){var i=n[o],s=a.edge(i,r);a.setEdge(i,r,Math.max(u(t,e,o),s||0))}o=e}))})),a}(t,e,n,a),c=a?"borderLeft":"borderRight";function d(t,e){for(var n=u.nodes(),r=n.pop(),o={};r;)o[r]?t(r):(o[r]=!0,n.push(r),n=n.concat(e(r))),r=n.pop()}return d((function(t){s[t]=u.inEdges(t).reduce((function(t,e){return Math.max(t,s[e.v]+u.edge(e))}),0)}),u.predecessors.bind(u)),d((function(e){var n=u.outEdges(e).reduce((function(t,e){return Math.min(t,s[e.w]-u.edge(e))}),Number.POSITIVE_INFINITY),r=t.node(e);n!==Number.POSITIVE_INFINITY&&r.borderType!==c&&(s[e]=Math.max(s[e],n))}),u.successors.bind(u)),r.forEach(i,(function(t){s[t]=s[n[t]]})),s}function h(t,e){return r.minBy(r.values(e),(function(e){var n=Number.NEGATIVE_INFINITY,o=Number.POSITIVE_INFINITY;return r.forIn(e,(function(e,r){var i=function(t,e){return t.node(e).width}(t,r)/2;n=Math.max(e+i,n),o=Math.min(e-i,o)})),n-o}))}function p(t,e){var n=r.values(e),o=r.min(n),i=r.max(n);r.forEach(["u","d"],(function(n){r.forEach(["l","r"],(function(a){var s,u=n+a,c=t[u];if(c!==e){var d=r.values(c);(s="l"===a?o-r.min(d):i-r.max(d))&&(t[u]=r.mapValues(c,(function(t){return t+s})))}}))}))}function l(t,e){return r.mapValues(t.ul,(function(n,o){if(e)return t[e.toLowerCase()][o];var i=r.sortBy(r.map(t,o));return(i[1]+i[2])/2}))}t.exports={positionX:function(t){var e,n=i.buildLayerMatrix(t),o=r.merge(a(t,n),s(t,n)),u={};r.forEach(["u","d"],(function(i){e="u"===i?n:r.values(n).reverse(),r.forEach(["l","r"],(function(n){"r"===n&&(e=r.map(e,(function(t){return r.values(t).reverse()})));var a=("u"===i?t.predecessors:t.successors).bind(t),s=d(t,e,o,a),c=f(t,e,s.root,s.align,"r"===n);"r"===n&&(c=r.mapValues(c,(function(t){return-t}))),u[i+n]=c}))}));var c=h(t,u);return p(u,c),l(u,t.graph().align)},findType1Conflicts:a,findType2Conflicts:s,addConflict:u,hasConflict:c,verticalAlignment:d,horizontalCompaction:f,alignCoordinates:p,findSmallestWidthAlignment:h,balance:l}},function(t,e,n){var r=n(0),o=n(2),i=n(5).Graph;t.exports={debugOrdering:function(t){var e=o.buildLayerMatrix(t),n=new i({compound:!0,multigraph:!0}).setGraph({});return r.forEach(t.nodes(),(function(e){n.setNode(e,{label:e}),n.setParent(e,"layer"+t.node(e).rank)})),r.forEach(t.edges(),(function(t){n.setEdge(t.v,t.w,{},t.name)})),r.forEach(e,(function(t,e){var o="layer"+e;n.setNode(o,{rank:"same"}),r.reduce(t,(function(t,e){return n.setEdge(t,e,{style:"invis"}),e}))})),n}}},function(t,e){t.exports="0.8.5"},function(t,e,n){"use strict";n.r(e),n.d(e,"Graph",(function(){return ht})),n.d(e,"Behavior",(function(){return T})),n.d(e,"Node",(function(){return P})),n.d(e,"Edge",(function(){return I})),n.d(e,"Port",(function(){return S}));var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)};function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}var i=function(){return(i=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};Object.create;function a(t,e,n){if(n||2===arguments.length)for(var r,o=0,i=e.length;o<i;o++)!r&&o in e||(r||(r=Array.prototype.slice.call(e,0,o)),r[o]=e[o]);return t.concat(r||Array.prototype.slice.call(e))}Object.create;var s=function(){function t(){this._events={}}return t.prototype.on=function(t,e){var n=this,r=function(t){n._events[t]||(n._events[t]=[]),n._events[t].push(e)};Array.isArray(t)?t.forEach((function(t){r(t)})):r(t)},t.prototype.emit=function(t){for(var e=this,n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];this._events[t]&&this._events[t].forEach((function(t){t.apply(e,n)}))},t.prototype.off=function(t,e){if(t)if(e){for(var n=this._events[t]||[],r=n.length,o=0;o<r;o++)n[o]===e&&(n.splice(o,1),r--,o--);0===n.length&&delete this._events[t]}else delete this._events[t];else this._events={};return this},t.prototype.getEvent=function(){return this._events},t}(),u=n(43),c=n.n(u),d=function(t){function e(){var e=t.call(this)||this;return e.dagre=null,e.options={},e.outterEdges={},e.groupPadding=[50,20,20,20],e.layout=function(t){var n,r;void 0===t&&(t={});var o,i=e.$graph.getNodes().find((function(t){return t.model.parentId}));if("circle"===t.type)o=e.circleLayout(t);else if(i){(null===(n=t.options)||void 0===n?void 0:n.groupPadding)&&(e.groupPadding=(null===(r=t.options)||void 0===r?void 0:r.groupPadding)||e.groupPadding),o=e.groupLayout(t)}else o=e.dagreLayout(t);return e.emit("layout"),o},e.$graph=ft(),e}return o(e,t),e.prototype.initDagre=function(t){var e=this.$graph;Object.assign(this.options,t),e.set("direction",(null==t?void 0:t.rankdir)||e.direction),this.dagre=new c.a.graphlib.Graph,this.dagre.setGraph(i({width:0,height:0,rankdir:e.direction},this.options)),this.dagre.setDefaultEdgeLabel((function(){return{}}))},e.prototype.dagreLayout=function(t){var e,n,r=this,o=this.$graph;this.initDagre(t.options);var i=(null===(e=t.data)||void 0===e?void 0:e.nodes)||o.getNodes(),a=(null===(n=t.data)||void 0===n?void 0:n.edges)||o.getEdges();i.forEach((function(t){r.dagre.setNode(t.id,{label:"",width:t.width,height:t.height})})),a.forEach((function(t){r.dagre.setEdge(t.fromNodeId,t.toNodeId)})),c.a.layout(this.dagre);var s=this.$graph.getSvgInfo(),u=this.dagre.graph();return this.dagre.nodes().forEach((function(t){var e=o.findNode(t),n=r.dagre.node(t),i=n.x,a=n.y,c=i-e.width/2+s.width/2-u.width/2,d=a-e.height/2+s.height/2-u.height/2;e.updatePosition(c,d)})),this.dagre},e.prototype.groupLayout=function(t){var e;Object.assign(this.options,t.options),this.outterEdges={};var n=((null===(e=t.data)||void 0===e?void 0:e.nodes)||this.$graph.getNodes()).filter((function(t){return!t.model.parentId}));this.layoutCellNode(n)},e.prototype.layoutCellNode=function(t){var e=this,n={},r=t.map((function(t){return t.id}));(t.forEach((function(t){e.layoutCellNode(t.getChildren());var o={};e.outterEdges[t.id]&&e.outterEdges[t.id].forEach((function(t){o[t.id]={id:t.id,fromNodeId:t.model._fromNodeId,toNodeId:t.model._toNodeId,model:{_fromNodeId:t.model._fromNodeId,_toNodeId:t.model._toNodeId}}})),a(a([],t.getEdges(),!0),Object.values(o),!0).forEach((function(o){if(!n[o.id]&&r.includes(o.fromNodeId)&&r.includes(o.toNodeId))n[o.id]=o;else if(!r.includes(o.fromNodeId)||!r.includes(o.toNodeId)){var i=o.model._toNodeId||o.toNodeId,a=o.model._fromNodeId||o.fromNodeId,s=e.$graph.findEdge(o.id),u=t.getParent();u&&(r.includes(o.toNodeId)||(a=u.id),r.includes(o.fromNodeId)||(i=u.id),s&&(s.model._fromNodeId=a,s.model._toNodeId=i),o.model._fromNodeId=a,o.model._toNodeId=i,e.outterEdges[u.id]?e.outterEdges[u.id].push(o):e.outterEdges[u.id]=[o])}}))})),t.length)&&(this.initDagre(this.options),t.forEach((function(t){e.dagre.setNode(t.id,{label:"",width:t.width,height:t.height})})),Object.values(n).forEach((function(t){e.dagre.setEdge(t.fromNodeId,t.toNodeId)})),c.a.layout(this.dagre),this.dagre.nodes().forEach((function(t){var n=e.$graph.findNode(t);if(e.dagre.node(t)){var r=e.dagre.node(t),o=r.x,i=r.y,a=o-n.width/2,s=i-n.height/2;e.moveChildren(n,a-n.x,s-n.y),n.updatePosition(a,s)}})),this.resizeGroup(t[0].getParent()))},e.prototype.moveChildren=function(t,e,n){for(var r=t.getChildren();r.length;){var o=r.shift();if(o){var i=o.x+t.x+e+this.groupPadding[3],a=o.y+t.y+n+this.groupPadding[0];o.updatePosition(i,a);var s=o.getChildren();r.push.apply(r,s)}}},e.prototype.resizeGroup=function(t){if(t){var e=t.getChildren().filter((function(t){return!t.hasState("hide")}));if(e.length){var n=this.$graph.getNodesBBox(e);t.update({width:n.width+this.groupPadding[3]+this.groupPadding[1],height:n.height+this.groupPadding[0]+this.groupPadding[2],x:n.left-this.groupPadding[3],y:n.top-this.groupPadding[0]})}}},e.prototype.circleLayout=function(t){for(var e,n,r=this.$graph,o=Object.assign({},this.options,t.options),i=((null===(e=t.data)||void 0===e?void 0:e.nodes)||r.getNodes()).filter((function(t){return!t.parentId})),a=Math.max.apply(Math,i.map((function(t){return t.width+t.height})))+(o.addRadius||0),s=(n=i.length,(2*Math.PI-2*Math.PI/n)/Math.max(1,n-1)*(!1===o.clockwise?-1:1)),u=0;u<i.length;u++){var c=i[u],d=u*s+(o.startAngle||0),f=a*Math.cos(d),h=a*Math.sin(d);c.updatePosition(f,h)}},e.prototype.destroy=function(){this.dagre=null},e}(s),f=window.document,h={},p=[],l=function(t){h[t]?h[t]+=1:h[t]=1;for(var e=t+h[t];p.includes(e);)h[t]+=1,e=t+h[t];return e},g=function(t){if("object"!=typeof t||null===t)return t;var e;if(Array.isArray(t)){e=[];for(var n=0,r=t.length;n<r;n++)"object"==typeof t[n]&&null!=t[n]?e[n]=g(t[n]):e[n]=t[n]}else for(var o in e={},t)"object"==typeof t[o]&&null!=t[o]?e[o]=g(t[o]):e[o]=t[o];return e},v=function(t,e){var n=[],r=[],o=function(t,e){if(Object.is(t,e))return!0;var i=typeof t;if(i!==typeof e)return!1;if("function"===i)return t.toString()===e.toString();if("object"===i){var a=new Set(Object.keys(t)),s=Object.keys(e);if(!(a.size===s.length&&s.every((function(t){return a.has(t)}))))return!1;var u=[n.indexOf(t),r.indexOf(e)],c=u[0],d=u[1];for(var f in c>-1&&d>-1&&(n.length,r.length),c>-1?n.splice(0,c):n.push(t),d>-1?r.splice(0,c):r.push(e),t)if(!o(t[f],e[f]))return!1;return!0}return t.toString()===e.toString()};return o(t,e)},y=function(t,e){for(var n={},r=0,o=e;r<o.length;r++){var i=o[r];n[i]=t[i]}return n},m=function(t,e){return e instanceof Object&&t in e},b=function(){function t(){this._cfg={},this.eventQueue=[]}return Object.defineProperty(t.prototype,"id",{get:function(){return this.get("id")},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"graph",{get:function(){return this.get("graph")},enumerable:!1,configurable:!0}),t.prototype.get=function(t){return this._cfg[t]},t.prototype.set=function(t,e){this._cfg[t]=e},t.prototype.addEvent=function(t,e){var n=e.bind(this);this.eventQueue.push({type:t,bindFunc:n}),this.graph.on(t,n)},t.prototype.destory=function(){var t=this;this.eventQueue.forEach((function(e){t.graph.off(e.type,e.bindFunc)}))},t}(),x=function(t){function e(){return t.call(this)||this}return o(e,t),Object.defineProperty(e.prototype,"el",{get:function(){return this.get("el")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"parent",{get:function(){return this.get("parent")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"children",{get:function(){return this.get("children")?this.get("children"):[]},enumerable:!1,configurable:!0}),e.prototype.createDom=function(t,e){var n=function(t){return"div"===t?document.createElementNS("http://www.w3.org/1999/xhtml",t):document.createElementNS("http://www.w3.org/2000/svg",t)}(t);return e&&Object.keys(e).forEach((function(t){n.setAttribute(t,e[t])})),n},e.prototype.add=function(t){t.set("parent",this);var e=this.children;e.push(t),this.set("children",e),this.el.appendChild(t.el)},e.prototype.remove=function(t){t?(t.destory(),this.el.removeChild(t.el)):(this.children.forEach((function(t){t.destory()})),this.el.innerHTML="")},e}(b),w=function(t,e,n){void 0===e&&(e="TB"),void 0===n&&(n=!0);var r=t.x1,o=t.y1,i=t.x2,a=t.y2,s="";if("LR"===e){var u=r+(p=(h=Math.abs(i-r)/3*2)<20?20:h),c=o,d=i-p,f=a;s="M ".concat(r," ").concat(o," C ").concat(u," ").concat(c," ").concat(d," ").concat(f," ").concat(i," ").concat(a)}else{var h,p;u=r,c=o+(p=(h=Math.abs(a-o)/3*2)<40?40:h),d=i,f=a-p;s="M ".concat(r," ").concat(o," C ").concat(u," ").concat(c," ").concat(d," ").concat(f," ").concat(i," ").concat(a)}return s},E=function(t){function e(e,n){var r=t.call(this)||this;return r.edge=e,r.set("graph",n),r.draw(),r.initHook(),r}return o(e,t),e.prototype.draw=function(){var t=this.createDom("path",{class:"graph-edge","marker-end":"url(#arrow)"}),e=this.createDom("path",{class:"graph-edge-wrapper","graph-type":"edge","graph-id":this.edge.id}),n=this.createDom("g");n.appendChild(e),n.appendChild(t),this.set("g",n),this.set("edgePath",t),this.set("edgeWrapperPath",e),this.set("el",n),this.setPath()},e.prototype.initHook=function(){this.addEvent("node:moving",this.updatePath),this.addEvent("node:moved",this.updatePath),this.addEvent("layout",this.setPath),this.addEvent("edge:change:selected",this.updateSelect)},e.prototype.updatePath=function(t){[this.edge.fromNode.id,this.edge.toNode.id].includes(t.id)&&this.setPath()},e.prototype.updateSelect=function(){var t=this.get("edgePath");this.edge.hasState("selected")?(t.classList.add("graph-edge-active"),t.setAttribute("marker-end","url(#arrow-active)")):(t.classList.remove("graph-edge-active"),t.setAttribute("marker-end","url(#arrow)"))},e.prototype.update=function(){this.setPath()},e.prototype.setPath=function(){var t,e=this.edge,n=null===(t=e.cfg)||void 0===t?void 0:t.path,r=this.get("edgePath"),o=this.get("edgeWrapperPath"),i="";if(n)i=n(e.fromPort,e.toPort);else{var a=this.graph.direction,s=e.toPort.x,u=e.toPort.y;"LR"===a?s-=4:u-=4,i=w({x1:e.fromPort.x,y1:e.fromPort.y,x2:s,y2:u})}r.setAttribute("d",i),o.setAttribute("d",i),this.updateSelect()},e}(x),_=function(t){function e(e,n,r){var o=t.call(this)||this;return o.port=e,o.node=n,o.set("graph",r),o.draw(),o.drawStyle(),o.initHook(),o}return o(e,t),e.prototype.draw=function(){var t=this.createDom("circle",{class:"graph-port","graph-type":"port","graph-id":this.port.id,r:"4",transform:"translate(".concat(this.port.x,", ").concat(this.port.y,")")});this.node.get("g").appendChild(t),this.set("el",t),this.set("circle",t)},e.prototype.drawStyle=function(){var t=this.get("circle");"out"===this.port.type&&t.classList.add("graph-port-active");var e=this.port.hasState("enable"),n=this.port.hasState("linked");e?(t.classList.add("graph-port-enable"),t.setAttribute("r","6")):(t.classList.remove("graph-port-enable"),t.setAttribute("r","4")),n&&!e?t.classList.add("graph-port-linked"):t.classList.remove("graph-port-linked")},e.prototype.initHook=function(){this.addEvent("edge:connect",this.drawStyle),this.addEvent("datachange",this.drawStyle),this.addEvent("edge:added",this.drawStyle),this.addEvent("mouseup",this.drawStyle)},e.prototype.updateTransform=function(){this.get("circle").setAttribute("transform","translate(".concat(this.port.x,", ").concat(this.port.y,")"))},e}(x),N=function(t){function e(e,n){var r=t.call(this)||this;return r.node=e,r.set("graph",n),r.draw(),r.drawPort(),r.initHook(),r}return o(e,t),e.prototype.draw=function(){this.drawDom();var t=this.get("div"),e=this.createDom("foreignObject",{width:"".concat(this.node.width),height:"".concat(this.node.height),"graph-type":"node","graph-id":"".concat(this.node.id)}),n=this.createDom("g",{transform:"translate(".concat(this.node.x,", ").concat(this.node.y,")")}),r=this.createDom("g");e.appendChild(t),n.appendChild(e),r.appendChild(n),this.set("nodeWrapper",n),this.set("g",r),this.set("foreignObject",e),this.set("el",r)},e.prototype.drawDom=function(){var t=this.node.cfg.html,e=document.createElement("div");if(t){var n=t(this.node);n&&("string"==typeof n?(e.insertAdjacentHTML("afterbegin",n),e=e.firstElementChild):e=n)}else e.classList.add("graph-node"),e.innerHTML=this.node.model.label;this.set("div",e)},e.prototype.drawPort=function(){var t=this,e=[];this.node.ports.forEach((function(n){e.push(new _(n,t,t.graph))})),this.ports=e},e.prototype.initHook=function(){this.addEvent("node:moving",this.updateTransform),this.addEvent("node:moved",this.updateTransform),this.addEvent("layout",this.transform),this.addEvent("node:change:selected",this.updateSelect),this.addEvent("brushing",this.updateSelect)},e.prototype.updateTransform=function(t){t.id===this.node.id&&(this.node=t,this.transform())},e.prototype.transform=function(){this.get("nodeWrapper").setAttribute("transform","translate(".concat(this.node.x,", ").concat(this.node.y,")")),this.ports.forEach((function(t){t.updateTransform()}))},e.prototype.updateSelect=function(){var t=this.get("div");this.node.hasState("selected")?t.classList.add("graph-node-active"):t.classList.remove("graph-node-active")},e.prototype.update=function(t){this.node=t,this.drawDom();var e=this.get("foreignObject"),n=this.get("div");e.setAttribute("width",this.node.width),e.setAttribute("height",this.node.height),e.innerHTML="",e.appendChild(n),this.updateSelect(),this.transform()},e}(x),k=function(t){function e(e){var n,r=t.call(this)||this;return r._cfg={id:"",model:{},states:{selected:!1,linked:!1,enable:!1,locked:!1,hide:!1}},r.set("model",e),void 0!==e.id&&(r.set("id",String(e.id)),/(node|edge|port)\d+/.test(e.id)&&(n=e.id,p.push(n))),r}return o(e,t),e.prototype.get=function(t){return this._cfg[t]},e.prototype.set=function(t,e){this._cfg[t]=e},Object.defineProperty(e.prototype,"id",{get:function(){return this.get("id")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"model",{get:function(){return this.get("model")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"view",{get:function(){return this.get("view")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"zIndex",{get:function(){return Number(this.get("zIndex"))||0},set:function(t){this.set("zIndex",t)},enumerable:!1,configurable:!0}),e.prototype.setZIndex=function(t){this.model.zIndex&&(this.model.zIndex=t),this.set("zIndex",t),this.emit("change",this,"zIndex")},e.prototype.setState=function(t){this.hasState(t)||(this.getStates()[t]=!0,this.emit("change",this,t))},e.prototype.hasState=function(t){return this.getStates()[t]},e.prototype.getStates=function(){return this.get("states")},e.prototype.clearState=function(t){this.hasState(t)&&(this.getStates()[t]=!1,this.emit("change",this,t))},e}(s),j={TB:{in:"top",out:"bottom"},LR:{in:"left",out:"right"},BT:{in:"bottom",out:"top"},RL:{in:"right",out:"left"}},S=function(t){function e(e,n){var r=t.call(this,e)||this;if(r.onNodeChange=function(t,e,n){"position"===e&&r.update(r.x+n.moveX,r.y+n.moveY)},!r.id){var o=l("port");r.set("id",o),r.model.id=r.id}return r.$store=n.store,r.set("x",n.x),r.set("y",n.y),r.set("type",e.type),r.set("position",e.position),r}return o(e,t),e.computePosition=function(t,e,n){void 0===n&&(n=.5);var r=0,o=0;switch(e){case"left":r=t.x,o=t.y+t.height*n;break;case"right":r=t.x+t.width,o=t.y+t.height*n;break;case"top":r=t.x+t.width*n,o=t.y;break;case"bottom":r=t.x+t.width*n,o=t.y+t.height;break;case"center":r=t.x+t.width/2,o=t.y+t.height/2}return{x:r,y:o}},e.computePositions=function(t,n,r){var o={left:0,right:0,top:0,bottom:0,center:0};return t.map((function(t){var e=t.type,n=t.position||e&&j[r][e]||"center",i={position:n,index:o[n]};return o[n]++,i})).map((function(t){var r=t.position,i=t.index,a=e.computePosition(n,r,(i+1)/(o[r]+1));return{x:a.x,y:a.y}}))},Object.defineProperty(e.prototype,"x",{get:function(){return this.get("x")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"y",{get:function(){return this.get("y")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"type",{get:function(){return this.get("type")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"nodeId",{get:function(){var t=e.containerMap.get(this);return null==t?void 0:t.id},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"position",{get:function(){return this.get("position")},enumerable:!1,configurable:!0}),e.prototype.update=function(t,e){this.set("x",t),this.set("y",e)},e.prototype.setupNode=function(t){e.containerMap.set(this,t),t.on("change",this.onNodeChange)},e.prototype.remove=function(){var t=e.containerMap.get(this);t&&t.off("change",this.onNodeChange),e.containerMap.delete(this),this.$store.remove(this.id,e),this.emit("removed",this),this.off()},e.containerMap=new WeakMap,e}(k),P=function(t){function e(e,n){var r=t.call(this,e)||this;if(r.edgeIdSet=new Set,r.onPortChange=function(t,e){r.emit("port:change",t,e)},!r.id){var o=l("node");r.set("id",o),r.model.id=r.id}return r.set("cfg",n),r.$store=n.store,r.set("direction",n.direction),r.set("width",e.width||n.width),r.set("height",e.height||n.height),r.set("zIndex",e.zIndex||0),r.set("parentId",e.parentId&&String(e.parentId)),r.set("x",e.x||0),r.set("y",e.y||0),r.addPorts(r.model.ports||[{type:"in"},{type:"out"}]),r}return o(e,t),Object.defineProperty(e.prototype,"cfg",{get:function(){return this.get("cfg")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"parentId",{get:function(){return this.get("parentId")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"x",{get:function(){return this.get("x")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"y",{get:function(){return this.get("y")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"width",{get:function(){return this.get("width")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"height",{get:function(){return this.get("height")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"bbox",{get:function(){return{x:this.x,y:this.y,width:this.get("width"),height:this.get("height")}},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"ports",{get:function(){return this.$store.node_ports.getMany(this)||[]},enumerable:!1,configurable:!0}),e.prototype.getEdges=function(){var t=this.$store.getEdgeMap();return Array.from(this.edgeIdSet).map((function(e){return t[e]}))},e.prototype.getInEdges=function(){var t=this;return this.getEdges().filter((function(e){return e.toNode.id===t.id}))},e.prototype.getOutEdges=function(){var t=this;return this.getEdges().filter((function(e){return e.fromNode.id===t.id}))},e.prototype.lock=function(){this.setState("locked")},e.prototype.unlock=function(){this.clearState("locaked")},e.prototype.show=function(){this.clearState("hide"),this.getEdges().forEach((function(t){t.clearState("hide")}))},e.prototype.hide=function(){this.setState("hide"),this.getEdges().forEach((function(t){t.setState("hide")}))},e.prototype.deleteChild=function(t){var e=this.getChildren().findIndex((function(e){return e.id===t}));e>-1&&this.getChildren().splice(e,1)},e.prototype.getChildren=function(){return this.$store.node_nodes.getMany(this)||[]},e.prototype.addChild=function(t){this.$store.add(t),this.$store.node_nodes.add(t,this),t.set("parent",this)},e.prototype.getParent=function(){return this.get("parent")},e.prototype.getSourceNodes=function(){var t=[];return this.getInEdges().forEach((function(e){t.push(e.fromNode)})),t},e.prototype.getTargetNodes=function(){var t=[];return this.getOutEdges().forEach((function(e){t.push(e.toNode)})),t},e.prototype.getAllSourceNodes=function(){for(var t,e=((t={})[this.id]=!0,t),n=this.getSourceNodes(),r=0;r<n.length;){var o=n[r];if(e[o.id])break;e[o.id]=!0,n.push.apply(n,n[r].getSourceNodes()),r++}return n},e.prototype.getAllTargetNodes=function(){for(var t,e=((t={})[this.id]=!0,t),n=this.getTargetNodes(),r=0;r<n.length;){var o=n[r];if(e[o.id])break;e[o.id]=!0,n.push.apply(n,n[r].getTargetNodes()),r++}return n},e.prototype.addEdge=function(t){this.$store.add(t),this.edgeIdSet.add(t.id)},e.prototype.deleteEdge=function(t){this.edgeIdSet.delete(t)},e.prototype.updatePosition=function(t,e){var n=t-this.x,r=e-this.y;this.set("x",t),this.set("y",e),(this.model.x||this.model.y)&&(this.model.x=t,this.model.y=e),this.emit("change",this,"position",{moveX:n,moveY:r})},e.prototype.update=function(t){if(t.x||t.y){var e=t.x||this.x,n=t.y||this.y;this.updatePosition(e,n)}(t.width||t.height)&&(this.set("width",t.width||this.width),this.set("height",t.height||this.height),this.model.width=this.width,this.model.height=this.height,this.emit("change",this,"size")),this.updatePorts(),this.getEdges().forEach((function(t){t.update()})),this.emit("change",this,"model")},e.prototype.refresh=function(){this.get("view").update(this),this.getEdges().forEach((function(t){t.refresh()}))},e.prototype.addPorts=function(t){var e=this,n=t.map((function(t){var n=new S(t,{x:0,y:0,store:e.$store});return e.$store.add(n),e.$store.node_ports.add(n,e),n.setupNode(e),n.on("change",e.onPortChange),n}));this.updatePorts(),this.emit("port:added",n)},e.prototype.deletePorts=function(t){for(var e=0;e<t.length;e++){var n=t[e],r=this.$store.findPort(n);r&&this.$store.node_ports.getOne(r)===this&&(r.off("change",this.onPortChange),r.remove(),this.$store.node_ports.remove(r))}this.emit("port:deleted",t)},e.prototype.updatePorts=function(t){t&&this.set("direction",t);var e=S.computePositions(this.ports,this.bbox,this.get("direction"));this.ports.forEach((function(t,n){var r=e[n];t.update(r.x,r.y)}))},e.prototype.remove=function(){this.getEdges().forEach((function(t){return t.remove()})),this.$store.remove(this.id,e),this.emit("removed",this),this.off()},e}(k),I=function(t){function e(e,n){var r=t.call(this,e)||this;if(r._itemMap={},r.$store=n.store,void 0!==e.id&&r.$store.findEdge(e.id))throw new Error("can't add edge, exist edge where id is ".concat(e.id));var o=e.fromPortId,i=e.toPortId,a=e.fromNodeId,s=e.toNodeId,u=void 0!==a&&r.$store.findNode(a)||void 0!==o&&r.$store.findNodeByPort(o),c=void 0!==s&&r.$store.findNode(s)||void 0!==i&&r.$store.findNodeByPort(i);if(!u||!c)throw new Error("please check the edge from ".concat(a," to ").concat(s));if(!r.id){var d=l("edge");r.set("id",d),r.model.id=r.id}return r.set("cfg",n),r.fromNodeId=u.id,r.toNodeId=c.id,r.setPoint(),r.fromNode.addEdge(r),r.toNode.addEdge(r),r.$store.fromPort_edges.on("change",(function(t){t.many===r&&r.emit("change",r)})),r}return o(e,t),Object.defineProperty(e.prototype,"cfg",{get:function(){return this.get("cfg")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"fromNode",{get:function(){return this.$store.findNode(this.fromNodeId)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"toNode",{get:function(){return this.$store.findNode(this.toNodeId)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"fromPort",{get:function(){return this._itemMap.fromPort},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"toPort",{get:function(){return this._itemMap.toPort},enumerable:!1,configurable:!0}),e.prototype.matchPort=function(t){var e="out"===t?{portId:String(this.model.fromPortId),node:this.fromNode}:{portId:String(this.model.toPortId),node:this.toNode};return e.node.ports.find((function(n){return!n.type||n.type===t&&(!e.node.id||e.portId&&n.id===e.portId)}))||e.node.ports.find((function(e){return e.type===t}))},e.prototype.setPoint=function(){var t=this.matchPort("out");t.setState("linked"),this._itemMap.fromPort=t,this.$store.fromPort_edges.add(this,t);var e=this.matchPort("in");e.setState("linked"),this._itemMap.toPort=e,this.$store.toPort_edges.add(this,e)},e.prototype.update=function(t){t&&(delete t.fromNodeId,delete t.toNodeId,delete t.fromPortId,delete t.toPortId,Object.assign(this.model,t)),this.setPoint()},e.prototype.refresh=function(){this.get("view").update()},e.prototype.remove=function(){var t=this.fromNode,n=this.toNode,r=this.fromPort,o=this.toPort;t.deleteEdge(this.id),n.deleteEdge(this.id),t.getEdges().find((function(t){return t.fromPort.id===r.id}))||r.clearState("linked"),n.getEdges().find((function(t){return t.toPort.id===o.id}))||o.clearState("linked"),this.$store.remove(this.id,e),this.emit("removed",this),this.off()},e}(k),O=function(t){return t instanceof P?"nodeGroup":t instanceof I?"edgeGroup":void 0},M=function(){function t(){var t=this;this.svgInfo={x:0,y:0,width:0,height:0},this.transform={scale:1,translateX:0,translateY:0,offsetX:0,offsetY:0},this.translatePadding=10,this.translateTo=function(e,n){var r=t.nodesBox,o=r.left,i=r.top,a=r.width,s=r.height,u=-(t.transform.translateX+o+a/2)+e,c=-(t.transform.translateY+i+s/2)+n;t.translateBy(u,c)},this.$graph=ft(),this.$store=ft().store,this.$svg=this.$graph.getContainer().querySelector("svg"),this.resizeObserver=new ResizeObserver(this.$graph.resize.bind(this.$graph)),this.resizeObserver.observe(this.$graph.container),this.resize()}return t.prototype.mountItem=function(t){var e,n=this.$graph;if(null==n?void 0:n.isRender){var r=O(t);if(r){var o=null===(e=n.$svg)||void 0===e?void 0:e.get(r);if(o){var i=function(t,e){return t instanceof P?new N(t,e):t instanceof I?new E(t,e):void 0}(t,n);i&&(o.add(i),this.$store.viewMap.set(t,i))}}}},t.prototype.unMountItem=function(t){var e,n=this.$graph;if(null==n?void 0:n.isRender){var r=O(t);if(r){var o=null===(e=n.$svg)||void 0===e?void 0:e.get(r);if(o){var i=this.$store.viewMap.get(t);i&&(o.remove(i),this.$store.viewMap.delete(t))}}}},t.prototype.onAdd=function(t,e){e&&e!==t&&this.onRemove(e),this.mountItem(t)},t.prototype.onRemove=function(t){this.unMountItem(t)},t.prototype.getTranslate=function(){return{x:this.transform.translateX,y:this.transform.translateY}},t.prototype.getZoom=function(){return this.transform.scale},t.prototype.zoom=function(t,e){var n=this.getZoom();if(n<t&&n<5||n>t&&n>.2){var r=0,o=0;if(e){var i=this.svgInfo,a=1/n-1/t;r=(i.x+i.width/2-e.x)*a,o=(i.y+i.height/2-e.y)*a}this.transform.scale=t,this.translateBy(r,o),this.caculateOffset(),this.$graph.emit("zoom",t,e)}},t.prototype.updateSvgInfo=function(){var t=this.$svg.getBoundingClientRect();Object.assign(this.svgInfo,{x:t.left,y:t.top,width:t.width,height:t.height})},t.prototype.fullScreen=function(t){f.fullscreenElement||f.mozFullScreenElement||f.webkitFullscreenElement||f.msFullscreenElement?(f.exitFullscreen||f.mozCancelFullScreen||f.webkitExitFullscreen||f.msExitFullscreen).call(f):function(t){(t.requestFullscreen||t.mozRequestFullScreen||t.webkitRequestFullscreen||t.msRequestFullscreen).call(t)}(t||this.$svg.parentElement),this.updateSvgInfo()},t.prototype.fitView=function(){var t,e=this;this.translateToCenter(),(t=.95*Math.min(e.svgInfo.height/e.nodesBox.height,e.svgInfo.width/e.nodesBox.width))!==e.getZoom()&&e.zoom(t)},Object.defineProperty(t.prototype,"nodesBox",{get:function(){return this.getNodesBBox()},enumerable:!1,configurable:!0}),t.prototype.getNodesBBox=function(t){var e=(t||this.$graph.getNodes()).filter((function(t){return!t.hasState("hide")}));if(!e.length)return{left:0,top:0,width:0,height:0};for(var n=e[0],r=[n.x,n.y,n.x+n.width,n.y+n.height],o=r[0],i=r[1],a=r[2],s=r[3],u=e.length-1;u>0;u--){var c=e[u];o=Math.min(o,c.x),i=Math.min(i,c.y),a=Math.max(a,c.x+c.width),s=Math.max(s,c.y+c.height)}return{left:o,top:i,width:a-o,height:s-i}},t.prototype.caculateOffset=function(){this.transform.offsetX=this.svgInfo.width*(this.transform.scale-1)/2,this.transform.offsetY=this.svgInfo.height*(this.transform.scale-1)/2},t.prototype.translateToCenter=function(){this.updateSvgInfo();var t=this.svgInfo,e=t.width,n=t.height;this.translateTo(e/2,n/2)},t.prototype.fitTo=function(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.updateSvgInfo();var n=this.svgInfo.width/2,r=this.svgInfo.height/2,o=-this.transform.translateX+n-t,i=-this.transform.translateY+r-e;this.translateBy(o,i)},t.prototype.translateX=function(t){var e=this.transform.translateX+t,n=this.svgInfo.width/2,r=n-this.nodesBox.left;if(e<0){var o=r-n/this.transform.scale-this.nodesBox.width+this.translatePadding;e=Math.max(e,o)}else if(e>0){var i=r+n/this.transform.scale-this.translatePadding;e=Math.min(e,i)}this.transform.translateX=e},t.prototype.translateY=function(t){var e=this.transform.translateY+t,n=this.svgInfo.height/2,r=n-this.nodesBox.top;if(e<0){var o=r-n/this.transform.scale-this.nodesBox.height+this.translatePadding;e=Math.max(e,o)}else if(e>0){var i=r+n/this.transform.scale-this.translatePadding;e=Math.min(e,i)}this.transform.translateY=e},t.prototype.translateBy=function(t,e){this.translateX(t),this.translateY(e),this.$graph.emit("translate",this.transform.translateX,this.transform.translateY)},t.prototype.getPointByClient=function(t,e){var n=t-this.svgInfo.x,r=e-this.svgInfo.y;return{x:(n+this.transform.offsetX)/this.transform.scale-this.transform.translateX,y:(r+this.transform.offsetY)/this.transform.scale-this.transform.translateY}},t.prototype.resize=function(){var t=this.svgInfo.width,e=this.svgInfo.height;if(this.updateSvgInfo(),t&&e){var n=(this.svgInfo.width-t)*this.transform.scale/2,r=(this.svgInfo.height-e)*this.transform.scale/2;this.translateBy(n,r),this.caculateOffset()}},t.prototype.destroy=function(){this.resizeObserver.disconnect(),this.$svg=null},t}(),C=function(t){return t.path||t.composedPath&&t.composedPath()},$=function(t,e,n){if(t&&"function"==typeof t.addEventListener)return t.addEventListener(e,n,{passive:!1,capture:!1}),{remove:function(){t.removeEventListener(e,n,!1)}}},T=function(){function t(t){this.eventQueue=[],this.graph=t}return t.prototype.addEvent=function(t,e){var n=e.bind(this);this.eventQueue.push({type:t,bindFunc:n}),this.graph.on(t,n)},t.prototype.destory=function(){for(var t=this.eventQueue.length-1;t>=0;t--){var e=this.eventQueue[t];this.graph.off(e.type,e.bindFunc)}},t}(),D=function(t){function e(e){var n=t.call(this,e)||this;return n.isMoving=!1,n.startX=0,n.startY=0,n.moveX=0,n.moveY=0,n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("blank:mousedown",this.mouseDown),this.addEvent("mousemove",this.mouseMove),this.addEvent("mouseup",this.mouseUp),this.addEvent("mouseleave",this.mouseUp)},e.prototype.mouseDown=function(){this.graph.get("brushing")||(this.isMoving=!0)},e.prototype.mouseMove=function(t){var e=t.x,n=t.y;if(this.isMoving){this.moveX=e-this.startX,this.moveY=n-this.startY;var r=this.graph.getZoom(),o=this.moveX/r,i=this.moveY/r;this.graph.translate(o,i)}this.startX=e,this.startY=n},e.prototype.mouseUp=function(){this.isMoving=!1},e}(T),A={"drag-blank":D,"drag-node":function(t){function e(e){var n=t.call(this,e)||this;return n.isMoving=!1,n.moveNode=[],n.originX=0,n.originY=0,n.startX=0,n.startY=0,n.moveX=0,n.moveY=0,n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("node:mousedown",this.mouseDown),this.addEvent("mousemove",this.mouseMove),this.addEvent("mouseup",this.mouseUp),this.addEvent("mouseleave",this.mouseUp)},e.prototype.mouseDown=function(t){var e=t.e,n=t.target;this.graph.stackStart(),this.activeNode=n,this.activeNode&&(this.isMoving=!this.activeNode.hasState("locked")&&0===e.button,this.moveNode=[this.activeNode]),this.originX=this.startX=e.x,this.originY=this.startY=e.y,this.checkActiveNodeIsSelected()},e.prototype.mouseMove=function(t){var e=this,n=t.x,r=t.y;this.isMoving&&(this.moveX=n-this.startX,this.moveY=r-this.startY,this.moveNode.forEach((function(t){var n=e.graph.getZoom(),r=t.x+e.moveX/n,o=t.y+e.moveY/n;t.updatePosition(r,o);for(var i=t.getChildren();i.length;){var a=i.shift();if(a){var s=a.x+e.moveX/n,u=a.y+e.moveY/n;a.updatePosition(s,u);var c=a.getChildren();i.push.apply(i,c)}}e.graph.emit("node:moving",t)}))),this.startX=n,this.startY=r},e.prototype.mouseUp=function(t){var e=this,n=t.x-this.originX,r=t.y-this.originY,o=!(Math.abs(n)<2&&Math.abs(r)<2&&0===t.button);this.isMoving&&o&&this.moveNode.forEach((function(t){e.graph.emit("node:moved",t)})),this.isMoving=!1,this.graph.stackEnd()},e.prototype.checkActiveNodeIsSelected=function(){if(this.activeNode&&this.activeNode.hasState("selected")){var t=this.graph.findNodeByState("selected");this.moveNode=t}},e}(T),"click-select":function(t){function e(e){var n=t.call(this,e)||this;return n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("node:click",this.clickNode),this.addEvent("edge:click",this.clickEdge),this.addEvent("blank:click",this.clickBlank)},e.prototype.clickNode=function(t){var e=t.target;if(t.e.shiftKey){if(this.resetEdgeSelect(),!e||e.hasState("locked"))return;e.hasState("selected")?e.clearState("selected"):e.setState("selected")}else{var n=this.graph.findNodeByState("selected");if(n.findIndex((function(t){return t.id===(null==e?void 0:e.id)}))>-1)return;this.resetEdgeSelect(),n.forEach((function(t){return t.clearState("selected")})),e&&!e.hasState("locked")&&e.setState("selected")}},e.prototype.clickEdge=function(t){var e=t.target,n=this.graph.findEdgeByState("selected");n.findIndex((function(t){return t.id===(null==e?void 0:e.id)}))>-1||(this.resetNodeSelect(),n.forEach((function(t){return t.clearState("selected")})),e&&e.setState("selected"))},e.prototype.clickBlank=function(t){this.resetNodeSelect(),this.resetEdgeSelect()},e.prototype.resetNodeSelect=function(){var t=this.graph.getNodes(),e=[];t.forEach((function(t){t.hasState("selected")&&(e.push(t),t.clearState("selected"))}))},e.prototype.resetEdgeSelect=function(){var t=this.graph.getEdges(),e=[];t.forEach((function(t){t.hasState("selected")&&(e.push(t),t.clearState("selected"))})),e.length},e}(T),"connect-edge":function(t){function e(e){var n=t.call(this,e)||this;return n.isMoveing=!1,n.createEdge={fromPoint:{x:0,y:0},toPoint:{x:0,y:0}},n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("port:mousedown",this.portMouseDown),this.addEvent("mousemove",this.mouseMove),this.addEvent("port:mouseup",this.portMouseUp),this.addEvent("mouseup",this.mouseUp)},e.prototype.portMouseDown=function(t){var e=t.target;if(e&&"in"!==e.type){var n=this.graph.findNode(e.nodeId||"");if(n){var r=e.x,o=e.y;this.setNewEdgeStart(r,o),this.setNewEdgeMove(r,o),this.fromPort=e,this.fromNode=n,this.setEnablePort(),this.graph.emit("edge:connect",e)}}},e.prototype.mouseMove=function(t){if(this.isMoveing){var e=this.graph.getPointByClient(t.x,t.y),n=e.x,r=e.y;this.setNewEdgeMove(n,r),this.graph.emit("edge:connecting",this.createEdge)}},e.prototype.portMouseUp=function(t){var e=t.e,n=t.target;e.stopPropagation();var r=n;if(r){if(r.hasState("enable")){var o=this.graph.findNode(r.nodeId||"");if(!o)return;var i={fromNodeId:this.fromNode.model.id||this.fromNode.id,toNodeId:o.id};this.fromNode.model.ports&&Object.assign(i,{fromPortId:this.fromPort.model.id||this.fromPort.id}),o.model.ports&&Object.assign(i,{toPortId:r.id}),this.graph.emit("edge:connected",i)}this.setResetEdge(),this.graph.emit("edge:connecting",null)}},e.prototype.mouseUp=function(){this.isMoveing&&(this.setResetEdge(),this.graph.emit("edge:connecting",null))},e.prototype.setEnablePort=function(){var t=this;this.graph.getNodes().forEach((function(e){e.ports.forEach((function(n){"in"!==n.type||e.id===t.fromNode.id||t.isDirectLinked(n)||n.setState("enable")}))}))},e.prototype.isDirectLinked=function(t){for(var e=!1,n=0,r=this.fromNode.getEdges();n<r.length;n++){var o=r[n];if(e=o.fromPort.id===this.fromPort.id&&o.toPort.id===t.id)break}return e},e.prototype.setNewEdgeStart=function(t,e){this.isMoveing=!0,this.createEdge.fromPoint.x=t,this.createEdge.fromPoint.y=e},e.prototype.setNewEdgeMove=function(t,e){this.createEdge.toPoint.x=t,this.createEdge.toPoint.y=e},e.prototype.setResetEdge=function(){this.isMoveing=!1,this.createEdge.fromPoint={x:0,y:0},this.createEdge.toPoint={x:0,y:0},this.graph.getNodes().forEach((function(t){t.ports.forEach((function(t){t.hasState("enable")&&t.clearState("enable")}))}))},e}(T),"wheel-move":function(t){function e(e){var n=t.call(this,e)||this;return n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("wheel",this.onWheel)},e.prototype.onWheel=function(t){if(!t.ctrlKey){t.preventDefault();var e=this.graph.getZoom();this.graph.translate(-t.deltaX/e,-t.deltaY/e)}},e}(T),"wheel-zoom":function(t){function e(e){var n=t.call(this,e)||this;return n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("wheel",this.onWheel)},e.prototype.onWheel=function(t){if(t.ctrlKey){t.preventDefault();var e=this.graph.getZoom();t.wheelDelta>0?e+=.05*e:e-=.05*e,this.graph.zoom(e,t)}},e}(T),"brush-select":function(t){function e(e){var n=t.call(this,e)||this;return n.originX=0,n.originY=0,n.moving=!1,n.beforeSelectedNodes=[],n.afterSelectedNodes=[],n.init(),n}return o(e,t),e.prototype.init=function(){this.addEvent("blank:mousedown",this.onMouseDown),this.addEvent("mousemove",this.onMouseMove),this.addEvent("mouseup",this.onMouseUp)},e.prototype.onMouseDown=function(t){var e=t.e;this.originX=e.x,this.originY=e.y,this.graph.get("brushing")&&(this.moving=!0,this.beforeSelectedNodes=this.graph.findNodeByState("selected"))},e.prototype.onMouseMove=function(t){if(this.moving){var e=this.graph.getSvgInfo(),n=e.x,r=e.y,o=this.originX-n,i=this.originY-r,a=t.x-n,s=t.y-r,u="M".concat(o,",").concat(i,"H").concat(a,"V").concat(s,"H").concat(o,"Z");this.graph.emit("brushing",u),this.checkSelected(this.originX,this.originY,t.x,t.y)}},e.prototype.onMouseUp=function(){this.moving=!1,this.graph.emit("brushing","")},e.prototype.checkSelected=function(t,e,n,r){var o,i,a=this;t>n&&(t=(o=[n,t])[0],n=o[1]),e>r&&(e=(i=[r,e])[0],r=i[1]);var s=this.graph.getPointByClient(t,e),u=this.graph.getPointByClient(n,r),c={startX:s.x,startY:s.y,endX:u.x,endY:u.y},d=this.graph.getNodes().filter((function(t){return!t.getChildren().length}));this.afterSelectedNodes=d.filter((function(t){return a.checkNodeRange(t,c)}))},e.prototype.checkNodeRange=function(t,e){var n=!(t.y+t.height<e.startY||t.y>e.endY||t.x+t.width<e.startX||t.x>e.endX);return n&&!t.hasState("locked")?t.setState("selected"):t.clearState("selected"),n},e}(T)},B=["mousedown","mouseup","dblclick","contextmenu","mouseenter","mouseout","mouseover","mousemove","mouseleave","drag","dragover","dragenter","dragleave","drop","wheel"],L=["keyup","keydown"],z=["node:added","edge:added","node:deleted","edge:deleted","node:moved","layout","node:change","edge:change","port:change","port:added","port:deleted"],R=function(){function t(){this.eventQueue=[],this.preItemType="svg",this.currentItemType="svg",this.behaveInstance={},this.originX=0,this.originY=0,this.$graph=ft();var t=this.$graph.getContainer().querySelector("svg");if(!t)throw new ReferenceError("找不到svg");this.$svg=t,this.addBehavior(),this.defaultEmit(),this.initEvent()}return t.prototype.initEvent=function(){var t=this;B.forEach((function(e){t.eventQueue.push($(t.$svg,e,t.handleMouseEvent.bind(t)))})),L.forEach((function(e){t.eventQueue.push($(window,e,t.handleExtendEvents.bind(t)))}))},t.prototype.addBehavior=function(t){var e=this,n=this.$graph,r=t||n.cfg.action;r&&(r.forEach((function(t){var r=A[t];if(r&&!e.behaveInstance[t]){var o=new r(n);o&&(e.behaveInstance[t]=o)}})),n.set("action",Object.keys(this.behaveInstance)))},t.prototype.removeBehavior=function(t){var e=this;if(!t)return Object.keys(this.behaveInstance).forEach((function(t){e.behaveInstance[t].destory()})),this.behaveInstance={},void this.$graph.set("action",[]);(Array.isArray(t)?t:[t]).forEach((function(t){e.behaveInstance[t]&&(e.behaveInstance[t].destory(),delete e.behaveInstance[t])})),this.$graph.set("action",Object.keys(this.behaveInstance))},t.prototype.handleMouseEvent=function(t){var e=t.type;if("mousedown"===e&&(this.originX=t.x,this.originY=t.y),"mousemove"===e&&this.handleMouseMove(t),"mouseup"===e){var n=t.x-this.originX,r=t.y-this.originY;Math.abs(n)<2&&Math.abs(r)<2&&0===t.button&&this.emitMouseEvent(t,"click")}this.emitMouseEvent(t,e)},t.prototype.emitMouseEvent=function(t,e){var n=this.$graph,r=n.getPointByClient(t.x,t.y),o=r.x,i=r.y;t.target===this.$svg&&(this.currentItemType="blank",n.emit("blank:".concat(e),{e:t,x:o,y:i}));var a=function(t){for(var e="",n=0,r=C(t);n<r.length;n++){var o=r[n];if((e=o instanceof Element&&o.getAttribute("graph-type"))||o instanceof SVGSVGElement)break}return e}(t);if(a){this.currentItemType=a;var s=function(t){for(var e=t.target,n=t.currentTarget,r=function(){if(e.getAttribute("graph-type")){var t=e.getAttributeNames(),n={};return t.forEach((function(t){if(/graph-(.+)/.test(t)){var r=t.replace("graph-","");n[r]=e.getAttribute(t)}})),{value:n}}e=e.parentNode};e!==n;){var o=r();if("object"==typeof o)return o.value}return{}}(t),u=this.findItem(a,s.id);n.emit("".concat(this.currentItemType,":").concat(e),{e:t,x:o,y:i,data:s,target:u})}n.emit(e,t)},t.prototype.findItem=function(t,e){var n=this.$graph;return"node"===t?n.findNode(e):"edge"===t?n.findEdge(e):"port"===t?n.findPort(e):void 0},t.prototype.handleExtendEvents=function(t){this.$graph.emit(t.type,t)},t.prototype.handleMouseMove=function(t){this.preItemType!==this.currentItemType&&(this.$graph.emit("".concat(this.preItemType,".mouseleave")),this.$graph.emit("".concat(this.currentItemType,".mouseenter"))),this.preItemType=this.currentItemType},t.prototype.defaultEmit=function(){var t=this;this.$graph.on(z,(function(){t.$graph.emit("datachange")}))},t.prototype.destroy=function(){this.eventQueue.forEach((function(t){t.remove()})),this.eventQueue=[],this.behaveInstance=[],this.$graph.off()},t}(),F={width:180,height:40},G=function(t){function e(){var e=t.call(this)||this;e.dataing=!1,e.addNode=function(t){if(void 0===t.id||!e.$store.findNode(t.id)){var n=e.$graph,r=n.get("defaultNode")||{},o=Object.assign({},r,t),a=n.direction,s=i(i(i({},F),n.get("nodeInfo")),{direction:a,store:e.$store}),u=new P(o,s);return e.$store.add(u),u.on("change",(function(t,n){return e.emit("node:change",t,n)})),u.on("port:change",(function(t,n){e.emit("port:change",t,n)})),u.on("port:added",(function(t){return e.emit("port:added",t)})),u.on("port:deleted",(function(t){return e.emit("port:deleted",t)})),!e.dataing&&e.emit("node:added",u),u}console.warn("can't add node, exist node where id is '".concat(t.id,"'"))},e.deleteNode=function(t){var n=e.remove(t,P);return n&&e.emit("node:deleted",n),n},e.deleteEdge=function(t){var n=e.remove(t,I);return n&&e.emit("edge:deleted",n),n},e.addEdge=function(t){try{var n=e.$graph,r=i(i({},n.get("edgeInfo")),{store:e.$store}),o=new I(t,r);return e.$store.add(o),o.on("change",(function(t,n){e.emit("edge:change",t,n)})),!e.dataing&&e.emit("edge:added",o),o}catch(t){console.warn(t)}},e.$graph=ft(),e.$store=ft().store;var n=e.$graph;return n.cfg.nodes&&e.loadNodes(n.cfg.nodes),n.cfg.edges&&e.loadEdges(n.cfg.edges),e}return o(e,t),Object.defineProperty(e.prototype,"getEdges",{get:function(){return this.$store.getEdges},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"getDataModel",{get:function(){return this.$store.getDataModel},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"getTreeDataModel",{get:function(){return this.$store.getTreeDataModel},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"findEdge",{get:function(){return this.$store.findEdge},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"findNode",{get:function(){return this.$store.findNode},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"findPort",{get:function(){return this.$store.findPort},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"findEdgeByState",{get:function(){return this.$store.findEdgeByState},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"findNodeByPort",{get:function(){return this.$store.findNodeByPort},enumerable:!1,configurable:!0}),e.prototype.remove=function(t,e){var n=this.$store.find(t,e);if(n)return n.remove(),n;console.warn("can't delete ".concat((null==e?void 0:e.name)||"item"," where id is '").concat(t,"'"))},e.prototype.initNodesZIndex=function(){for(var t=this.getNodes().filter((function(t){return!t.model.parentId})),e=function(){var e=t[0],n=e.getChildren();(null==n?void 0:n.length)&&(n.forEach((function(t){return t.setZIndex(e.zIndex+1)})),t.push.apply(t,n)),t.splice(0,1)};t.length;)e()},e.prototype.loadNodes=function(t){var e=this;t.map((function(t){return e.addNode(t)})),this.getNodes().forEach((function(t){var n=e.findNode(t.model.parentId);n&&n.addChild(t)})),this.initNodesZIndex()},e.prototype.loadEdges=function(t){var e=this;t.forEach((function(t){return e.addEdge(t)}))},e.prototype.clear=function(){this.$store.getNodes().forEach((function(t){return t.remove()})),this.$store.getEdges().forEach((function(t){return t.remove()})),this.$store.getPorts().forEach((function(t){return t.remove()})),this.$store.reset()},e.prototype.getNodes=function(){return this.$store.getNodes()},e.prototype.refreshNode=function(t){var e=this.findNode(t);if(!e)return console.warn("can't refresh node where id is '".concat(t,"'"));e.refresh(),this.emit("node:refresh",e)},e.prototype.updateNode=function(t,e){var n=this.findNode(t);if(!n)return console.warn("can't update node where id is '".concat(t,"'"));n.update(e),this.emit("node:change",n)},e.prototype.findNodeByState=function(t){return this.getNodes().filter((function(e){return e.hasState(t)}))},e.prototype.updateEdge=function(t,e){var n=this.findEdge(t);if(!n)return console.warn("can't update edge where id is '".concat(t,"'"));n.update(e),this.emit("edge:change",n)},e.prototype.data=function(t){if(this.dataing=!0,0!==Object.keys(t).length){this.clear();var e,n,r,o=void 0!==(r=t).nodes&&void 0!==r.edges?t:(e=[],n=[],function t(r){var o;if(r&&(e.push(r),r.children&&r.children.length)){for(var i=0,a=r.children;i<a.length;i++)(c=a[i])&&n.push((o=c,{fromNodeId:r.id,toNodeId:o.id}));for(var s=0,u=r.children;s<u.length;s++){var c;t(c=u[s])}}}(t),{nodes:e,edges:n}),i=o.nodes.every((function(t){return!Number.isFinite(t.x)&&!Number.isFinite(t.y)}));this.loadNodes(o.nodes),this.loadEdges(o.edges),this.emit("datachange",{needLayout:i}),this.dataing=!1}},e.prototype.destroy=function(){this.clear()},e}(s),Y=["x","y","width","height"],U=["locaked","hide"],X=["linked","hide"],V="undo",q="redo",H=function(t){return{model:g(t.model),rect:y(t,Y),state:U.reduce((function(e,n){return e[n]=t.hasState(n),e}),{})}},W=function(t){return{model:g(t.model),state:X.reduce((function(e,n){return e[n]=t.hasState(n),e}),{})}},Z=function(){function t(){this.startStackData=null,this.undoStack=[],this.redoStack=[],this.$graph=ft()}return t.prototype.clearStack=function(){this.undoStack=[],this.redoStack=[],this.$graph.emit("stackchange")},t.prototype.pushStack=function(t,e){var n=t===V?this.undoStack:this.redoStack;n.push(e),n.length>20&&n.shift(),this.$graph.emit("stackchange")},t.prototype.do=function(t){var e=this,n=(t===V?this.undoStack:this.redoStack).pop();if(n){var r=n.beforeTransform,o=n.afterTransform;r&&o&&this.$graph.translate(r.x-o.x,r.y-o.y),Object.keys(n.beforeNodes).forEach((function(t){var r=e.$graph.findNode(t);if(r){var o=n.beforeNodes[t],i=o.model,a=o.state,s=o.rect;r.updatePosition(s.x,s.y),r.update(i),Object.keys(a).forEach((function(t){a[t]?r.setState(t):r.clearState(t)}))}})),Object.keys(n.beforeEdges).forEach((function(t){var r=e.$graph.findEdge(t);if(r){var o=n.beforeEdges[t],i=o.model,a=o.state;r.update(i),Object.keys(a).forEach((function(t){a[t]?r.setState(t):r.clearState(t)}))}})),Object.keys(n.addEdges).forEach((function(t){e.$graph.deleteEdge(t,!1)})),Object.keys(n.addNodes).forEach((function(t){return e.$graph.deleteNode(t,!1)})),Object.keys(n.removeNodes).forEach((function(t){var r=n.removeNodes[t],o=r.model,i=r.state,a=r.rect,s=e.$graph.addNode(o,!1);s&&(s.updatePosition(a.x,a.y),Object.keys(i).forEach((function(t){i[t]?s.setState(t):s.clearState(t)})))})),Object.keys(n.removeEdges).forEach((function(t){var r=n.removeEdges[t],o=r.model,i=r.state,a=e.$graph.addEdge(o,!1);a&&Object.keys(i).forEach((function(t){i[t]?a.setState(t):a.clearState(t)}))})),this.pushStack(t===V?q:V,{addNodes:n.removeNodes,removeNodes:n.addNodes,beforeNodes:n.afterNodes,afterNodes:n.beforeNodes,beforeTransform:n.afterTransform,afterTransform:n.beforeTransform,addEdges:n.removeEdges,removeEdges:n.addEdges,beforeEdges:n.afterEdges,afterEdges:n.beforeEdges})}},t.prototype.undo=function(){return this.do("undo")},t.prototype.redo=function(){return this.do("redo")},t.prototype.start=function(){if(!this.startStackData){var t=this.$graph.getNodes().reduce((function(t,e){return t[e.id]=H(e),t}),{}),e=this.$graph.getEdges().reduce((function(t,e){return t[e.id]=W(e),t}),{}),n=g(this.$graph.getTranslate());this.startStackData={beforeNodes:t,beforeEdges:e,beforeTransform:n}}},t.prototype.end=function(){if(this.startStackData){for(var t={addNodes:{},removeNodes:{},beforeNodes:{},afterNodes:{},beforeTransform:null,afterTransform:null,addEdges:{},removeEdges:{},beforeEdges:{},afterEdges:{}},e=0,n=this.$graph.getNodes();e<n.length;e++){var r=n[e],o=H(r);if(r.id in this.startStackData.beforeNodes)v(y(this.startStackData.beforeNodes[r.id],["rect","state"]),y(o,["rect","state"]))||(t.beforeNodes[r.id]=this.startStackData.beforeNodes[r.id],t.afterNodes[r.id]=o),delete this.startStackData.beforeNodes[r.id];else t.addNodes[r.id]=o}for(var i in this.startStackData.beforeNodes)t.removeNodes[i]=this.startStackData.beforeNodes[i],delete this.startStackData.beforeNodes[i];for(var a=0,s=this.$graph.getEdges();a<s.length;a++){var u=s[a],c=W(u);if(u.id in this.startStackData.beforeEdges)v(y(this.startStackData.beforeEdges[u.id],["model","state"]),y(c,["model","state"]))||(t.beforeEdges[u.id]=this.startStackData.beforeEdges[u.id],t.afterEdges[u.id]=c),delete this.startStackData.beforeEdges[u.id];else t.addEdges[u.id]=c}for(var i in this.startStackData.beforeEdges)t.removeEdges[i]=this.startStackData.beforeEdges[i],delete this.startStackData.beforeEdges[i];var d=g(this.$graph.getTranslate());v(this.startStackData.beforeTransform,d)||(t.beforeTransform=this.startStackData.beforeTransform,t.afterTransform=d),Object.values(t).some((function(t){return t&&Object.keys(t).length}))&&this.pushStack("undo",t),this.startStackData=null}},t.prototype.destroy=function(){this.clearStack()},t}(),Q=function(t){function e(e){var n=t.call(this)||this;return n.attrs={},e&&(n.attrs=e),n.draw(),n}return o(e,t),e.prototype.draw=function(){var t=this.createDom("g",this.attrs);this.set("el",t)},e.prototype.addGroup=function(t){var n=new e(t);return this.add(n),n},e}(x),K=function(t){function e(e){var n=t.call(this)||this;return n.set("graph",e),n.draw(),n.initHook(),n}return o(e,t),e.prototype.draw=function(){var t=this.createDom("path",{class:"graph-new-edge",d:"","marker-end":"url(#arrow)"});this.set("newEdgePath",t),this.set("el",t)},e.prototype.initHook=function(){this.addEvent("edge:connecting",this.update)},e.prototype.update=function(t){var e,n,r=this.get("newEdgePath");if(t){var o=null===(n=null===(e=this.graph.cfg)||void 0===e?void 0:e.edgeInfo)||void 0===n?void 0:n.path,i="";i=o?o(t.fromPoint,t.toPoint):w({x1:t.fromPoint.x,y1:t.fromPoint.y,x2:t.toPoint.x,y2:t.toPoint.y},this.graph.direction),r.setAttribute("d",i)}else r.setAttribute("d","")},e}(x),J=function(t){function e(e){var n=t.call(this)||this;return n.set("graph",e),n.draw(),n.initHook(),n}return o(e,t),e.prototype.draw=function(){var t=this.createDom("path",{class:"graph-brushing",d:""});this.set("el",t),this.set("brushingPath",t)},e.prototype.initHook=function(){this.addEvent("brushing",this.update)},e.prototype.update=function(t){this.get("brushingPath").setAttribute("d",t)},e}(x),tt=function(t){function e(e){var n=t.call(this)||this;return n.set("graph",e),n.set("id",l("svg")),n.container=e.container,n.draw(),function(t){var e=document.createElement("style");e.setAttribute("type","text/css"),e.textContent=t;var n=document.querySelector("head");n&&n.insertBefore(e,n.firstChild)}("\n.graph-svg {\n  user-select: none\n}\n\n.graph-node {\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 12px;\n  color: #666;\n  border-width: 1px;\n  border-style: solid;\n  border-radius: 2px;\n  box-sizing: border-box;\n  cursor: pointer;\n  border-color: #DEDFEC;\n  background: rgba(252,252,251,0.9);\n}\n.graph-node-active {\n  border-color: #606BE1;\n  background: rgba(185,200,245,0.9);\n}\n\n:root {\n  --edge-color: #d1d1dd;\n  --select-color: #4150f6;\n}\n@keyframes dash {\n  from {\n    stroke-dashoffset: 320;\n  }\n  to {\n    stroke-dashoffset: 0;\n  }\n}\n.graph-edge-wrapper {\n  stroke-width: 10;\n  fill: none;\n  stroke: transparent;\n}\n.graph-edge {\n  stroke: var(--edge-color);\n  stroke-width: 2;\n  fill: none;\n  stroke-linecap: round;\n  /**\n  stroke-dasharray: 5;\n  animation: dash 10s linear infinite;\n  */\n  pointer-events: none;\n}\n.graph-edge-active {\n  stroke: var(--select-color);\n  stroke-width: 2.5;\n  cursor: pointer;\n  stroke-linecap: round;\n}\n.graph-arrow {\n  stroke: var(--edge-color);\n  fill: var(--edge-color);\n}\n.graph-arrow-active {\n  stroke: var(--select-color);\n  fill: var(--select-color);\n}\n.graph-new-edge {\n  pointer-events: none;\n  stroke-dasharray: 5;\n  stroke-linecap: round;\n  stroke-width: 1.5;\n  stroke: #d1d1d9;\n  fill: transparent;\n}\n\n.graph-port {\n  stroke: #dddeeb;\n  fill: #fff;\n  stroke-width: 1;\n  cursor: pointer;\n}\n.graph-port.graph-port-linked  {\n  fill: #606be1;\n  stroke: #606be1;\n}\n.graph-port.graph-port-active:hover  {\n  stroke: #606be1;\n  stroke-width: 2;\n  fill: #fff;\n}\n.graph-port.graph-port-enable  {\n  stroke: rgba(96, 107, 225, 0.7);\n  stroke-width: 4;\n  fill: #fff;\n}\n.graph-port.graph-port-enable:hover  {\n  stroke-width: 6;\n  fill: rgba(96, 107, 225);\n}\n\n.graph-brushing {\n  fill: #4E73FF;\n  stroke: #606BE1;\n  stroke-width: 1px;\n  opacity: 0.3;\n}\n"),n.initDefs(),n.initGroup(),n.initNewEdge(),n.initBrushing(),n.initHook(),n}return o(e,t),e.prototype.initHook=function(){this.addEvent("zoom",this.updateTransform),this.addEvent("translate",this.updateTransform)},e.prototype.updateTransform=function(){var t=this.get("rootGroup"),e=this.graph.getZoom(),n=this.graph.getTranslate();t.el.setAttribute("style","transform: scale(".concat(e,") translate(").concat(n.x,"px, ").concat(n.y,"px)"))},e.prototype.draw=function(){var t=this.createDom("svg",{width:"100%",height:"100%",xmlns:"http://www.w3.org/2000/svg",class:"graph-svg"});this.container.innerHTML="",t.id=this.id,this.container.appendChild(t),this.set("el",t)},e.prototype.initDefs=function(){var t=this.createDom("defs"),e=this.createDom("marker",{id:"arrow",orient:"auto",overflow:"visible",markerUnits:"userSpaceOnUse"}),n=this.createDom("path",{d:"M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z",transform:"rotate(180)",class:"graph-arrow"}),r=this.createDom("marker",{id:"arrow-active",orient:"auto",overflow:"visible",markerUnits:"userSpaceOnUse"}),o=this.createDom("path",{d:"M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z",transform:"rotate(180)",class:"graph-arrow-active"});e.appendChild(n),t.appendChild(e),r.appendChild(o),t.appendChild(r),this.get("el").appendChild(t)},e.prototype.initGroup=function(){var t=this.addGroup({class:"graph-root-group","transform-origin":"center"}),e=t.addGroup({class:"graph-edge-group"}),n=t.addGroup({class:"graph-node-group"});this.set("rootGroup",t),this.set("edgeGroup",e),this.set("nodeGroup",n)},e.prototype.initNewEdge=function(){var t=new K(this.graph);this.get("rootGroup").addGroup({class:"graph-new-edge-group"}).add(t)},e.prototype.initBrushing=function(){var t=new J(this.graph);this.add(t)},e.prototype.addGroup=function(t){var e=new Q(t);return this.add(e),e},e}(x),et={},nt={},rt=!0,ot=[],it=[];function at(t){nt[ot[t].id]=1;for(var e=0;e<ot.length;e++)if(0!==et[ot[t].id][ot[e].id]){if(1===nt[ot[e].id]){rt=!1;break}if(-1===nt[ot[e].id])continue;at(e)}nt[ot[t].id]=-1}var st=function(t){et={},nt={},rt=!0,ot=t.nodes,it=t.edges,function(){for(var t=0,e=ot;t<e.length;t++){var n=e[t].id;nt[n]=0,et[n]={};for(var r=0,o=ot;r<o.length;r++){var i=o[r].id;et[n][i]=0}}for(var a=0,s=it;a<s.length;a++){var u=s[a];u.fromNodeId&&u.toNodeId&&(et[u.fromNodeId][u.toNodeId]=1)}}();for(var e=0;e<ot.length&&(-1===nt[ot[e].id]||(at(e),rt));e++);return!rt},ut=function(t){function e(){var e=t.call(this)||this;return e.primaryMap=new Map,e.indexedMap=new Map,e}return o(e,t),e.prototype.onAdded=function(t,e){var n=this.indexedMap.get(e)||new Set;n.add(t),this.indexedMap.set(e,n),this.emit("change",{type:"add",many:t,one:e})},e.prototype.onRemove=function(t,e){var n=this.indexedMap.get(e);n&&(n.delete(t),0===n.size&&this.indexedMap.delete(e),this.emit("change",{type:"remove",many:t,one:e}))},e.prototype.add=function(t,e){this.primaryMap.set(t,e),this.onAdded(t,e)},e.prototype.getMany=function(t){var e=this.indexedMap.get(t);return e?Array.from(e):[]},e.prototype.getOne=function(t){var e=this.primaryMap.get(t);return e||void 0},e.prototype.remove=function(t){var e=this,n=this.getOne(t);if(n)return this.primaryMap.delete(t),void this.onRemove(t,n);var r=this.getMany(t);null==r||r.forEach((function(n){e.primaryMap.delete(n),e.onRemove(n,t)}))},e}(s),ct=function(t){function e(){var e,n,r,o=t.call(this)||this;return o.itemMap={},o.node_ports=new ut,o.node_nodes=new ut,o.fromPort_edges=new ut,o.toPort_edges=new ut,o.viewMap=new Map,o.getEdges=function(){return Object.values(o.getEdgeMap())},o.findPort=function(t){return o.find(t,S)},o.findEdge=function(t){return o.find(t,I)},o.findNode=function(t){return o.find(t,P)},o.findEdgeByState=function(t){return o.getEdges().filter((function(e){return e.hasState(t)}))},o.findNodeByPort=function(t){return o.getNodes().find((function(e){return e.ports.find((function(e){return e.id===t}))}))},o.getDataModel=function(){return{nodes:o.getNodes().map((function(t){return t.model})),edges:o.getEdges().map((function(t){return t.model}))}},o.getTreeDataModel=function(){return o.getNodes()[0].model},o.sorted=(n=function(t){var n=function(t){return((e=t)&&e.zIndex||0)+(t instanceof I?-.5:0);var e},r=e.indexOf(t),o=n(t),i=function(t,r){if(o<n(e[t]))return t;if(o>=n(e[r]))return r+1;for(;t<r-1;){var i=Math.trunc((t+r)/2);n(e[i])<=o?t=i:r=i}return r};if(-1===r){var a=i(0,e.length-1);e.splice(a,0,t)}else o<n(e[r-1])?(a=i(0,r-1),e.splice(r,1),e.splice(a,0,t)):o>n(e[r+1])&&(a=i(r+1,e.length-1),e.splice(r,1),e.splice(a,0,t))},r=function(t,e){(t instanceof P||t instanceof I)&&"zIndex"===e&&n(t)},{items:e=[],add:function(t){(t instanceof P||t instanceof I)&&(n(t),t.on("change",r))},remove:function(t){if(t instanceof P||t instanceof I){var n=e.indexOf(t);-1!==n&&(t.off("change",r),e.splice(n,1))}},clean:function(){e.splice(0,e.length).forEach((function(t){return t.off("change",r)}))}}),o.sortedItems=o.sorted.items,o.reset(),o}return o(e,t),e.prototype.getItemMap=function(t){if(t){var e={};return Object.values(this.itemMap).forEach((function(n){n instanceof t&&(e[n.id]=n)})),e}return this.itemMap},e.prototype.add=function(t){if(this.itemMap[t.id]!==t){var e=this.itemMap[t.id];this.itemMap[t.id]=t,e?e!==t&&(this.sorted.remove(e),this.sorted.add(t)):this.sorted.add(t),this.emit("add",t,e)}},e.prototype.find=function(t,e){var n=this.itemMap[t];return e?n instanceof e?n:void 0:n},e.prototype.where=function(t){var e=Object.values(this.itemMap),n=function(n){e=e.filter((function(e){return m(n,e)&&e[n]===t[n]}))};for(var r in t)n(r);return e},e.prototype.findBy=function(t){var e=Object.keys(t)[0],n=t[e];return delete t[e],this.where(t).find((function(t){return m(e,t)&&t[e]===n}))},e.prototype.getNodeMap=function(){return this.getItemMap(P)},e.prototype.getEdgeMap=function(){return this.getItemMap(I)},e.prototype.getPortMap=function(){return this.getItemMap(S)},e.prototype.getNodes=function(){return Object.values(this.getNodeMap())},e.prototype.getPorts=function(){return Object.values(this.getPortMap())},e.prototype.remove=function(t,e){var n=this.find(t,e);if(n)return delete this.itemMap[t],this.sorted.remove(n),this.emit("remove",n),n},e.prototype.reset=function(){this.itemMap={},this.sorted.clean(),this.node_ports=new ut,this.node_nodes=new ut,this.fromPort_edges=new ut,this.toPort_edges=new ut,this.viewMap=new Map},e}(s),dt=null,ft=function(){if(!dt)throw new ReferenceError("useGraph only can be used when instantiate a Graph");return dt},ht=function(t){function e(e){var n=t.call(this)||this;dt=n;var r=e.container instanceof HTMLElement?e.container:document.querySelector(e.container);if(!(r instanceof HTMLElement))throw new ReferenceError("无效的container ".concat(e.container));n.cfg=i(i({direction:"TB",nodes:[],edges:[],action:[],brushing:!1},e),{container:r}),n.set("direction",e.direction||"TB");var o=r.querySelector("svg");return n.isRender=!o,n.$svg=o?void 0:new tt(n),n.store=new ct,n.viewController=new M,n.layoutController=new d,n.eventController=new R,n.itemController=new G,n.stackController=new Z,n.initEvent(),window.graph=n,dt=null,n}return o(e,t),Object.defineProperty(e.prototype,"container",{get:function(){return this.get("container")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"direction",{get:function(){return this.get("direction")},enumerable:!1,configurable:!0}),e.prototype.withStack=function(t,e){var n=this;return function(r,o){void 0===r&&(r=e),void 0===o&&(o=!0),o&&n.stackStart();var i=t(r);return o&&n.stackEnd(),i}},e.prototype.initEvent=function(){var t=this;this.itemController.on("node:refresh",(function(e){t.emit("node:refresh",e)})),this.itemController.on("node:change",(function(e,n){t.emit("node:change",e,n),t.emit("node:change:".concat(n),e)})),this.itemController.on("node:deleted",(function(e){t.emit("node:deleted",e)})),this.itemController.on("node:added",(function(e){t.emit("node:added",e)})),this.itemController.on("edge:deleted",(function(e){t.emit("edge:deleted",e)})),this.itemController.on("edge:change",(function(e,n){t.emit("edge:change",e,n),t.emit("edge:change:".concat(n),e)})),this.itemController.on("edge:added",(function(e){t.emit("edge:added",e)})),this.itemController.on("port:change",(function(e,n){t.emit("port:change",e,n),t.emit("".concat("port:change",":").concat(n),e)})),this.itemController.on("port:added",(function(e){return t.emit("port:added",e)})),this.itemController.on("port:deleted",(function(e){return t.emit("port:deleted",e)})),this.itemController.on("datachange",(function(e){e.needLayout&&(t.layout({},!1),t.fitCenter()),t.emit("datachange")})),this.layoutController.on("layout",(function(){t.emit("layout")})),this.store.on("add",(function(e,n){t.viewController.onAdd(e,n)})),this.store.on("remove",(function(e){t.viewController.onRemove(e)}))},e.prototype.set=function(t,e){this.cfg[t]=e},e.prototype.get=function(t){return this.cfg[t]},e.prototype.getContainer=function(){return this.container},e.prototype.getSvgInfo=function(){return this.viewController.svgInfo},e.prototype.getNodeInfo=function(){return this.cfg.nodeInfo},e.prototype.getNodes=function(){return this.itemController.getNodes()},e.prototype.getSortedItem=function(){return Object.freeze(Array.from(this.store.sortedItems))},e.prototype.findNode=function(t){return this.itemController.findNode(String(t))},e.prototype.findNodeByState=function(t){return this.itemController.findNodeByState(t)},e.prototype.findNodeByPort=function(t){return this.itemController.findNodeByPort(t)},e.prototype.refreshNode=function(t){return this.itemController.refreshNode(t)},e.prototype.updateNode=function(t,e){return this.itemController.updateNode(t,e)},e.prototype.deleteNode=function(t,e){return void 0===e&&(e=!0),this.withStack(this.itemController.deleteNode)(t,e)},e.prototype.addNode=function(t,e){return void 0===e&&(e=!0),this.withStack(this.itemController.addNode)(t,e)},e.prototype.findPort=function(t){return this.itemController.findPort(String(t))},e.prototype.getEdges=function(){return this.itemController.getEdges()},e.prototype.findEdge=function(t){return this.itemController.findEdge(String(t))},e.prototype.findEdgeByState=function(t){return this.itemController.findEdgeByState(t)},e.prototype.updateEdge=function(t,e){return this.itemController.updateEdge(t,e)},e.prototype.deleteEdge=function(t,e){return void 0===e&&(e=!0),this.withStack(this.itemController.deleteEdge)(t,e)},e.prototype.addEdge=function(t,e){return void 0===e&&(e=!0),this.withStack(this.itemController.addEdge)(t,e)},e.prototype.getDataModel=function(){return this.itemController.getDataModel()},e.prototype.getTreeDataModel=function(){return this.itemController.getTreeDataModel()},e.prototype.getPointByClient=function(t,e){return this.viewController.getPointByClient(t,e)},e.prototype.getTranslate=function(){return this.viewController.getTranslate()},e.prototype.translate=function(t,e){return this.viewController.translateBy(t,e)},e.prototype.getZoom=function(){return this.viewController.getZoom()},e.prototype.zoom=function(t,e){return this.viewController.zoom(t,e)},e.prototype.resize=function(){return this.viewController.resize()},e.prototype.fitView=function(){return this.viewController.fitView()},e.prototype.fitTo=function(t,e){return void 0===t&&(t=0),void 0===e&&(e=0),this.viewController.fitTo(t,e)},e.prototype.data=function(t){return this.itemController.data(t)},e.prototype.fitCenter=function(){return this.viewController.translateToCenter()},e.prototype.fullScreen=function(t){return this.viewController.fullScreen(t)},e.prototype.layout=function(t,e){return void 0===t&&(t={}),void 0===e&&(e=!0),this.withStack(this.layoutController.layout,{})(t,e)},e.prototype.removeAction=function(t){return this.eventController.removeBehavior(t)},e.prototype.addAction=function(t){this.eventController.addBehavior(Array.isArray(t)?t:[t])},e.prototype.getNodesBBox=function(t){return this.viewController.getNodesBBox(t)},e.prototype.undo=function(){return this.stackController.undo()},e.prototype.redo=function(){return this.stackController.redo()},e.prototype.stackStart=function(){return this.stackController.start()},e.prototype.stackEnd=function(){return this.stackController.end()},e.prototype.getUndoStack=function(){return this.stackController.undoStack},e.prototype.getRedoStack=function(){return this.stackController.redoStack},e.prototype.clearStack=function(){return this.stackController.clearStack()},e.prototype.detectDirectedCycle=function(){return st(this.getDataModel())},e.prototype.destroy=function(){var t=this;["stackController","eventController","itemController","viewController","layoutController"].forEach((function(e){t[e].destroy(),delete t[e]}))},e}(s);e.default={Graph:ht,Behavior:T,Node:P,Edge:I,Port:S}}]).default}));
//# sourceMappingURL=core.min.js.map

/***/ }),

/***/ 890:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".graph-vue-arrow{stroke:#d1d1d9;fill:#d1d1d9}", ""]);
// Exports
/* harmony default export */ __webpack_exports__.Z = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root{--edge-color: #d1d1dd;--select-color: #4150f6}.graph-vue-edge-wrapper{stroke-width:10;fill:none;stroke:rgba(0,0,0,0)}.graph-vue-edge{stroke:var(--edge-color);stroke-width:2;fill:none;stroke-linecap:round;pointer-events:none}.graph-vue-edge-active{stroke:var(--select-color);stroke-width:2.5;cursor:pointer;stroke-linecap:round}", ""]);
// Exports
/* harmony default export */ __webpack_exports__.Z = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 716:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".graph-vue-wrapper{width:100%;height:100%;overflow:hidden;user-select:none}.graph-vue-brushing{fill:#4e73ff;stroke:#606be1;stroke-width:1px;opacity:.3}", ""]);
// Exports
/* harmony default export */ __webpack_exports__.Z = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 681:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".graph-vue-new-edge{pointer-events:none;stroke-dasharray:5;stroke-linecap:round;stroke-width:1.5;stroke:#d1d1d9;fill:rgba(0,0,0,0)}", ""]);
// Exports
/* harmony default export */ __webpack_exports__.Z = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 732:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".graph-vue-node{height:100%;display:flex;justify-content:center;align-items:center;font-size:12px;color:#666;border-width:1px;border-style:solid;border-radius:2px;box-sizing:border-box;cursor:pointer;border-color:#dedfec;background:rgba(252,252,251,.9)}.graph-vue-node-active{border-color:#606be1;background:rgba(185,200,245,.9)}", ""]);
// Exports
/* harmony default export */ __webpack_exports__.Z = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 88:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".graph-vue-port{stroke:#dddeeb;fill:#fff;stroke-width:1;cursor:pointer}.graph-vue-port-linked{fill:#606be1;stroke:#606be1}.graph-vue-port-active:hover{stroke:#606be1;stroke-width:2;fill:#fff}.graph-vue-port-enable{stroke:rgba(96,107,225,.7);stroke-width:4;fill:#fff}.graph-vue-port-enable:hover{stroke-width:6;fill:#606be1}", ""]);
// Exports
/* harmony default export */ __webpack_exports__.Z = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ (function(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 379:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 181:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: function() { return /* binding */ graph; }
});

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/graph.vue?vue&type=template&id=e240ebbc&
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "svg",
      staticClass: "graph-vue-wrapper",
      on: {
        dragover: function (e) {
          return e.preventDefault()
        },
        drop: _vm.handleDrop,
        contextmenu: function (e) {
          return e.preventDefault()
        },
      },
    },
    [
      _c(
        "svg",
        {
          attrs: {
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            width: "100%",
            height: "100%",
          },
        },
        [
          _c("Arrow", { ref: "arrow" }),
          _vm._v(" "),
          _vm.graph
            ? _c(
                "g",
                {
                  style: {
                    transform:
                      "scale(" +
                      _vm.transform.scale +
                      ") translate(" +
                      _vm.transform.translateX +
                      "px, " +
                      _vm.transform.translateY +
                      "px)",
                    transformOrigin: "center",
                  },
                },
                [
                  _vm._l(_vm.items, function (item) {
                    return [
                      _vm.isEdge(item)
                        ? _c(
                            "EdgeWrapper",
                            { key: item.id, attrs: { edge: item } },
                            [
                              _vm.hasSlots.edge
                                ? _vm._t("edge", null, { edge: item })
                                : _c("Edge", {
                                    attrs: { edge: item, graph: _vm.graph },
                                  }),
                            ],
                            2
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.isNode(item)
                        ? _c(
                            "NodeWrapper",
                            {
                              key: item.id,
                              attrs: { node: item },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "port",
                                    fn: function (ref) {
                                      var port = ref.port
                                      return [
                                        _vm.hasSlots.port
                                          ? _vm._t("port", null, { port: port })
                                          : _c("Port", {
                                              attrs: { port: port },
                                            }),
                                      ]
                                    },
                                  },
                                ],
                                null,
                                true
                              ),
                            },
                            [
                              _vm.hasSlots.node
                                ? _vm._t("node", null, { node: item })
                                : _c("Node", { attrs: { node: item } }),
                            ],
                            2
                          )
                        : _vm._e(),
                    ]
                  }),
                  _vm._v(" "),
                  _c("NewEdge", [_vm._t("newEdge")], 2),
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _c("path", {
            staticClass: "graph-vue-brushing",
            attrs: { d: _vm.brushPath },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _vm.graph ? _vm._t("default") : _vm._e(),
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true


;// CONCATENATED MODULE: ./components/graph.vue?vue&type=template&id=e240ebbc&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/wrapper/node.vue?vue&type=template&id=0d31e67e&
var nodevue_type_template_id_0d31e67e_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return !_vm.node.hasState("hide")
    ? _c(
        "g",
        [
          _c(
            "g",
            {
              attrs: {
                transform: "translate(" + _vm.node.x + ", " + _vm.node.y + ")",
              },
            },
            [
              _c(
                "foreignObject",
                {
                  attrs: {
                    overflow: "visible",
                    width: _vm.node.width,
                    height: _vm.node.height,
                    "graph-type": "node",
                    "graph-id": _vm.node.id,
                  },
                },
                [_vm._t("default")],
                2
              ),
            ],
            1
          ),
          _vm._v(" "),
          _vm._l(_vm.node.ports, function (port) {
            return _c(
              "PortWrapper",
              { key: port.id, attrs: { port: port } },
              [_vm._t("port", null, { port: port })],
              2
            )
          }),
        ],
        2
      )
    : _vm._e()
}
var nodevue_type_template_id_0d31e67e_staticRenderFns = []
nodevue_type_template_id_0d31e67e_render._withStripped = true


;// CONCATENATED MODULE: ./components/wrapper/node.vue?vue&type=template&id=0d31e67e&

;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/wrapper/port.vue?vue&type=template&id=a7e9e1ea&
var portvue_type_template_id_a7e9e1ea_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "g",
    {
      attrs: {
        "graph-type": "port",
        "graph-id": _vm.port.id,
        transform: "translate(" + _vm.port.x + ", " + _vm.port.y + ")",
      },
    },
    [_vm._t("default", null, { port: _vm.port })],
    2
  )
}
var portvue_type_template_id_a7e9e1ea_staticRenderFns = []
portvue_type_template_id_a7e9e1ea_render._withStripped = true


;// CONCATENATED MODULE: ./components/wrapper/port.vue?vue&type=template&id=a7e9e1ea&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/wrapper/port.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//

// import { defineComponent } from 'vue-demi'

/* harmony default export */ var portvue_type_script_lang_js_ = ({
  props: ['port']
});
;// CONCATENATED MODULE: ./components/wrapper/port.vue?vue&type=script&lang=js&
 /* harmony default export */ var wrapper_portvue_type_script_lang_js_ = (portvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./components/wrapper/port.vue





/* normalize component */
;
var component = normalizeComponent(
  wrapper_portvue_type_script_lang_js_,
  portvue_type_template_id_a7e9e1ea_render,
  portvue_type_template_id_a7e9e1ea_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var port = (component.exports);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/wrapper/node.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import { defineComponent } from 'vue-demi'


/* harmony default export */ var nodevue_type_script_lang_js_ = ({
  components: { PortWrapper: port },
  props: ['node']
});
;// CONCATENATED MODULE: ./components/wrapper/node.vue?vue&type=script&lang=js&
 /* harmony default export */ var wrapper_nodevue_type_script_lang_js_ = (nodevue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./components/wrapper/node.vue





/* normalize component */
;
var node_component = normalizeComponent(
  wrapper_nodevue_type_script_lang_js_,
  nodevue_type_template_id_0d31e67e_render,
  nodevue_type_template_id_0d31e67e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var node = (node_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/wrapper/edge.vue?vue&type=template&id=318cd9c4&
var edgevue_type_template_id_318cd9c4_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return !_vm.edge.hasState("hide")
    ? _c(
        "g",
        { attrs: { "graph-type": "edge", "graph-id": _vm.edge.id } },
        [_vm._t("default")],
        2
      )
    : _vm._e()
}
var edgevue_type_template_id_318cd9c4_staticRenderFns = []
edgevue_type_template_id_318cd9c4_render._withStripped = true


;// CONCATENATED MODULE: ./components/wrapper/edge.vue?vue&type=template&id=318cd9c4&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/wrapper/edge.vue?vue&type=script&lang=js&
//
//
//
//
//
//

// import { defineComponent } from 'vue-demi'

/* harmony default export */ var edgevue_type_script_lang_js_ = ({
  props: ['edge']
});
;// CONCATENATED MODULE: ./components/wrapper/edge.vue?vue&type=script&lang=js&
 /* harmony default export */ var wrapper_edgevue_type_script_lang_js_ = (edgevue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./components/wrapper/edge.vue





/* normalize component */
;
var edge_component = normalizeComponent(
  wrapper_edgevue_type_script_lang_js_,
  edgevue_type_template_id_318cd9c4_render,
  edgevue_type_template_id_318cd9c4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var edge = (edge_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/node.vue?vue&type=template&id=aefb1578&
var nodevue_type_template_id_aefb1578_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "graph-vue-node",
      class: { "graph-vue-node-active": _vm.node.hasState("selected") },
    },
    [_vm._v("\n  " + _vm._s(_vm.node.model.label) + "\n")]
  )
}
var nodevue_type_template_id_aefb1578_staticRenderFns = []
nodevue_type_template_id_aefb1578_render._withStripped = true


;// CONCATENATED MODULE: ./components/node.vue?vue&type=template&id=aefb1578&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/node.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//

// import { defineComponent } from 'vue-demi'

/* harmony default export */ var lib_vue_loader_options_components_nodevue_type_script_lang_js_ = ({
  props: ['node']
});
;// CONCATENATED MODULE: ./components/node.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_nodevue_type_script_lang_js_ = (lib_vue_loader_options_components_nodevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/node.vue?vue&type=style&index=0&id=aefb1578&prod&lang=scss&
var nodevue_type_style_index_0_id_aefb1578_prod_lang_scss_ = __webpack_require__(732);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/node.vue?vue&type=style&index=0&id=aefb1578&prod&lang=scss&

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(nodevue_type_style_index_0_id_aefb1578_prod_lang_scss_/* default */.Z, options);



/* harmony default export */ var lib_vue_loader_options_components_nodevue_type_style_index_0_id_aefb1578_prod_lang_scss_ = (nodevue_type_style_index_0_id_aefb1578_prod_lang_scss_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./components/node.vue?vue&type=style&index=0&id=aefb1578&prod&lang=scss&

;// CONCATENATED MODULE: ./components/node.vue



;


/* normalize component */

var components_node_component = normalizeComponent(
  components_nodevue_type_script_lang_js_,
  nodevue_type_template_id_aefb1578_render,
  nodevue_type_template_id_aefb1578_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_node = (components_node_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/edge.vue?vue&type=template&id=661a663e&
var edgevue_type_template_id_661a663e_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("g", [
    _c("path", {
      staticClass: "graph-vue-edge-wrapper",
      attrs: { d: _vm.path, "graph-type": "edge", "graph-id": _vm.edge.id },
    }),
    _vm._v(" "),
    _c("path", {
      ref: "edge",
      staticClass: "graph-vue-edge",
      class: { "graph-vue-edge-active": _vm.edge.hasState("selected") },
      attrs: { "marker-end": "url(#arrow)", d: _vm.path },
    }),
  ])
}
var edgevue_type_template_id_661a663e_staticRenderFns = []
edgevue_type_template_id_661a663e_render._withStripped = true


;// CONCATENATED MODULE: ./components/edge.vue?vue&type=template&id=661a663e&

;// CONCATENATED MODULE: ./utils/calculateCurve.ts
/**
 * 计算边和箭头路径的的函数
 * @param position 边的起始点坐标 x1 y1 和终点左边 y1 y2
 * @param direction 图的方向：TB（自上而下）LR（从左到右）
 * @param showArrow 是否需要显示箭头，不需要箭头边的路径上不会预留箭头的offset
 */
var calculateCurve = function (position, direction) {
    if (direction === void 0) { direction = 'TB'; }
    var x1 = position.x1, y1 = position.y1, x2 = position.x2, y2 = position.y2;
    if (direction === 'LR') {
        var v = (Math.abs(x2 - x1) / 3) * 2;
        var d = v < 20 ? 20 : v;
        var qx1 = x1 + d;
        var qy1 = y1;
        var qx2 = x2 - d;
        var qy2 = y2;
        return "M ".concat(x1, " ").concat(y1, " C ").concat(qx1, " ").concat(qy1, " ").concat(qx2, " ").concat(qy2, " ").concat(x2, " ").concat(y2);
    }
    if (direction === 'TB') {
        var v = (Math.abs(y2 - y1) / 3) * 2;
        var d = v < 20 ? 20 : v;
        var qx1 = x1;
        var qy1 = y1 + d;
        var qx2 = x2;
        var qy2 = y2 - d;
        return "M ".concat(x1, " ").concat(y1, " C ").concat(qx1, " ").concat(qy1, " ").concat(qx2, " ").concat(qy2, " ").concat(x2, " ").concat(y2);
    }
    if (direction === 'BT') {
        var v = (Math.abs(y2 - y1) / 3) * 2;
        var d = v < 20 ? 20 : v;
        var qx1 = x1;
        var qy1 = y1 - d;
        var qx2 = x2;
        var qy2 = y2 + d;
        return "M ".concat(x1, " ").concat(y1, " C ").concat(qx1, " ").concat(qy1, " ").concat(qx2, " ").concat(qy2, " ").concat(x2, " ").concat(y2);
    }
    if (direction === 'RL') {
        var v = (Math.abs(x2 - x1) / 3) * 2;
        var d = v < 20 ? 20 : v;
        var qx1 = x1 - d;
        var qy1 = y1;
        var qx2 = x2 + d;
        var qy2 = y2;
        return "M ".concat(x1, " ").concat(y1, " C ").concat(qx1, " ").concat(qy1, " ").concat(qx2, " ").concat(qy2, " ").concat(x2, " ").concat(y2);
    }
    return '';
};

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/edge.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import { defineComponent } from 'vue-demi'


/* harmony default export */ var lib_vue_loader_options_components_edgevue_type_script_lang_js_ = ({
  props: ['edge', 'graph'],
  data() {
    return {
      activeEdgeId: ''
    };
  },
  computed: {
    path() {
      const { fromPort, toPort } = this.edge;
      const direction = this.graph.get('direction');
      const x2 = toPort.x;
      const y2 = toPort.y;

      return calculateCurve({
        x1: fromPort.x,
        y1: fromPort.y,
        x2,
        y2
      }, direction);
    }
  }
});
;// CONCATENATED MODULE: ./components/edge.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_edgevue_type_script_lang_js_ = (lib_vue_loader_options_components_edgevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/edge.vue?vue&type=style&index=0&id=661a663e&prod&lang=scss&
var edgevue_type_style_index_0_id_661a663e_prod_lang_scss_ = __webpack_require__(15);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/edge.vue?vue&type=style&index=0&id=661a663e&prod&lang=scss&

            

var edgevue_type_style_index_0_id_661a663e_prod_lang_scss_options = {};

edgevue_type_style_index_0_id_661a663e_prod_lang_scss_options.insert = "head";
edgevue_type_style_index_0_id_661a663e_prod_lang_scss_options.singleton = false;

var edgevue_type_style_index_0_id_661a663e_prod_lang_scss_update = injectStylesIntoStyleTag_default()(edgevue_type_style_index_0_id_661a663e_prod_lang_scss_/* default */.Z, edgevue_type_style_index_0_id_661a663e_prod_lang_scss_options);



/* harmony default export */ var lib_vue_loader_options_components_edgevue_type_style_index_0_id_661a663e_prod_lang_scss_ = (edgevue_type_style_index_0_id_661a663e_prod_lang_scss_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./components/edge.vue?vue&type=style&index=0&id=661a663e&prod&lang=scss&

;// CONCATENATED MODULE: ./components/edge.vue



;


/* normalize component */

var components_edge_component = normalizeComponent(
  components_edgevue_type_script_lang_js_,
  edgevue_type_template_id_661a663e_render,
  edgevue_type_template_id_661a663e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_edge = (components_edge_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/port.vue?vue&type=template&id=537dda9c&
var portvue_type_template_id_537dda9c_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("circle", {
    staticClass: "graph-vue-port",
    class: {
      "graph-vue-port-enable": _vm.enable,
      "graph-vue-port-active": _vm.port.type === "out",
      "graph-vue-port-linked": _vm.linked,
    },
    attrs: { r: _vm.enable ? _vm.highlightCircleR : _vm.circleR },
  })
}
var portvue_type_template_id_537dda9c_staticRenderFns = []
portvue_type_template_id_537dda9c_render._withStripped = true


;// CONCATENATED MODULE: ./components/port.vue?vue&type=template&id=537dda9c&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/port.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

// import {
//   defineComponent,
//   getCurrentInstance,
//   onBeforeUnmount,
//   onBeforeMount
// } from 'vue-demi'

/* harmony default export */ var lib_vue_loader_options_components_portvue_type_script_lang_js_ = ({
  props: ['port'],
  data() {
    return {
      circleR: 4,
      highlightCircleR: 6,
      enable: false,
      linked: false
    };
  },
  methods: {
    refreshPort() {
      this.enable = this.port.hasState('enable');
      this.linked = !this.enable && this.port.hasState('linked');
    }
  },
  created() {
    this.port.on('change', this.refreshPort);
  },
  beforeDestory() {
    this.port.off('change', this.refreshPort);
  }
  // setup() {
  //   const instance = getCurrentInstance().proxy

  //   onBeforeMount(() => {
  //     instance.refreshPort()
  //     instance.port.on('change', instance.refreshPort)
  //   })

  //   onBeforeUnmount(() => {
  //     instance.port.off('change', instance.refreshPort)
  //   })
  // }
});
;// CONCATENATED MODULE: ./components/port.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_portvue_type_script_lang_js_ = (lib_vue_loader_options_components_portvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/port.vue?vue&type=style&index=0&id=537dda9c&prod&lang=scss&
var portvue_type_style_index_0_id_537dda9c_prod_lang_scss_ = __webpack_require__(88);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/port.vue?vue&type=style&index=0&id=537dda9c&prod&lang=scss&

            

var portvue_type_style_index_0_id_537dda9c_prod_lang_scss_options = {};

portvue_type_style_index_0_id_537dda9c_prod_lang_scss_options.insert = "head";
portvue_type_style_index_0_id_537dda9c_prod_lang_scss_options.singleton = false;

var portvue_type_style_index_0_id_537dda9c_prod_lang_scss_update = injectStylesIntoStyleTag_default()(portvue_type_style_index_0_id_537dda9c_prod_lang_scss_/* default */.Z, portvue_type_style_index_0_id_537dda9c_prod_lang_scss_options);



/* harmony default export */ var lib_vue_loader_options_components_portvue_type_style_index_0_id_537dda9c_prod_lang_scss_ = (portvue_type_style_index_0_id_537dda9c_prod_lang_scss_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./components/port.vue?vue&type=style&index=0&id=537dda9c&prod&lang=scss&

;// CONCATENATED MODULE: ./components/port.vue



;


/* normalize component */

var port_component = normalizeComponent(
  components_portvue_type_script_lang_js_,
  portvue_type_template_id_537dda9c_render,
  portvue_type_template_id_537dda9c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_port = (port_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/new-edge.vue?vue&type=template&id=bbb4c59e&
var new_edgevue_type_template_id_bbb4c59e_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("g", [
    _vm.path
      ? _c("path", {
          staticClass: "graph-vue-new-edge",
          attrs: { d: _vm.path, "marker-end": "url(#arrow)" },
        })
      : _vm._e(),
  ])
}
var new_edgevue_type_template_id_bbb4c59e_staticRenderFns = []
new_edgevue_type_template_id_bbb4c59e_render._withStripped = true


;// CONCATENATED MODULE: ./components/new-edge.vue?vue&type=template&id=bbb4c59e&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/new-edge.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//

// import { defineComponent, onMounted, getCurrentInstance } from 'vue-demi'


/* harmony default export */ var new_edgevue_type_script_lang_js_ = ({
  data() {
    return {
      path: ''
    };
  },
  computed: {
    graph() {
      return this.$parent.graph;
    }
  },
  methods: {
    handlePath(createEdge) {
      if (!createEdge) {
        this.path = '';
      } else {
        const { fromPoint, toPoint } = createEdge;
        const direction = this.graph.get('direction');
        let x2 = toPoint.x;
        let y2 = toPoint.y;
        if (direction === 'LR') {
          x2 -= 5;
        } else {
          y2 -= 5;
        }

        this.path = calculateCurve({
          x1: fromPoint.x,
          y1: fromPoint.y,
          x2,
          y2
        }, direction);
      }
    }
  },
  mounted() {
    this.graph.on('edge:connecting', this.handlePath);
  }
  // setup() {
  //   onMounted(() => {
  //     const instance = getCurrentInstance().proxy
  //     instance.graph.on('edge:connecting', instance.handlePath)
  //   })
  // }
});
;// CONCATENATED MODULE: ./components/new-edge.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_new_edgevue_type_script_lang_js_ = (new_edgevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/new-edge.vue?vue&type=style&index=0&id=bbb4c59e&prod&lang=scss&
var new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_ = __webpack_require__(681);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/new-edge.vue?vue&type=style&index=0&id=bbb4c59e&prod&lang=scss&

            

var new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_options = {};

new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_options.insert = "head";
new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_options.singleton = false;

var new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_update = injectStylesIntoStyleTag_default()(new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_/* default */.Z, new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_options);



/* harmony default export */ var lib_vue_loader_options_components_new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_ = (new_edgevue_type_style_index_0_id_bbb4c59e_prod_lang_scss_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./components/new-edge.vue?vue&type=style&index=0&id=bbb4c59e&prod&lang=scss&

;// CONCATENATED MODULE: ./components/new-edge.vue



;


/* normalize component */

var new_edge_component = normalizeComponent(
  components_new_edgevue_type_script_lang_js_,
  new_edgevue_type_template_id_bbb4c59e_render,
  new_edgevue_type_template_id_bbb4c59e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var new_edge = (new_edge_component.exports);
;// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/arrow.vue?vue&type=template&id=009a6912&
var arrowvue_type_template_id_009a6912_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("defs", [
    _c(
      "marker",
      {
        attrs: {
          id: "arrow",
          overflow: "visible",
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        },
      },
      [
        _c("path", {
          staticClass: "graph-vue-arrow",
          attrs: {
            transform: "rotate(180)",
            d: "M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z",
          },
        }),
      ]
    ),
  ])
}
var arrowvue_type_template_id_009a6912_staticRenderFns = []
arrowvue_type_template_id_009a6912_render._withStripped = true


;// CONCATENATED MODULE: ./components/arrow.vue?vue&type=template&id=009a6912&

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/arrow.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import { defineComponent } from 'vue-demi'

/* harmony default export */ var arrowvue_type_script_lang_js_ = ({});
;// CONCATENATED MODULE: ./components/arrow.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_arrowvue_type_script_lang_js_ = (arrowvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/arrow.vue?vue&type=style&index=0&id=009a6912&prod&lang=scss&
var arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_ = __webpack_require__(890);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/arrow.vue?vue&type=style&index=0&id=009a6912&prod&lang=scss&

            

var arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_options = {};

arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_options.insert = "head";
arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_options.singleton = false;

var arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_update = injectStylesIntoStyleTag_default()(arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_/* default */.Z, arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_options);



/* harmony default export */ var lib_vue_loader_options_components_arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_ = (arrowvue_type_style_index_0_id_009a6912_prod_lang_scss_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./components/arrow.vue?vue&type=style&index=0&id=009a6912&prod&lang=scss&

;// CONCATENATED MODULE: ./components/arrow.vue



;


/* normalize component */

var arrow_component = normalizeComponent(
  components_arrowvue_type_script_lang_js_,
  arrowvue_type_template_id_009a6912_render,
  arrowvue_type_template_id_009a6912_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var arrow = (arrow_component.exports);
;// CONCATENATED MODULE: ./utils/isEqualWith.ts
function isEqualWith(obj1, obj2, customizer) {
    if (customizer && typeof customizer === 'function') {
        var result = customizer(obj1, obj2);
        if (result !== undefined) {
            return result;
        }
    }
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
        return false;
    }
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        if (!isEqualWith(obj1[key], obj2[key], customizer)) {
            return false;
        }
    }
    return true;
}

// EXTERNAL MODULE: ./node_modules/@datafe/graph-core/dist/core.min.js
var core_min = __webpack_require__(577);
// EXTERNAL MODULE: external {"root":"Vue","commonjs":"vue","commonjs2":"vue","amd":"vue"}
var external_root_Vue_commonjs_vue_commonjs2_vue_amd_vue_ = __webpack_require__(806);
var external_root_Vue_commonjs_vue_commonjs2_vue_amd_vue_default = /*#__PURE__*/__webpack_require__.n(external_root_Vue_commonjs_vue_commonjs2_vue_amd_vue_);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/graph.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import {
//   defineComponent,
//   onBeforeUnmount,
//   onMounted,
//   getCurrentInstance,
//   useSlots
// } from 'vue-demi'












console.log((external_root_Vue_commonjs_vue_commonjs2_vue_amd_vue_default()));

/* harmony default export */ var graphvue_type_script_lang_js_ = ({
  name: 'GraphVue',
  components: {
    NodeWrapper: node,
    EdgeWrapper: edge,
    Edge: components_edge,
    Node: components_node,
    Port: components_port,
    Arrow: arrow,
    NewEdge: new_edge
  },
  props: {
    action: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {
        return { nodes: [], edges: [] };
      }
    },
    layout: {
      type: Object,
      default: null
    },
    defaultNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      graph: null,
      nodes: [],
      edges: [],
      items: [],
      transform: {
        scale: 1,
        translateX: 0,
        translateY: 0
      },
      brushPath: ''
    };
  },
  watch: {
    data(val, prev) {
      if (isEqualWith(val, prev)) return;
      const data = JSON.parse(JSON.stringify(val));
      this.graph.data(data);
    },
    action(val, prev) {
      if (isEqualWith(val, prev)) return;
      this.graph.removeAction();
      this.graph.addAction(val);
    },
    layout: {
      handler(val, prev) {
        if (isEqualWith(val, prev)) return;
        this.graph.layout(val, false);
      },
      deep: true
    },
    'layout.options.rankdir'() {
      this.graph.layout(this.layout, false);
      this.graph.getNodes().forEach(node => {
        node.updatePorts(this.graph.get('direction'));
      });
    }
  },
  methods: {
    isEdge(item) {
      return item instanceof core_min.Edge;
    },
    isNode(item) {
      return item instanceof core_min.Node;
    },
    handleDrop(e) {
      this.$emit('drop', e);
    },
    init() {
      const graph = new core_min.Graph({
        container: this.$refs.svg,
        direction: this.layout && this.layout.options && this.layout.options.rankdir || 'TB',
        action: this.action,
        defaultNode: this.defaultNode
      });
      this.graph = graph;
      this.initCustomHooks();

      this.graph.data(JSON.parse(JSON.stringify(this.data)));
      this.checkAutoLayout();

      this.$emit('init', this.graph);
    },
    checkAutoLayout() {
      const { options } = this.layout || {};
      const hasOtherProps = options !== undefined && Object.keys(options).some(key => key !== 'rankdir' && options[key]);

      if (hasOtherProps) {
        this.graph.layout(this.layout);
      }
    },
    initCustomHooks() {
      const hooks = ['node:added', 'edge:added', 'node:click', 'edge:click', 'node:change', 'edge:change', 'port:change', 'port:added', 'port:deleted'];

      hooks.forEach(hook => {
        this.graph.on(hook, (...args) => {
          this.$emit(hook, ...args);
        });
      });

      this.graph.on('datachange', this.refreshGraph);
      this.graph.on('translate', this.aftertranslate);
      this.graph.on('zoom', this.afterzoom);
      this.graph.on('brushing', this.brushing);
    },
    brushing(path) {
      this.brushPath = path;
    },
    refreshGraph() {
      this.items = this.graph.getSortedItem();
    },
    aftertranslate(x, y) {
      this.transform.translateX = x;
      this.transform.translateY = y;
    },
    afterzoom(zoom) {
      this.transform.scale = zoom;
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.graph.destroy();
  }
  // setup() {
  //   const hasSlots = useSlots()

  //   onMounted(() => {
  //     const instance = getCurrentInstance().proxy
  //     instance.init()
  //   })

  //   onBeforeUnmount(() => {
  //     const instance = getCurrentInstance().proxy
  //     instance.graph.destroy()
  //   })

  //   return { hasSlots }
  // }
});
;// CONCATENATED MODULE: ./components/graph.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_graphvue_type_script_lang_js_ = (graphvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/graph.vue?vue&type=style&index=0&id=e240ebbc&prod&lang=scss&
var graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_ = __webpack_require__(716);
;// CONCATENATED MODULE: ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./components/graph.vue?vue&type=style&index=0&id=e240ebbc&prod&lang=scss&

            

var graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_options = {};

graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_options.insert = "head";
graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_options.singleton = false;

var graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_update = injectStylesIntoStyleTag_default()(graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_/* default */.Z, graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_options);



/* harmony default export */ var lib_vue_loader_options_components_graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_ = (graphvue_type_style_index_0_id_e240ebbc_prod_lang_scss_/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./components/graph.vue?vue&type=style&index=0&id=e240ebbc&prod&lang=scss&

;// CONCATENATED MODULE: ./components/graph.vue



;


/* normalize component */

var graph_component = normalizeComponent(
  components_graphvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var graph = (graph_component.exports);

/***/ }),

/***/ 806:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__806__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GraphVue: function() { return /* reexport safe */ _components_graph_vue__WEBPACK_IMPORTED_MODULE_0__.Z; }
/* harmony export */ });
/* harmony import */ var _components_graph_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(181);
/* harmony import */ var _datafe_graph_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(577);
/* harmony import */ var _datafe_graph_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_datafe_graph_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _datafe_graph_core__WEBPACK_IMPORTED_MODULE_1__) if(["default","GraphVue"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _datafe_graph_core__WEBPACK_IMPORTED_MODULE_1__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);

// import ToolBox from './components/tool-box.vue'
// import Menu from './components/menu.vue'
// import MiniMap from './components/minimap.vue'
var components = { GraphVue: _components_graph_vue__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z };


/* harmony default export */ __webpack_exports__["default"] = ({
    install: function (Vue) {
        Object.keys(components).forEach(function (key) {
            Vue.component(key, components[key]);
        });
    }
});

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});