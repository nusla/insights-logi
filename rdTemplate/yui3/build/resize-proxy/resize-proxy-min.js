/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("resize-proxy",function(c){var n="activeHandleNode",i="cursor",g="dragCursor",l="host",k="parentNode",f="proxy",d="proxyNode",b="resize",a="resize-proxy",j="wrapper",e=c.ClassNameManager.getClassName,m=e(b,f);function h(){h.superclass.constructor.apply(this,arguments)}c.mix(h,{NAME:a,NS:f,ATTRS:{proxyNode:{setter:c.one,valueFn:function(){return c.Node.create(this.PROXY_TEMPLATE)}},renderInside:{value:false,setter:function(o){return o}}}});c.extend(h,c.Plugin.Base,{PROXY_TEMPLATE:'<div class="'+m+'"></div>',initializer:function(){var o=this;o.afterHostEvent("resize:start",o._afterResizeStart);o.beforeHostMethod("_resize",o._beforeHostResize);o.afterHostMethod("_resizeEnd",o._afterHostResizeEnd)},destructor:function(){var o=this;o.get(d).remove(true)},_afterHostResizeEnd:function(q){var o=this,p=q.dragEvent.target;p.actXY=[];o._syncProxyUI();o.get(d).hide()},_afterResizeStart:function(p){var o=this;o._renderProxy()},_beforeHostResize:function(q){var o=this,p=this.get(l);p._handleResizeAlignEvent(q.dragEvent);o._syncProxyUI();return new c.Do.Prevent()},_renderProxy:function(){var o=this,q=this.get(l),p=o.get(d),r=o.get("renderInside");if(!p.inDoc()){if(r){q.get(j).append(p.hide())}else{q.get(j).get(k).append(p.hide())}}},_syncProxyUI:function(){var o=this,q=this.get(l),s=q.info,r=q.get(n),p=o.get(d),t=r.getStyle(i);p.show().setStyle(i,t);q.delegate.dd.set(g,t);p.sizeTo(s.offsetWidth,s.offsetHeight);p.setXY([s.left,s.top])}});c.namespace("Plugin");c.Plugin.ResizeProxy=h},"3.6.0",{requires:["resize-base","plugin"],skinnable:false});