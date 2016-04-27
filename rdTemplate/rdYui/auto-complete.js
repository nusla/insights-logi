YUI.add('rdAutoComplete', function (Y) {
    //"use strict";

    var Lang = Y.Lang,
        TRIGGER = 'rdAutoCompleteElement';

    if (LogiXML.Ajax.AjaxTarget) {
        LogiXML.Ajax.AjaxTarget().on('reinitialize', function () { Y.LogiXML.rdAutoComplete.createElements(true); });
    }

    Y.LogiXML.Node.destroyClassKeys.push(TRIGGER);

    Y.namespace('LogiXML').rdAutoComplete = Y.Base.create('rdAutoComplete', Y.Base, [], {
        _handlers: {},

        configNode: null,
        id: null,
		values: [],
		multiselect: "",
		delimiter: null,
		rdEventOnAutoComplete: "",
		
        initializer: function (config) {
            var self = this;
            this._parseHTMLConfig();
            this.configNode.setData(TRIGGER, this);

            var inputNode = this.configNode

            var parent = inputNode.get('parentNode');
            if (parent)
                parent.addClass('yui3-skin-sam');
				
			var EventOnAutoComplete = this.rdEventOnAutoComplete;
			
			this._handlers.AutCompletePlugin = this.configNode.plug(Y.Plugin.AutoComplete, {
				allowTrailingDelimiter: true,
				minQueryLength: 0,
				queryDelay: 0,
				// queryDelimiter: ',',
				queryDelimiter: this.delimiter,
				resultHighlighter: 'startsWith',
				source: this.values,
				
				//24592
				after : {
					select : function() {
						eval(EventOnAutoComplete);
					}
				},
				
				resultFilters: ['startsWith', function (query, results) {
					// var selected = this._inputNode.get('value').split(/\s*,\s*/);
					var selected = inputNode.get('value').split(/\s*,\s*/);
										
					selected = Y.Array.hash(selected);
					
					return Y.Array.filter(results, function (result) {
						return !selected.hasOwnProperty(result.text);
					  });
					}]									
			});

            //23862 23865
			if (inputNode.getDOMNode().value && inputNode.getDOMNode().value.length > 0 && this.delimiter != "") {
			    var inputVal = inputNode.getDOMNode().value;
			    var inputArray = inputVal.trim().split(this.delimiter);
			    for (var i = 0; i < inputArray.length; i++) {
			        inputArray[i] = inputArray[i].trim();
			    }
			    inputNode.getDOMNode().value = inputArray.join(this.delimiter + ' ');
			}

			if (inputNode.getDOMNode().value && inputNode.getDOMNode().value.length > 0 && inputNode.getDOMNode().value.trim().lastIndexOf(this.delimiter) != inputNode.getDOMNode().value.trim().length - 1)
			    inputNode.getDOMNode().value = inputNode.getDOMNode().value + this.delimiter;				
            
        },
				
        _parseHTMLConfig: function () {
            this.configNode = this.get('configNode');
            this.id = this.configNode.getAttribute('id');
            // this.values = this.configNode.getAttribute('data-values').split(',');
			this.values = this.configNode.getAttribute('data-values').split('||');
			this.multiselect = this.configNode.getAttribute('data-multiselect');
			if (this.multiselect == "True") {
					this.delimiter = this.configNode.getAttribute('data-delimiter');		
				} else {
					this.delimiter = "";
				}	
			this.rdEventOnAutoComplete = this.configNode.getAttribute('data-event');			
        },
        

        destructor: function () {
            var configNode = this.configNode;
            this._clearHandlers();
            configNode.setData(TRIGGER, null);
        },

        _clearHandlers: function () {
            var self = this;
            Y.each(this._handlers, function (item) {
                if (item) {
                    if (item.detach) {
                        item.detach();
                    }
                    if (item.destroy) {
                        item.destroy();
                    }
                    item = null;
                }
            });
        }


    }, {
        // Static Methods and properties
        NAME: 'rdAutoComplete',
        ATTRS: {
            configNode: {
                value: null,
                setter: Y.one
            }
        },

        createElements: function () {

            var element;

            Y.all('.' + TRIGGER).each(function (node) {
                element = node.getData(TRIGGER);
                if (!element) {
                    element = new Y.LogiXML.rdAutoComplete({
                        configNode: node
                    });
                }
            });
        }


    });

}, '1.0.0', { requires: ['base', 'node', 'event', 'node-custom-destroy', 'autocomplete', 'autocomplete-highlighters', 'autocomplete-filters'] });
