/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("selector-native",function(a){(function(e){e.namespace("Selector");var c="compareDocumentPosition",d="ownerDocument";var b={_types:{esc:{token:"\uE000",re:/\\[:\[\]\(\)#\.\'\>+~"]/gi},attr:{token:"\uE001",re:/(\[[^\]]*\])/g},pseudo:{token:"\uE002",re:/(\([^\)]*\))/g}},useNative:true,_escapeId:function(f){if(f){f=f.replace(/([:\[\]\(\)#\.'<>+~"])/g,"\\$1");}return f;},_compare:("sourceIndex" in e.config.doc.documentElement)?function(i,h){var g=i.sourceIndex,f=h.sourceIndex;if(g===f){return 0;}else{if(g>f){return 1;}}return -1;}:(e.config.doc.documentElement[c]?function(g,f){if(g[c](f)&4){return -1;}else{return 1;}}:function(j,i){var h,f,g;if(j&&i){h=j[d].createRange();h.setStart(j,0);f=i[d].createRange();f.setStart(i,0);g=h.compareBoundaryPoints(1,f);}return g;}),_sort:function(f){if(f){f=e.Array(f,0,true);if(f.sort){f.sort(b._compare);}}return f;},_deDupe:function(f){var g=[],h,j;for(h=0;(j=f[h++]);){if(!j._found){g[g.length]=j;j._found=true;}}for(h=0;(j=g[h++]);){j._found=null;j.removeAttribute("_found");}return g;},query:function(g,o,p,f){o=o||e.config.doc;var l=[],h=(e.Selector.useNative&&e.config.doc.querySelector&&!f),k=[[g,o]],m,q,j,n=(h)?e.Selector._nativeQuery:e.Selector._bruteQuery;if(g&&n){if(!f&&(!h||o.tagName)){k=b._splitQueries(g,o);}for(j=0;(m=k[j++]);){q=n(m[0],m[1],p);if(!p){q=e.Array(q,0,true);}if(q){l=l.concat(q);}}if(k.length>1){l=b._sort(b._deDupe(l));}}return(p)?(l[0]||null):l;},_replaceSelector:function(f){var g=e.Selector._parse("esc",f),h,i;f=e.Selector._replace("esc",f);i=e.Selector._parse("pseudo",f);f=b._replace("pseudo",f);h=e.Selector._parse("attr",f);f=e.Selector._replace("attr",f);return{esc:g,attrs:h,pseudos:i,selector:f};},_restoreSelector:function(g){var f=g.selector;f=e.Selector._restore("attr",f,g.attrs);f=e.Selector._restore("pseudo",f,g.pseudos);f=e.Selector._restore("esc",f,g.esc);return f;},_replaceCommas:function(f){var g=e.Selector._replaceSelector(f),f=g.selector;if(f){f=f.replace(/,/g,"\uE007");g.selector=f;f=e.Selector._restoreSelector(g);}return f;},_splitQueries:function(h,l){if(h.indexOf(",")>-1){h=e.Selector._replaceCommas(h);}var g=h.split("\uE007"),j=[],m="",n,k,f;if(l){if(l.nodeType===1){n=e.Selector._escapeId(e.DOM.getId(l));if(!n){n=e.guid();e.DOM.setId(l,n);}m='[id="'+n+'"] ';}for(k=0,f=g.length;k<f;++k){h=m+g[k];j.push([h,l]);}}return j;},_nativeQuery:function(f,g,h){if(e.UA.webkit&&f.indexOf(":checked")>-1&&(e.Selector.pseudos&&e.Selector.pseudos.checked)){return e.Selector.query(f,g,h,true);}try{return g["querySelector"+(h?"":"All")](f);}catch(i){return e.Selector.query(f,g,h,true);}},filter:function(g,f){var h=[],j,k;if(g&&f){for(j=0;(k=g[j++]);){if(e.Selector.test(k,f)){h[h.length]=k;}}}else{}return h;},test:function(k,l,q){var o=false,g=false,h,r,u,p,t,f,n,m,s;if(k&&k.tagName){if(typeof l=="function"){o=l.call(k,k);}else{h=l.split(",");if(!q&&!e.DOM.inDoc(k)){r=k.parentNode;if(r){q=r;}else{t=k[d].createDocumentFragment();t.appendChild(k);q=t;g=true;}}q=q||k[d];f=e.Selector._escapeId(e.DOM.getId(k));if(!f){f=e.guid();e.DOM.setId(k,f);}for(n=0;(s=h[n++]);){s+='[id="'+f+'"]';p=e.Selector.query(s,q);for(m=0;u=p[m++];){if(u===k){o=true;break;}}if(o){break;}}if(g){t.removeChild(k);}}}return o;},ancestor:function(g,f,h){return e.DOM.ancestor(g,function(i){return e.Selector.test(i,f);},h);},_parse:function(g,f){return f.match(e.Selector._types[g].re);},_replace:function(g,f){var h=e.Selector._types[g];return f.replace(h.re,h.token);},_restore:function(j,g,h){if(h){var l=e.Selector._types[j].token,k,f;for(k=0,f=h.length;k<f;++k){g=g.replace(l,h[k]);}}return g;}};e.mix(e.Selector,b,true);})(a);},"3.6.0",{requires:["dom-base"]});