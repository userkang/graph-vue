!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["graph-vue"]=t():e["graph-vue"]=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t,n){(e.exports=n(3)(!1)).push([e.i,".graph-node[data-v-3c38d7c4]{height:100%;display:flex;justify-content:center;align-items:center;font-size:12px;color:#666;border-width:1px;border-style:solid;border-radius:2px;box-sizing:border-box;cursor:pointer}.w-100[data-v-3c38d7c4]{width:100%}.h-100[data-v-3c38d7c4]{height:100%}",""])},function(e){e.exports=JSON.parse('{"name":"graph-vue","version":"0.1.0","scripts":{"start":"npm run serve","serve":"vue-cli-service serve","lint":"vue-cli-service lint","test":"echo test","build":"webpack --config webpack.config.js"},"dependencies":{"@datafe/graph-core":"^0.3.9","core-js":"^2.6.11","url-loader":"^2.2.0","vue":"2.6.12","vue-class-component":"^6.0.0","vue-property-decorator":"^7.0.0","vue-router":"3.0.7","vuex":"^3.0.1"},"devDependencies":{"@types/mockjs":"^1.0.2","@vue/cli-plugin-babel":"^3.0.0","@vue/cli-plugin-typescript":"^3.0.0","@vue/cli-service":"^3.0.0","html-webpack-plugin":"^3.2.0","lint-staged":"^7.2.2","mockjs":"^1.0.1-beta3","path-to-regexp":"^3.0.0","sass":"^1.23.3","sass-loader":"^7.0.1","typescript":"^3.1.3","vue-template-compiler":"2.6.12","webpack-bundle-analyzer":"^3.0.3"},"gitHooks":{"pre-commit":"lint-staged"},"lint-staged":{"src/*":["yarn lint","git add ."]}}')},function(e,t,n){"use strict";n(0)},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(s=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),i=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(i).concat([o]).join("\n")}var s;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<e.length;o++){var s=e[o];"number"==typeof s[0]&&r[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(e,t,n){"use strict";n.r(t),n.d(t,"Node",(function(){return u}));var r=n(1),o=function(){var e=this.$createElement;return(this._self._c||e)("div",[this._v("hello")])};o._withStripped=!0;var i={};n(2);var s=function(e,t,n,r,o,i,s,c){var u,a="function"==typeof e?e.options:e;if(t&&(a.render=t,a.staticRenderFns=n,a._compiled=!0),r&&(a.functional=!0),i&&(a._scopeId="data-v-"+i),s?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},a._ssrRegister=u):o&&(u=c?function(){o.call(this,(a.functional?this.parent:this).$root.$options.shadowRoot)}:o),u)if(a.functional){a._injectStyles=u;var p=a.render;a.render=function(e,t){return u.call(t),p(e,t)}}else{var d=a.beforeCreate;a.beforeCreate=d?[].concat(d,u):[u]}return{exports:e,options:a}}(i,o,[],!1,null,"3c38d7c4",null);s.options.__file="components/node/node.vue";var c=s.exports;c.install=e=>{e.component(c.name,c)};var u=c;const a=[u],p=function(e){a.map(t=>{e.component(t.name,t)})};"undefined"!=typeof window&&window.Vue&&p(window.Vue);t.default={install:p,version:r}}])}));