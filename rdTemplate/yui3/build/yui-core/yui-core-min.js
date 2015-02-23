/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if(typeof YUI!="undefined"){YUI._YUI=YUI;}var YUI=function(){var c=0,f=this,b=arguments,a=b.length,e=function(h,g){return(h&&h.hasOwnProperty&&(h instanceof g));},d=(typeof YUI_config!=="undefined")&&YUI_config;if(!(e(f,YUI))){f=new YUI();}else{f._init();if(YUI.GlobalConfig){f.applyConfig(YUI.GlobalConfig);}if(d){f.applyConfig(d);}if(!a){f._setup();}}if(a){for(;c<a;c++){f.applyConfig(b[c]);}f._setup();}f.instanceOf=e;return f;};(function(){var q,b,r="3.6.0",i=".",o="http://yui.yahooapis.com/",u="yui3-js-enabled",d="yui3-css-stamp",m=function(){},h=Array.prototype.slice,s={"io.xdrReady":1,"io.xdrResponse":1,"SWF.eventHandler":1},g=(typeof window!="undefined"),f=(g)?window:null,w=(g)?f.document:null,e=w&&w.documentElement,a=e&&e.className,c={},j=new Date().getTime(),n=function(A,z,y,x){if(A&&A.addEventListener){A.addEventListener(z,y,x);}else{if(A&&A.attachEvent){A.attachEvent("on"+z,y);}}},v=function(B,A,z,x){if(B&&B.removeEventListener){try{B.removeEventListener(A,z,x);}catch(y){}}else{if(B&&B.detachEvent){B.detachEvent("on"+A,z);}}},t=function(){YUI.Env.windowLoaded=true;YUI.Env.DOMReady=true;if(g){v(window,"load",t);}},k=function(C,B){var y=C.Env._loader,A=["loader-base"],x=YUI.Env,z=x.mods;if(y){y.ignoreRegistered=false;y.onEnd=null;y.data=null;y.required=[];y.loadType=null;}else{y=new C.Loader(C.config);C.Env._loader=y;}if(z&&z.loader){A=[].concat(A,YUI.Env.loaderExtras);}YUI.Env.core=C.Array.dedupe([].concat(YUI.Env.core,A));return y;},p=function(z,y){for(var x in y){if(y.hasOwnProperty(x)){z[x]=y[x];}}},l={success:true};if(e&&a.indexOf(u)==-1){if(a){a+=" ";}a+=u;e.className=a;}if(r.indexOf("@")>-1){r="3.5.0";}q={applyConfig:function(E){E=E||m;var z,C,B=this.config,D=B.modules,y=B.groups,A=B.aliases,x=this.Env._loader;for(C in E){if(E.hasOwnProperty(C)){z=E[C];if(D&&C=="modules"){p(D,z);}else{if(A&&C=="aliases"){p(A,z);}else{if(y&&C=="groups"){p(y,z);}else{if(C=="win"){B[C]=(z&&z.contentWindow)||z;B.doc=B[C]?B[C].document:null;}else{if(C=="_yuid"){}else{B[C]=z;}}}}}}}if(x){x._config(E);}},_config:function(x){this.applyConfig(x);},_init:function(){var A,z,B=this,x=YUI.Env,y=B.Env,C;B.version=r;if(!y){B.Env={core:["get","intl-base"],loaderExtras:["loader-rollup","loader-yui3"],mods:{},versions:{},base:o,cdn:o+r+"/build/",_idx:0,_used:{},_attached:{},_missed:[],_yidx:0,_uidx:0,_guidp:"y",_loaded:{},_BASE_RE:/(?:\?(?:[^&]*&)*([^&]*))?\b(simpleyui|yui(?:-\w+)?)\/\2(?:-(min|debug))?\.js/,parseBasePath:function(H,F){var D=H.match(F),G,E;if(D){G=RegExp.leftContext||H.slice(0,H.indexOf(D[0]));E=D[3];if(D[1]){G+="?"+D[1];}G={filter:E,path:G};}return G;},getBase:x&&x.getBase||function(H){var F=(w&&w.getElementsByTagName("script"))||[],I=y.cdn,E,G,D,J;for(G=0,D=F.length;G<D;++G){J=F[G].src;if(J){E=B.Env.parseBasePath(J,H);if(E){A=E.filter;I=E.path;break;}}}return I;}};y=B.Env;y._loaded[r]={};if(x&&B!==YUI){y._yidx=++x._yidx;y._guidp=("yui_"+r+"_"+y._yidx+"_"+j).replace(/\./g,"_").replace(/-/g,"_");}else{if(YUI._YUI){x=YUI._YUI.Env;y._yidx+=x._yidx;y._uidx+=x._uidx;for(C in x){if(!(C in y)){y[C]=x[C];}}delete YUI._YUI;}}B.id=B.stamp(B);c[B.id]=B;}B.constructor=YUI;B.config=B.config||{bootstrap:true,cacheUse:true,debug:true,doc:w,fetchCSS:true,throwFail:true,useBrowserConsole:true,useNativeES5:true,win:f};if(w&&!w.getElementById(d)){z=w.createElement("div");z.innerHTML='<div id="'+d+'" style="position: absolute !important; visibility: hidden !important"></div>';YUI.Env.cssStampEl=z.firstChild;if(w.body){w.body.appendChild(YUI.Env.cssStampEl);}else{e.insertBefore(YUI.Env.cssStampEl,e.firstChild);}}B.config.lang=B.config.lang||"en-US";B.config.base=YUI.config.base||B.Env.getBase(B.Env._BASE_RE);if(!A||(!("mindebug").indexOf(A))){A="min";}A=(A)?"-"+A:A;B.config.loaderPath=YUI.config.loaderPath||"loader/loader"+A+".js";},_setup:function(C){var y,B=this,x=[],A=YUI.Env.mods,z=B.config.core||[].concat(YUI.Env.core);for(y=0;y<z.length;y++){if(A[z[y]]){x.push(z[y]);}}B._attach(["yui-base"]);B._attach(x);if(B.Loader){k(B);}},applyTo:function(D,C,z){if(!(C in s)){this.log(C+": applyTo not allowed","warn","yui");return null;}var y=c[D],B,x,A;if(y){B=C.split(".");x=y;for(A=0;A<B.length;A=A+1){x=x[B[A]];if(!x){this.log("applyTo not found: "+C,"warn","yui");}}return x&&x.apply(y,z);}return null;},add:function(y,F,E,x){x=x||{};var D=YUI.Env,G={name:y,fn:F,version:E,details:x},A={},H,C,B,z=D.versions;D.mods[y]=G;z[E]=z[E]||{};z[E][y]=G;for(B in c){if(c.hasOwnProperty(B)){C=c[B];if(!A[C.id]){A[C.id]=true;H=C.Env._loader;if(H){if(!H.moduleInfo[y]||H.moduleInfo[y].temp){H.addModule(x,y);}}}}}return this;},_attach:function(E,Q){var J,R,P,M,x,H,z,A=YUI.Env.mods,K=YUI.Env.aliases,y=this,I,D=YUI.Env._renderedMods,B=y.Env._loader,F=y.Env._attached,L=E.length,B,C,G,O=[];for(J=0;J<L;J++){R=E[J];P=A[R];O.push(R);if(B&&B.conditions[R]){for(I in B.conditions[R]){if(B.conditions[R].hasOwnProperty(I)){C=B.conditions[R][I];G=C&&((C.ua&&y.UA[C.ua])||(C.test&&C.test(y)));if(G){O.push(C.name);}}}}}E=O;L=E.length;for(J=0;J<L;J++){if(!F[E[J]]){R=E[J];P=A[R];if(K&&K[R]&&!P){y._attach(K[R]);continue;}if(!P){if(B&&B.moduleInfo[R]){P=B.moduleInfo[R];Q=true;}if(!Q&&R){if((R.indexOf("skin-")===-1)&&(R.indexOf("css")===-1)){y.Env._missed.push(R);y.Env._missed=y.Array.dedupe(y.Env._missed);y.message("NOT loaded: "+R,"warn","yui");}}}else{F[R]=true;for(I=0;I<y.Env._missed.length;I++){if(y.Env._missed[I]===R){y.message("Found: "+R+" (was reported as missing earlier)","warn","yui");y.Env._missed.splice(I,1);}}if(B&&D&&D[R]&&D[R].temp){B.getRequires(D[R]);x=[];for(I in B.moduleInfo[R].expanded_map){if(B.moduleInfo[R].expanded_map.hasOwnProperty(I)){x.push(I);}}y._attach(x);}M=P.details;x=M.requires;H=M.use;z=M.after;if(M.lang){x=x||[];x.unshift("intl");}if(x){for(I=0;I<x.length;I++){if(!F[x[I]]){if(!y._attach(x)){return false;}break;}}}if(z){for(I=0;I<z.length;I++){if(!F[z[I]]){if(!y._attach(z,true)){return false;}break;}}}if(P.fn){if(y.config.throwFail){P.fn(y,R);}else{try{P.fn(y,R);}catch(N){y.error("Attach error: "+R,N,R);return false;}}}if(H){for(I=0;
I<H.length;I++){if(!F[H[I]]){if(!y._attach(H)){return false;}break;}}}}}}return true;},_delayCallback:function(x,A){var z=this,y=["event-base"];A=(z.Lang.isObject(A)?A:{event:A});if(A.event==="load"){y.push("event-synthetic");}return function(){var B=arguments;z._use(y,function(){z.on(A.event,function(){B[1].delayUntil=A.event;x.apply(z,B);},A.args);});};},use:function(){var A=h.call(arguments,0),E=A[A.length-1],D=this,C=0,y=[],z,x=D.Env,B=true;if(D.Lang.isFunction(E)){A.pop();if(D.config.delayUntil){E=D._delayCallback(E,D.config.delayUntil);}}else{E=null;}if(D.Lang.isArray(A[0])){A=A[0];}if(D.config.cacheUse){while((z=A[C++])){if(!x._attached[z]){B=false;break;}}if(B){if(A.length){}D._notify(E,l,A);return D;}}if(D._loading){D._useQueue=D._useQueue||new D.Queue();D._useQueue.add([A,E]);}else{D._use(A,function(G,F){G._notify(E,F,A);});}return D;},_notify:function(A,x,y){if(!x.success&&this.config.loadErrorFn){this.config.loadErrorFn.call(this,this,A,x,y);}else{if(A){if(this.Env._missed&&this.Env._missed.length){x.msg="Missing modules: "+this.Env._missed.join();x.success=false;}if(this.config.throwFail){A(this,x);}else{try{A(this,x);}catch(z){this.error("use callback error",z,y);}}}}},_use:function(z,B){if(!this.Array){this._attach(["yui-base"]);}var P,G,Q,L,y=this,R=YUI.Env,A=R.mods,x=y.Env,D=x._used,O=R.aliases,K=R._loaderQueue,U=z[0],F=y.Array,S=y.config,E=S.bootstrap,M=[],N,I=[],T=true,C=S.fetchCSS,J=function(aa,ad){var Y=0,ac=[],W,Z,X,ab,V;if(!aa.length){return;}if(O){Z=aa.length;for(Y=0;Y<Z;Y++){if(O[aa[Y]]&&!A[aa[Y]]){ac=[].concat(ac,O[aa[Y]]);}else{ac.push(aa[Y]);}}aa=ac;}Z=aa.length;for(Y=0;Y<Z;Y++){W=aa[Y];if(!ad){I.push(W);}if(D[W]){continue;}X=A[W];ab=null;V=null;if(X){D[W]=true;ab=X.details.requires;V=X.details.use;}else{if(!R._loaded[r][W]){M.push(W);}else{D[W]=true;}}if(ab&&ab.length){J(ab);}if(V&&V.length){J(V,1);}}},H=function(Z){var X=Z||{success:true,msg:"not dynamic"},W,V,Y=true,aa=X.data;y._loading=false;if(aa){V=M;M=[];I=[];J(aa);W=M.length;if(W){if([].concat(M).sort().join()==V.sort().join()){W=false;}}}if(W&&aa){y._loading=true;y._use(M,function(){if(y._attach(aa)){y._notify(B,X,aa);}});}else{if(aa){Y=y._attach(aa);}if(Y){y._notify(B,X,z);}}if(y._useQueue&&y._useQueue.size()&&!y._loading){y._use.apply(y,y._useQueue.next());}};if(U==="*"){z=[];for(N in A){if(A.hasOwnProperty(N)){z.push(N);}}T=y._attach(z);if(T){H();}return y;}if((A.loader||A["loader-base"])&&!y.Loader){y._attach(["loader"+((!A.loader)?"-base":"")]);}if(E&&y.Loader&&z.length){G=k(y);G.require(z);G.ignoreRegistered=true;G._boot=true;G.calculate(null,(C)?null:"js");z=G.sorted;G._boot=false;}J(z);P=M.length;if(P){M=F.dedupe(M);P=M.length;}if(E&&P&&y.Loader){y._loading=true;G=k(y);G.onEnd=H;G.context=y;G.data=z;G.ignoreRegistered=false;G.require(z);G.insert(null,(C)?null:"js");}else{if(E&&P&&y.Get&&!x.bootstrapped){y._loading=true;Q=function(){y._loading=false;K.running=false;x.bootstrapped=true;R._bootstrapping=false;if(y._attach(["loader"])){y._use(z,B);}};if(R._bootstrapping){K.add(Q);}else{R._bootstrapping=true;y.Get.script(S.base+S.loaderPath,{onEnd:Q});}}else{T=y._attach(z);if(T){H();}}}return y;},namespace:function(){var y=arguments,C,A=0,z,B,x;for(;A<y.length;A++){C=this;x=y[A];if(x.indexOf(i)>-1){B=x.split(i);for(z=(B[0]=="YAHOO")?1:0;z<B.length;z++){C[B[z]]=C[B[z]]||{};C=C[B[z]];}}else{C[x]=C[x]||{};C=C[x];}}return C;},log:m,message:m,dump:function(x){return""+x;},error:function(B,y,A){var z=this,x;if(z.config.errorFn){x=z.config.errorFn.apply(z,arguments);}if(!x){throw (y||new Error(B));}else{z.message(B,"error",""+A);}return z;},guid:function(x){var y=this.Env._guidp+"_"+(++this.Env._uidx);return(x)?(x+y):y;},stamp:function(z,A){var x;if(!z){return z;}if(z.uniqueID&&z.nodeType&&z.nodeType!==9){x=z.uniqueID;}else{x=(typeof z==="string")?z:z._yuid;}if(!x){x=this.guid();if(!A){try{z._yuid=x;}catch(y){x=null;}}}return x;},destroy:function(){var x=this;if(x.Event){x.Event._unload();}delete c[x.id];delete x.Env;delete x.config;}};YUI.prototype=q;for(b in q){if(q.hasOwnProperty(b)){YUI[b]=q[b];}}YUI.applyConfig=function(x){if(!x){return;}if(YUI.GlobalConfig){this.prototype.applyConfig.call(this,YUI.GlobalConfig);}this.prototype.applyConfig.call(this,x);YUI.GlobalConfig=this.config;};YUI._init();if(g){n(window,"load",t);}else{t();}YUI.Env.add=n;YUI.Env.remove=v;if(typeof exports=="object"){exports.YUI=YUI;}}());YUI.add("yui-base",function(b){var i=b.Lang||(b.Lang={}),n=String.prototype,k=Object.prototype.toString,a={"undefined":"undefined","number":"number","boolean":"boolean","string":"string","[object Function]":"function","[object RegExp]":"regexp","[object Array]":"array","[object Date]":"date","[object Error]":"error"},c=/\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g,r=/^\s+|\s+$/g,e=/\{\s*\[(?:native code|function)\]\s*\}/i;i._isNative=function(v){return !!(b.config.useNativeES5&&v&&e.test(v));};i.isArray=i._isNative(Array.isArray)?Array.isArray:function(v){return i.type(v)==="array";};i.isBoolean=function(v){return typeof v==="boolean";};i.isDate=function(v){return i.type(v)==="date"&&v.toString()!=="Invalid Date"&&!isNaN(v);};i.isFunction=function(v){return i.type(v)==="function";};i.isNull=function(v){return v===null;};i.isNumber=function(v){return typeof v==="number"&&isFinite(v);};i.isObject=function(x,w){var v=typeof x;return(x&&(v==="object"||(!w&&(v==="function"||i.isFunction(x)))))||false;};i.isString=function(v){return typeof v==="string";};i.isUndefined=function(v){return typeof v==="undefined";};i.isValue=function(w){var v=i.type(w);switch(v){case"number":return isFinite(w);case"null":case"undefined":return false;default:return !!v;}};i.now=Date.now||function(){return new Date().getTime();};i.sub=function(v,w){return v.replace?v.replace(c,function(x,y){return i.isUndefined(w[y])?x:w[y];}):v;};i.trim=n.trim?function(v){return v&&v.trim?v.trim():v;}:function(v){try{return v.replace(r,"");}catch(w){return v;}};i.trimLeft=n.trimLeft?function(v){return v.trimLeft();}:function(v){return v.replace(/^\s+/,"");
};i.trimRight=n.trimRight?function(v){return v.trimRight();}:function(v){return v.replace(/\s+$/,"");};i.type=function(v){return a[typeof v]||a[k.call(v)]||(v?"object":"null");};var f=b.Lang,q=Array.prototype,o=Object.prototype.hasOwnProperty;function j(x,A,z){var w,v;A||(A=0);if(z||j.test(x)){try{return q.slice.call(x,A);}catch(y){v=[];for(w=x.length;A<w;++A){v.push(x[A]);}return v;}}return[x];}b.Array=j;j.dedupe=function(A){var z={},x=[],w,y,v;for(w=0,v=A.length;w<v;++w){y=A[w];if(!o.call(z,y)){z[y]=1;x.push(y);}}return x;};j.each=j.forEach=f._isNative(q.forEach)?function(x,v,w){q.forEach.call(x||[],v,w||b);return b;}:function(z,x,y){for(var w=0,v=(z&&z.length)||0;w<v;++w){if(w in z){x.call(y||b,z[w],w,z);}}return b;};j.hash=function(y,w){var z={},A=(w&&w.length)||0,x,v;for(x=0,v=y.length;x<v;++x){if(x in y){z[y[x]]=A>x&&x in w?w[x]:true;}}return z;};j.indexOf=f._isNative(q.indexOf)?function(x,v,w){return q.indexOf.call(x,v,w);}:function(y,w,x){var v=y.length;x=+x||0;x=(x>0||-1)*Math.floor(Math.abs(x));if(x<0){x+=v;if(x<0){x=0;}}for(;x<v;++x){if(x in y&&y[x]===w){return x;}}return -1;};j.numericSort=function(w,v){return w-v;};j.some=f._isNative(q.some)?function(x,v,w){return q.some.call(x,v,w);}:function(z,x,y){for(var w=0,v=z.length;w<v;++w){if(w in z&&x.call(y,z[w],w,z)){return true;}}return false;};j.test=function(x){var v=0;if(f.isArray(x)){v=1;}else{if(f.isObject(x)){try{if("length" in x&&!x.tagName&&!x.alert&&!x.apply){v=2;}}catch(w){}}}return v;};function t(){this._init();this.add.apply(this,arguments);}t.prototype={_init:function(){this._q=[];},next:function(){return this._q.shift();},last:function(){return this._q.pop();},add:function(){this._q.push.apply(this._q,arguments);return this;},size:function(){return this._q.length;}};b.Queue=t;YUI.Env._loaderQueue=YUI.Env._loaderQueue||new t();var m="__",o=Object.prototype.hasOwnProperty,l=b.Lang.isObject;b.cached=function(x,v,w){v||(v={});return function(y){var z=arguments.length>1?Array.prototype.join.call(arguments,m):String(y);if(!(z in v)||(w&&v[z]==w)){v[z]=x.apply(x,arguments);}return v[z];};};b.getLocation=function(){var v=b.config.win;return v&&v.location;};b.merge=function(){var x=arguments,y=0,w=x.length,v={};for(;y<w;++y){b.mix(v,x[y],true);}return v;};b.mix=function(v,w,C,x,z,D){var A,G,F,y,H,B,E;if(!v||!w){return v||b;}if(z){if(z===2){b.mix(v.prototype,w.prototype,C,x,0,D);}F=z===1||z===3?w.prototype:w;E=z===1||z===4?v.prototype:v;if(!F||!E){return v;}}else{F=w;E=v;}A=C&&!D;if(x){for(y=0,B=x.length;y<B;++y){H=x[y];if(!o.call(F,H)){continue;}G=A?false:H in E;if(D&&G&&l(E[H],true)&&l(F[H],true)){b.mix(E[H],F[H],C,null,0,D);}else{if(C||!G){E[H]=F[H];}}}}else{for(H in F){if(!o.call(F,H)){continue;}G=A?false:H in E;if(D&&G&&l(E[H],true)&&l(F[H],true)){b.mix(E[H],F[H],C,null,0,D);}else{if(C||!G){E[H]=F[H];}}}if(b.Object._hasEnumBug){b.mix(E,F,C,b.Object._forceEnum,z,D);}}return v;};var f=b.Lang,o=Object.prototype.hasOwnProperty,u,g=b.Object=f._isNative(Object.create)?function(v){return Object.create(v);}:(function(){function v(){}return function(w){v.prototype=w;return new v();};}()),d=g._forceEnum=["hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toString","toLocaleString","valueOf"],s=g._hasEnumBug=!{valueOf:0}.propertyIsEnumerable("valueOf"),p=g._hasProtoEnumBug=(function(){}).propertyIsEnumerable("prototype"),h=g.owns=function(w,v){return !!w&&o.call(w,v);};g.hasKey=h;g.keys=f._isNative(Object.keys)?Object.keys:function(z){if(!f.isObject(z)){throw new TypeError("Object.keys called on a non-object");}var y=[],x,w,v;if(p&&typeof z==="function"){for(w in z){if(h(z,w)&&w!=="prototype"){y.push(w);}}}else{for(w in z){if(h(z,w)){y.push(w);}}}if(s){for(x=0,v=d.length;x<v;++x){w=d[x];if(h(z,w)){y.push(w);}}}return y;};g.values=function(z){var y=g.keys(z),x=0,v=y.length,w=[];for(;x<v;++x){w.push(z[y[x]]);}return w;};g.size=function(w){try{return g.keys(w).length;}catch(v){return 0;}};g.hasValue=function(w,v){return b.Array.indexOf(g.values(w),v)>-1;};g.each=function(y,w,z,x){var v;for(v in y){if(x||h(y,v)){w.call(z||b,y[v],v,y);}}return b;};g.some=function(y,w,z,x){var v;for(v in y){if(x||h(y,v)){if(w.call(z||b,y[v],v,y)){return true;}}}return false;};g.getValue=function(z,y){if(!f.isObject(z)){return u;}var w,x=b.Array(y),v=x.length;for(w=0;z!==u&&w<v;w++){z=z[x[w]];}return z;};g.setValue=function(B,z,A){var v,y=b.Array(z),x=y.length-1,w=B;if(x>=0){for(v=0;w!==u&&v<x;v++){w=w[y[v]];}if(w!==u){w[y[v]]=A;}else{return u;}}return B;};g.isEmpty=function(v){return !g.keys(Object(v)).length;};YUI.Env.parseUA=function(B){var A=function(E){var F=0;return parseFloat(E.replace(/\./g,function(){return(F++==1)?"":".";}));},D=b.config.win,v=D&&D.navigator,y={ie:0,opera:0,gecko:0,webkit:0,safari:0,chrome:0,mobile:null,air:0,phantomjs:0,air:0,ipad:0,iphone:0,ipod:0,ios:null,android:0,silk:0,accel:false,webos:0,caja:v&&v.cajaVersion,secure:false,os:null,nodejs:0},w=B||v&&v.userAgent,C=D&&D.location,x=C&&C.href,z;y.userAgent=w;y.secure=x&&(x.toLowerCase().indexOf("https")===0);if(w){if((/windows|win32/i).test(w)){y.os="windows";}else{if((/macintosh|mac_powerpc/i).test(w)){y.os="macintosh";}else{if((/android/i).test(w)){y.os="android";}else{if((/symbos/i).test(w)){y.os="symbos";}else{if((/linux/i).test(w)){y.os="linux";}else{if((/rhino/i).test(w)){y.os="rhino";}}}}}}if((/KHTML/).test(w)){y.webkit=1;}if((/IEMobile|XBLWP7/).test(w)){y.mobile="windows";}if((/Fennec/).test(w)){y.mobile="gecko";}z=w.match(/AppleWebKit\/([^\s]*)/);if(z&&z[1]){y.webkit=A(z[1]);y.safari=y.webkit;if(/PhantomJS/.test(w)){z=w.match(/PhantomJS\/([^\s]*)/);if(z&&z[1]){y.phantomjs=A(z[1]);}}if(/ Mobile\//.test(w)||(/iPad|iPod|iPhone/).test(w)){y.mobile="Apple";z=w.match(/OS ([^\s]*)/);if(z&&z[1]){z=A(z[1].replace("_","."));}y.ios=z;y.os="ios";y.ipad=y.ipod=y.iphone=0;z=w.match(/iPad|iPod|iPhone/);if(z&&z[0]){y[z[0].toLowerCase()]=y.ios;}}else{z=w.match(/NokiaN[^\/]*|webOS\/\d\.\d/);if(z){y.mobile=z[0];}if(/webOS/.test(w)){y.mobile="WebOS";z=w.match(/webOS\/([^\s]*);/);if(z&&z[1]){y.webos=A(z[1]);
}}if(/ Android/.test(w)){if(/Mobile/.test(w)){y.mobile="Android";}z=w.match(/Android ([^\s]*);/);if(z&&z[1]){y.android=A(z[1]);}}if(/Silk/.test(w)){z=w.match(/Silk\/([^\s]*)\)/);if(z&&z[1]){y.silk=A(z[1]);}if(!y.android){y.android=2.34;y.os="Android";}if(/Accelerated=true/.test(w)){y.accel=true;}}}z=w.match(/(Chrome|CrMo|CriOS)\/([^\s]*)/);if(z&&z[1]&&z[2]){y.chrome=A(z[2]);y.safari=0;if(z[1]==="CrMo"){y.mobile="chrome";}}else{z=w.match(/AdobeAIR\/([^\s]*)/);if(z){y.air=z[0];}}}if(!y.webkit){if(/Opera/.test(w)){z=w.match(/Opera[\s\/]([^\s]*)/);if(z&&z[1]){y.opera=A(z[1]);}z=w.match(/Version\/([^\s]*)/);if(z&&z[1]){y.opera=A(z[1]);}if(/Opera Mobi/.test(w)){y.mobile="opera";z=w.replace("Opera Mobi","").match(/Opera ([^\s]*)/);if(z&&z[1]){y.opera=A(z[1]);}}z=w.match(/Opera Mini[^;]*/);if(z){y.mobile=z[0];}}else{z=w.match(/MSIE\s([^;]*)/);if(z&&z[1]){y.ie=A(z[1]);}else{z=w.match(/Gecko\/([^\s]*)/);if(z){y.gecko=1;z=w.match(/rv:([^\s\)]*)/);if(z&&z[1]){y.gecko=A(z[1]);}}}}}}if(!B){if(typeof process=="object"){if(process.versions&&process.versions.node){y.os=process.platform;y.nodejs=A(process.versions.node);}}YUI.Env.UA=y;}return y;};b.UA=YUI.Env.UA||YUI.Env.parseUA();b.UA.compareVersions=function(x,w){var C,B,z,A,y,v;if(x===w){return 0;}B=(x+"").split(".");A=(w+"").split(".");for(y=0,v=Math.max(B.length,A.length);y<v;++y){C=parseInt(B[y],10);z=parseInt(A[y],10);isNaN(C)&&(C=0);isNaN(z)&&(z=0);if(C<z){return -1;}if(C>z){return 1;}}return 0;};YUI.Env.aliases={"anim":["anim-base","anim-color","anim-curve","anim-easing","anim-node-plugin","anim-scroll","anim-xy"],"app":["app-base","app-transitions","lazy-model-list","model","model-list","model-sync-rest","router","view","view-node-map"],"attribute":["attribute-base","attribute-complex"],"autocomplete":["autocomplete-base","autocomplete-sources","autocomplete-list","autocomplete-plugin"],"base":["base-base","base-pluginhost","base-build"],"cache":["cache-base","cache-offline","cache-plugin"],"collection":["array-extras","arraylist","arraylist-add","arraylist-filter","array-invoke"],"controller":["router"],"dataschema":["dataschema-base","dataschema-json","dataschema-xml","dataschema-array","dataschema-text"],"datasource":["datasource-local","datasource-io","datasource-get","datasource-function","datasource-cache","datasource-jsonschema","datasource-xmlschema","datasource-arrayschema","datasource-textschema","datasource-polling"],"datatable":["datatable-core","datatable-table","datatable-head","datatable-body","datatable-base","datatable-column-widths","datatable-message","datatable-mutable","datatable-sort","datatable-datasource"],"datatable-deprecated":["datatable-base-deprecated","datatable-datasource-deprecated","datatable-sort-deprecated","datatable-scroll-deprecated"],"datatype":["datatype-number","datatype-date","datatype-xml"],"datatype-date":["datatype-date-parse","datatype-date-format"],"datatype-number":["datatype-number-parse","datatype-number-format"],"datatype-xml":["datatype-xml-parse","datatype-xml-format"],"dd":["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-drop","dd-scroll","dd-delegate"],"dom":["dom-base","dom-screen","dom-style","selector-native","selector"],"editor":["frame","editor-selection","exec-command","editor-base","editor-para","editor-br","editor-bidi","editor-tab","createlink-base"],"event":["event-base","event-delegate","event-synthetic","event-mousewheel","event-mouseenter","event-key","event-focus","event-resize","event-hover","event-outside","event-touch","event-move","event-flick","event-valuechange"],"event-custom":["event-custom-base","event-custom-complex"],"event-gestures":["event-flick","event-move"],"handlebars":["handlebars-compiler"],"highlight":["highlight-base","highlight-accentfold"],"history":["history-base","history-hash","history-hash-ie","history-html5"],"io":["io-base","io-xdr","io-form","io-upload-iframe","io-queue"],"json":["json-parse","json-stringify"],"loader":["loader-base","loader-rollup","loader-yui3"],"node":["node-base","node-event-delegate","node-pluginhost","node-screen","node-style"],"pluginhost":["pluginhost-base","pluginhost-config"],"querystring":["querystring-parse","querystring-stringify"],"recordset":["recordset-base","recordset-sort","recordset-filter","recordset-indexer"],"resize":["resize-base","resize-proxy","resize-constrain"],"slider":["slider-base","slider-value-range","clickable-rail","range-slider"],"text":["text-accentfold","text-wordbreak"],"widget":["widget-base","widget-htmlparser","widget-skin","widget-uievents"]};},"3.6.0");