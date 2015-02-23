/*
YUI 3.6.0 (build 5521)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("uploader-queue",function(a){var g=a.Lang,k=a.bind,h=a.config.win,f,d,j,b,i,e;var c=function(l){this.queuedFiles=[];this.uploadRetries={};this.numberOfUploads=0;this.currentUploadedByteValues={};this.currentFiles={};this.totalBytesUploaded=0;this.totalBytes=0;c.superclass.constructor.apply(this,arguments);};a.extend(c,a.Base,{_currentState:c.STOPPED,initializer:function(l){},_uploadStartHandler:function(m){var l=m;l.file=m.target;l.originEvent=m;this.fire("uploadstart",l);},_uploadErrorHandler:function(n){var p=this.get("errorAction");var m=n;m.file=n.target;m.originEvent=n;this.numberOfUploads-=1;delete this.currentFiles[n.target.get("id")];this._detachFileEvents(n.target);n.target.cancelUpload();if(p===c.STOP){this.pauseUpload();}else{if(p===c.RESTART_ASAP){var o=n.target.get("id"),l=this.uploadRetries[o]||0;if(l<this.get("retryCount")){this.uploadRetries[o]=l+1;this.addToQueueTop(n.target);}this._startNextFile();}else{if(p===c.RESTART_AFTER){var o=n.target.get("id"),l=this.uploadRetries[o]||0;if(l<this.get("retryCount")){this.uploadRetries[o]=l+1;this.addToQueueBottom(n.target);}this._startNextFile();}}}this.fire("uploaderror",m);},_startNextFile:function(){if(this.queuedFiles.length>0){var m=this.queuedFiles.shift(),l=m.get("id"),n=this.get("perFileParameters"),o=n.hasOwnProperty(l)?n[l]:n;this.currentUploadedByteValues[l]=0;m.on("uploadstart",this._uploadStartHandler,this);m.on("uploadprogress",this._uploadProgressHandler,this);m.on("uploadcomplete",this._uploadCompleteHandler,this);m.on("uploaderror",this._uploadErrorHandler,this);m.on("uploadcancel",this._uploadCancelHandler,this);m.set("xhrHeaders",this.get("uploadHeaders"));m.set("xhrWithCredentials",this.get("withCredentials"));m.startUpload(this.get("uploadURL"),o,this.get("fileFieldName"));this._registerUpload(m);}},_registerUpload:function(l){this.numberOfUploads+=1;this.currentFiles[l.get("id")]=l;},_unregisterUpload:function(l){if(this.numberOfUploads>0){this.numberOfUploads-=1;}delete this.currentFiles[l.get("id")];delete this.uploadRetries[l.get("id")];this._detachFileEvents(l);},_detachFileEvents:function(l){l.detach("uploadstart",this._uploadStartHandler);l.detach("uploadprogress",this._uploadProgressHandler);l.detach("uploadcomplete",this._uploadCompleteHandler);l.detach("uploaderror",this._uploadErrorHandler);l.detach("uploadcancel",this._uploadCancelHandler);},_uploadCompleteHandler:function(o){this._unregisterUpload(o.target);this.totalBytesUploaded+=o.target.get("size");delete this.currentUploadedByteValues[o.target.get("id")];if(this.queuedFiles.length>0&&this._currentState===c.UPLOADING){this._startNextFile();}var n=o;n.file=o.target;n.originEvent=o;var m=this.totalBytesUploaded;a.each(this.currentUploadedByteValues,function(p){m+=p;});var l=Math.min(100,Math.round(10000*m/this.totalBytes)/100);this.fire("totaluploadprogress",{bytesLoaded:m,bytesTotal:this.totalBytes,percentLoaded:l});this.fire("uploadcomplete",n);if(this.queuedFiles.length===0&&this.numberOfUploads<=0){this.fire("alluploadscomplete");this._currentState=c.STOPPED;}},_uploadCancelHandler:function(m){var l=m;l.originEvent=m;l.file=m.target;this.fire("uploadcacel",l);},_uploadProgressHandler:function(o){this.currentUploadedByteValues[o.target.get("id")]=o.bytesLoaded;var n=o;n.originEvent=o;n.file=o.target;this.fire("uploadprogress",n);var m=this.totalBytesUploaded;a.each(this.currentUploadedByteValues,function(p){m+=p;});var l=Math.min(100,Math.round(10000*m/this.totalBytes)/100);this.fire("totaluploadprogress",{bytesLoaded:m,bytesTotal:this.totalBytes,percentLoaded:l});},startUpload:function(){this.queuedFiles=this.get("fileList").slice(0);this.numberOfUploads=0;this.currentUploadedByteValues={};this.currentFiles={};this.totalBytesUploaded=0;this._currentState=c.UPLOADING;while(this.numberOfUploads<this.get("simUploads")&&this.queuedFiles.length>0){this._startNextFile();}},pauseUpload:function(){this._currentState=c.STOPPED;},restartUpload:function(){this._currentState=c.UPLOADING;while(this.numberOfUploads<this.get("simUploads")){this._startNextFile();}},forceReupload:function(l){var m=l.get("id");if(this.currentFiles.hasOwnProperty(m)){l.cancelUpload();this._unregisterUpload(l);this.addToQueueTop(l);this._startNextFile();}},addToQueueTop:function(l){this.queuedFiles.unshift(l);},addToQueueBottom:function(l){this.queuedFiles.push(l);},cancelUpload:function(n){if(n){var p=n.get("id");if(this.currentFiles[p]){this.currentFiles[p].cancelUpload();this._unregisterUpload(this.currentFiles[p]);if(this._currentState===c.UPLOADING){this._startNextFile();}}else{for(var m=0,l=this.queuedFiles.length;m<l;m++){if(this.queuedFiles[m].get("id")===p){this.queuedFiles.splice(m,1);break;}}}}else{for(var o in this.currentFiles){this.currentFiles[o].cancelUpload();this._unregisterUpload(this.currentFiles[o]);}this.currentUploadedByteValues={};this.currentFiles={};this.totalBytesUploaded=0;this.fire("alluploadscancelled");this._currentState=c.STOPPED;}}},{CONTINUE:"continue",STOP:"stop",RESTART_ASAP:"restartasap",RESTART_AFTER:"restartafter",STOPPED:"stopped",UPLOADING:"uploading",NAME:"uploaderqueue",ATTRS:{simUploads:{value:2,validator:function(m,l){return(m>=1&&m<=5);}},errorAction:{value:"continue",validator:function(m,l){return(m===c.CONTINUE||m===c.STOP||m===c.RESTART_ASAP||m===c.RESTART_AFTER);}},bytesUploaded:{readOnly:true,value:0},bytesTotal:{readOnly:true,value:0},fileList:{value:[],lazyAdd:false,setter:function(m){var l=m;a.Array.each(l,function(n){this.totalBytes+=n.get("size");},this);return m;}},fileFieldName:{value:"Filedata"},uploadURL:{value:""},uploadHeaders:{value:{}},withCredentials:{value:true},perFileParameters:{value:{}},retryCount:{value:3}}});a.namespace("Uploader");a.Uploader.Queue=c;},"3.6.0",{requires:["base"]});