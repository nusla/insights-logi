/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("base-base",function(b){var g=b.Lang,e="destroy",i="init",h="bubbleTargets",c="_bubbleTargets",j=b.BaseCore,f=b.AttributeCore,a=b.Attribute;function d(){j.apply(this,arguments);}d._ATTR_CFG=a._ATTR_CFG.concat("cloneDefaultValue");d._ATTR_CFG_HASH=b.Array.hash(d._ATTR_CFG);d._NON_ATTRS_CFG=j._NON_ATTRS_CFG.concat(["on","after","bubbleTargets"]);d.NAME="base";d.ATTRS=f.prototype._protectAttrs(j.ATTRS);d.prototype={_initBase:function(k){this._eventPrefix=this.constructor.EVENT_PREFIX||this.constructor.NAME;b.BaseCore.prototype._initBase.call(this,k);},_initAttribute:function(k){a.call(this);this._yuievt.config.prefix=this._eventPrefix;},_attrCfgHash:function(){return d._ATTR_CFG_HASH;},init:function(k){this.publish(i,{queuable:false,fireOnce:true,defaultTargetOnly:true,defaultFn:this._defInitFn});this._preInitEventCfg(k);this.fire(i,{cfg:k});return this;},_preInitEventCfg:function(m){if(m){if(m.on){this.on(m.on);}if(m.after){this.after(m.after);}}var n,k,p,o=(m&&h in m);if(o||c in this){p=o?(m&&m.bubbleTargets):this._bubbleTargets;if(g.isArray(p)){for(n=0,k=p.length;n<k;n++){this.addTarget(p[n]);}}else{if(p){this.addTarget(p);}}}},destroy:function(){this.publish(e,{queuable:false,fireOnce:true,defaultTargetOnly:true,defaultFn:this._defDestroyFn});this.fire(e);this.detachAll();return this;},_defInitFn:function(k){this._baseInit(k.cfg);},_defDestroyFn:function(k){this._baseDestroy(k.cfg);}};b.mix(d,a,false,null,1);b.mix(d,j,false,null,1);d.prototype.constructor=d;b.Base=d;},"3.6.0",{requires:["base-core","attribute-base"]});