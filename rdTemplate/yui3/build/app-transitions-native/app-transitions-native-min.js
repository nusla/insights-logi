/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("app-transitions-native",function(c){var a=c.App.Transitions;function b(){}b.prototype={initializer:function(){this._transitioning=false;this._viewTransitionQueue=[];c.Do.before(this._queueActiveView,this,"_uiSetActiveView");},_dequeueActiveView:function(){var d=this._viewTransitionQueue,f=d.shift(),e;if(f){if(d.length){e=c.merge(f[2],{transition:false});f.splice(2,1,e);}this._uiTransitionActiveView.apply(this,f);}},_getFx:function(h,d,g){var e=a.FX,f=this.get("transitions");if(g===false||!f){return null;}if(g){return e[g];}if(this._isChildView(h,d)){return e[f.toChild];}if(this._isParentView(h,d)){return e[f.toParent];}return e[f.navigate];},_queueActiveView:function(){var d=c.Array(arguments,0,true);this._viewTransitionQueue.push(d);if(!this._transitioning){this._dequeueActiveView();}return new c.Do.Prevent();},_uiTransitionActiveView:function(i,l,p){p||(p={});var n=p.callback,d,m,e,j,o,h,g,k;if(i===l){n&&n.call(this,i);this._transitioning=false;return this._dequeueActiveView();}h=this._getFx(i,l,p.transition);e=this._isChildView(i,l);j=!e&&this._isParentView(i,l);o=!!p.prepend||j;if(!h){this._attachView(i,o);this._detachView(l);n&&n.call(this,i);this._transitioning=false;return this._dequeueActiveView();}this._transitioning=true;d=this.get("container");m=c.App.CLASS_NAMES.transitioning;d.addClass(m);this._attachView(i,o);function f(){this._detachView(l);d.removeClass(m);n&&n.call(this,i);this._transitioning=false;return this._dequeueActiveView();}k=new c.Parallel({context:this});g={crossView:!!l&&!!i,prepended:o};if(i&&h.viewIn){i.get("container").transition(h.viewIn,g,k.add());}if(l&&h.viewOut){l.get("container").transition(h.viewOut,g,k.add());}k.done(f);}};c.mix(c.Transition.fx,{"app:fadeIn":{opacity:1,duration:0.3,on:{start:function(f){var e={opacity:0},d=f.config;if(d.crossView&&!d.prepended){e.transform="translateX(-100%)";}this.setStyles(e);},end:function(){this.setStyle("transform","translateX(0)");}}},"app:fadeOut":{opacity:0,duration:0.3,on:{start:function(f){var e={opacity:1},d=f.config;if(d.crossView&&d.prepended){e.transform="translateX(-100%)";}this.setStyles(e);},end:function(){this.setStyle("transform","translateX(0)");}}},"app:slideLeft":{duration:0.3,transform:"translateX(-100%)",on:{start:function(){this.setStyles({opacity:1,transform:"translateX(0%)"});},end:function(){this.setStyle("transform","translateX(0)");}}},"app:slideRight":{duration:0.3,transform:"translateX(0)",on:{start:function(){this.setStyles({opacity:1,transform:"translateX(-100%)"});},end:function(){this.setStyle("transform","translateX(0)");}}}});c.App.TransitionsNative=b;c.Base.mix(c.App,[b]);},"3.6.0",{requires:["app-transitions","app-transitions-css","parallel","transition"]});