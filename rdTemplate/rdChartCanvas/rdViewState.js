"use strict";

Array.prototype.unique = function() {
    var sorted = this.sort();
    
    for (var i = 0, n = sorted.length; i < n; i++) {
        if (i < n && sorted[i] === sorted[i+1]) {
            sorted = sorted.splice(i, 1);
        }
    }
    return sorted;
};

Array.prototype.removeAt = function (index) {
    var arr = this;
    
    if (arr[index] != null)
        return arr.splice(index, 1);

    return this;
};

function getInputViewStateElement(chart, type) {
    if (!chart.viewstates) {
        chart.viewstates = [];
    }
    var state = chart.viewstates[type];
    if (!state || typeof (state) === 'string') {

        var hiddenFieldId = (chart.options.id || ('chart_' + chart.index)) + '_' + type;
        var element = Highcharts.createElement('input', { 'type': 'hidden', id: hiddenFieldId, name: hiddenFieldId }, null, chart.container);
        state = chart.viewstates[type] = element;
    }
    return state;
};

var setChartStateEventHandlers = function(chart) {
    setLegendStateEventHandlers(chart);
    var zoomNotAllowed = false;
    var selection;
    var series;
    for (var i = 0; i < chart.series.length; i++) {
        series = chart.series[i].userOptions;
        if (series.selection) {
            selection = series.selection;
            if (selection.selectionType.indexOf('Area')>-1) {
                zoomNotAllowed = true;
                break;
            }
        }
    }
    if (!zoomNotAllowed) {
        setZoomStateEventHandlers(chart);
    }
};

var restoreChartState = function (chart) {
    if (!chart.viewstates) {
        return;
    }
    if (typeof(chart.viewstates)==='string') {
        chart.viewstates = JSON.parse(chart.viewstates);
    }
    restoreZoomState(chart);
    restoreLegendState(chart);
    restoreOptions3DState(chart);
};

var setLegendStateEventHandlers = function (chart) {
    var persistViewState = function(value, type) {
        var input = getInputViewStateElement(chart, type);
        input.value = value;
    };
    
    if (!chart.legend.allItems)
        return;
    
    for (var i = 0; i < chart.legend.allItems.length; i++) {
        var currentItem = chart.legend.allItems[i];
        currentItem.legendItem.element.serie = chart.series[currentItem.index];
        currentItem.legendItem.element.item = currentItem; 
        currentItem.legendItem.on('click', function (event) {
            var serie = this.serie || this.item;
            var item = this.item;
            serie.isLegendInvisible = !(serie.isLegendInvisible);
            var currentChart = this.item && this.item.series ? this.item.series.chart : this.serie.chart;

            var data = currentChart.legend.getAllItems();

            data = data.filter(function(s) { return s && s.isLegendInvisible === true; });

            var ids = [];
            for (var dataIndex = 0; data && dataIndex < data.length; dataIndex++) {
                var currentDataItem = data[dataIndex];
                if (currentDataItem && currentDataItem.series) {
                    var serieIndex = currentDataItem.series.index;
                    if (!ids[serieIndex])
                        ids[serieIndex] = [];
                    ids[serieIndex].push(currentDataItem.series.data.indexOf(currentDataItem));
                } else {
                    ids[currentDataItem.index] = true;
                }
            }
            
            persistViewState(JSON.stringify(ids), 'legend');
            mergeHandlers(chart);
        });
    }
};
var setZoomStateEventHandlers = function (chart) {
    if (!chart.userOptions.chart.zoomType) {
        return;
    }
    if (!chart.events) {
        chart.events = {};
    }
    var minmax = function (axis) {
        return {
            min: axis.min,
            max: axis.max
        };
    };

    chart.HCEvents.selection = [
        function(event) {
            var xRet, yRet;
            if (event.xAxis) {
                xRet = event.xAxis.map(minmax);
            }
            if (event.yAxis) {
                yRet = event.yAxis.map(minmax);
            }
            getInputViewStateElement(chart, 'zoom').value = (xRet || yRet) ? JSON.stringify({ xZoom: xRet, yZoom: yRet, zType: chart.userOptions.chart.zoomType }) : "";
            
            mergeHandlers(chart);
        }
    ];
};

var saveOptions3DState = function(chart, options3D) {
    getInputViewStateElement(chart, 'options3D').value = JSON.stringify(options3D);
    mergeHandlers(chart);
};

var mergeHandlers = function(chart) {
    var elem = getInputViewStateElement(chart, 'viewstates');
    var val = {};
    var addStateProperty = function(type, val) {
        if (getInputViewStateElement(chart, type).value) {
            val[type] = getInputViewStateElement(chart, type).value;
        }
    };
    addStateProperty('zoom', val);
    addStateProperty('legend', val);
    addStateProperty('options3D', val);
    elem.value = JSON.stringify(val);
};

var restoreZoomState = function (chart) {
    if (!chart.viewstates.zoom) {
        return;
    }
    if (typeof (chart.viewstates.zoom) === 'string') {
        var val = chart.viewstates.zoom;
        getInputViewStateElement(chart, 'zoom').value = val;
    }
    if (chart.viewstates.zoom.value==='') {
        return;
    }
    var state = JSON.parse(chart.viewstates.zoom.value);
    var event = {};
    event.xAxis = [];
    event.yAxis = [];
    if (state.zType.indexOf('x') > -1) {
        for (var i = 0; i < state.xZoom.length; i++) {
            chart.xAxis[i].min = state.xZoom[i].min;
            chart.xAxis[i].max = state.xZoom[i].max;
            chart.xAxis[i].isDirty = true;
            chart.xAxis[i].axis = chart.xAxis[i];
            event.xAxis.push(chart.xAxis[i]);
        }
    }
    if (state.zType.indexOf('y')>-1) {
        for (var i = 0; i < state.yZoom.length; i++) {
            chart.yAxis[i].min = state.yZoom[i].min;
            chart.yAxis[i].max = state.yZoom[i].max;
            chart.yAxis[i].isDirty = true;
            chart.yAxis[i].axis = chart.yAxis[i];
            event.yAxis.push(chart.yAxis[i]);
        }
    }
    chart.zoom(event);
};

var restoreLegendState = function(chart) {
    if (!chart.viewstates)
        return;
    var state = chart.viewstates.legend;
    getInputViewStateElement(chart, 'legend').value = state;
    if (!state || !chart.legend.allItems) {
        return;
    }

    if (typeof(state) !== "string") {
        return;
    }
    var stJson = JSON.parse(state);

    for (var i = 0; i < stJson.length; i++) {
        var currentItem = stJson[i];
        if (currentItem === null || currentItem === undefined)
            continue;
        if (currentItem === true) {
            chart.series[i].setVisible(false);
        }
        if (Array.isArray(currentItem)) {
            for (var j = 0; j < currentItem.length; j++) {
                var pieIndex = currentItem[j];
                if (pieIndex === null || pieIndex === undefined)
                    continue;

                chart.series[i].data[pieIndex].setVisible(false);
            }
        }
    }
};


var restoreOptions3DState = function (chart) {
    if (!chart.viewstates.options3D) {
        return;
    }
    if (typeof (chart.viewstates.options3D) === 'string') {
        var val = chart.viewstates.options3D;
        getInputViewStateElement(chart, 'options3D').value = val;
    }
    if (chart.viewstates.options3D.value === '') {
        return;
    }
    var state = JSON.parse(chart.viewstates.options3D.value);
    chart.options3d = state;
    chart.options.chart.options3d = state;
    chart.redraw(false);
}