/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("widget-stdmod",function(b){var f=b.Lang,q=b.Node,x=b.UA,e=b.Widget,d="",J="hd",G="bd",j="ft",D="header",M="body",K="footer",N="fillHeight",m="stdmod",u="Node",I="Content",C="firstChild",h="childNodes",n="ownerDocument",v="contentBox",z="height",F="offsetHeight",y="auto",l="headerContentChange",B="bodyContentChange",o="footerContentChange",r="fillHeightChange",t="heightChange",O="contentUpdate",w="renderUI",E="bindUI",g="syncUI",H="_applyParsedConfig",s=b.Widget.UI_SRC;function P(L){this._stdModNode=this.get(v);b.before(this._renderUIStdMod,this,w);b.before(this._bindUIStdMod,this,E);b.before(this._syncUIStdMod,this,g);}P.HEADER=D;P.BODY=M;P.FOOTER=K;P.AFTER="after";P.BEFORE="before";P.REPLACE="replace";var k=P.HEADER,A=P.BODY,p=P.FOOTER,a=k+I,c=p+I,i=A+I;P.ATTRS={headerContent:{value:null},footerContent:{value:null},bodyContent:{value:null},fillHeight:{value:P.BODY,validator:function(L){return this._validateFillHeight(L);}}};P.HTML_PARSER={headerContent:function(L){return this._parseStdModHTML(k);},bodyContent:function(L){return this._parseStdModHTML(A);},footerContent:function(L){return this._parseStdModHTML(p);}};P.SECTION_CLASS_NAMES={header:e.getClassName(J),body:e.getClassName(G),footer:e.getClassName(j)};P.TEMPLATES={header:'<div class="'+P.SECTION_CLASS_NAMES[k]+'"></div>',body:'<div class="'+P.SECTION_CLASS_NAMES[A]+'"></div>',footer:'<div class="'+P.SECTION_CLASS_NAMES[p]+'"></div>'};P.prototype={_syncUIStdMod:function(){var L=this._stdModParsed;if(!L||!L[a]){this._uiSetStdMod(k,this.get(a));}if(!L||!L[i]){this._uiSetStdMod(A,this.get(i));}if(!L||!L[c]){this._uiSetStdMod(p,this.get(c));}this._uiSetFillHeight(this.get(N));},_renderUIStdMod:function(){this._stdModNode.addClass(e.getClassName(m));this._renderStdModSections();this.after(l,this._afterHeaderChange);this.after(B,this._afterBodyChange);this.after(o,this._afterFooterChange);},_renderStdModSections:function(){if(f.isValue(this.get(a))){this._renderStdMod(k);}if(f.isValue(this.get(i))){this._renderStdMod(A);}if(f.isValue(this.get(c))){this._renderStdMod(p);}},_bindUIStdMod:function(){this.after(r,this._afterFillHeightChange);this.after(t,this._fillHeight);this.after(O,this._fillHeight);},_afterHeaderChange:function(L){if(L.src!==s){this._uiSetStdMod(k,L.newVal,L.stdModPosition);}},_afterBodyChange:function(L){if(L.src!==s){this._uiSetStdMod(A,L.newVal,L.stdModPosition);}},_afterFooterChange:function(L){if(L.src!==s){this._uiSetStdMod(p,L.newVal,L.stdModPosition);}},_afterFillHeightChange:function(L){this._uiSetFillHeight(L.newVal);},_validateFillHeight:function(L){return !L||L==P.BODY||L==P.HEADER||L==P.FOOTER;},_uiSetFillHeight:function(R){var Q=this.getStdModNode(R);var L=this._currFillNode;if(L&&Q!==L){L.setStyle(z,d);}if(Q){this._currFillNode=Q;}this._fillHeight();},_fillHeight:function(){if(this.get(N)){var L=this.get(z);if(L!=d&&L!=y){this.fillHeight(this._currFillNode);}}},_uiSetStdMod:function(S,R,L){if(f.isValue(R)){var Q=this.getStdModNode(S,true);this._addStdModContent(Q,R,L);this.set(S+I,this._getStdModContent(S),{src:s});}else{this._eraseStdMod(S);}this.fire(O);},_renderStdMod:function(R){var L=this.get(v),Q=this._findStdModSection(R);if(!Q){Q=this._getStdModTemplate(R);}this._insertStdModSection(L,R,Q);this[R+u]=Q;return this[R+u];},_eraseStdMod:function(Q){var L=this.getStdModNode(Q);if(L){L.remove(true);delete this[Q+u];}},_insertStdModSection:function(L,S,R){var Q=L.get(C);if(S===p||!Q){L.appendChild(R);}else{if(S===k){L.insertBefore(R,Q);}else{var T=this[p+u];if(T){L.insertBefore(R,T);}else{L.appendChild(R);}}}},_getStdModTemplate:function(L){return q.create(P.TEMPLATES[L],this._stdModNode.get(n));},_addStdModContent:function(R,Q,L){switch(L){case P.BEFORE:L=0;break;case P.AFTER:L=undefined;break;default:L=P.REPLACE;}R.insert(Q,L);},_getPreciseHeight:function(R){var L=(R)?R.get(F):0,S="getBoundingClientRect";if(R&&R.hasMethod(S)){var Q=R.invoke(S);if(Q){L=Q.bottom-Q.top;}}return L;},_findStdModSection:function(L){return this.get(v).one("> ."+P.SECTION_CLASS_NAMES[L]);},_parseStdModHTML:function(Q){var L=this._findStdModSection(Q);if(L){if(!this._stdModParsed){this._stdModParsed={};b.before(this._applyStdModParsedConfig,this,H);}this._stdModParsed[Q+I]=1;return L.get("innerHTML");}return null;},_applyStdModParsedConfig:function(S,L,R){var Q=this._stdModParsed;if(Q){Q[a]=!(a in L)&&(a in Q);Q[i]=!(i in L)&&(i in Q);Q[c]=!(c in L)&&(c in Q);}},_getStdModContent:function(L){return(this[L+u])?this[L+u].get(h):null;},setStdModContent:function(R,Q,L){this.set(R+I,Q,{stdModPosition:L});},getStdModNode:function(R,Q){var L=this[R+u]||null;if(!L&&Q){L=this._renderStdMod(R);}return L;},fillHeight:function(Q){if(Q){var V=this.get(v),W=[this.headerNode,this.bodyNode,this.footerNode],L,X,Y=0,T=0,S=false;for(var U=0,R=W.length;U<R;U++){L=W[U];if(L){if(L!==Q){Y+=this._getPreciseHeight(L);}else{S=true;}}}if(S){if(x.ie||x.opera){Q.set(F,0);}X=V.get(F)-parseInt(V.getComputedStyle("paddingTop"),10)-parseInt(V.getComputedStyle("paddingBottom"),10)-parseInt(V.getComputedStyle("borderBottomWidth"),10)-parseInt(V.getComputedStyle("borderTopWidth"),10);if(f.isNumber(X)){T=X-Y;if(T>=0){Q.set(F,T);}}}}}};b.WidgetStdMod=P;},"3.6.0",{requires:["base-build","widget"]});