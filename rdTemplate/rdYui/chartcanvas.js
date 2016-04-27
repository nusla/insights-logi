YUI.add('chartCanvas', function (Y) {
    //"use strict";
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }

    var Lang = Y.Lang,
        TRIGGER = 'rdChartCanvas';

    if (LogiXML.Ajax.AjaxTarget) {
        LogiXML.Ajax.AjaxTarget().on('reinitialize', function () { Y.LogiXML.ChartCanvas.createElements(true); });
    }

    Y.LogiXML.Node.destroyClassKeys.push(TRIGGER);

    Y.namespace('LogiXML').ChartCanvas = Y.Base.create('ChartCanvas', Y.Base, [], {
        _handlers: {},

        configNode: null,
        id: null,
        chart: null,
        reportName: null,
        renderMode: null,
        jsonUrl: null,
        chartPointer: null,
        refreshAfterResize: false,
        debugUrl: null,
        isUnderSE: null,
        inputElement: null,
        changeFlagElement: null,
        mask: null,
        restoreSelectionForSeriesIndex: null,
        maxVisiblePoints: null,
        refreshTimers: [], 

        initializer: function(config) {
            this._parseHTMLConfig();
            this.configNode.setData(TRIGGER, this);

            var chartOptions = this.extractOptionsFromHtmlNode(this.configNode);

            this._handlers.chartError = Highcharts.addEvent(this.configNode.getDOMNode(), 'error', Y.LogiXML.ChartCanvas.handleError);
            this._handlers.setSize = this.configNode.on('setSize', this.resized, this);
            this.initChart(chartOptions);
        },

        extractOptionsFromHtmlNode: function (chartNode) {
            var options = chartNode.getAttribute('data-options'),
                chartOptions = this.parseJson(options);
            return chartOptions;
        },

        rdUpdateChartData: function (requestParams) {
            var requestUrl = 'rdAjaxCommand=RefreshElement&rdRefreshElementID=' + this.id + '&rdReport=' + this.reportName + '&rdRequestForwarding=Form';
            requestUrl += "&rdChartRefreshType=UpdateData";
            requestUrl = this.attachRequestParams(requestUrl, requestParams);
            rdAjaxRequest(requestUrl);
        },

        rdAppendChartData: function (requestParams, maxVisiblePoints) {
            this.maxVisiblePoints = maxVisiblePoints;
            var requestUrl = 'rdAjaxCommand=RefreshElement&rdRefreshElementID=' + this.id + '&rdReport=' + this.reportName + '&rdRequestForwarding=Form';
            requestUrl += "&rdChartRefreshType=AppendData";
            requestUrl = this.attachRequestParams(requestUrl, requestParams);
            rdAjaxRequest(requestUrl);
        },

        attachRequestParams: function (url, requestParams) {
            if (requestParams) {
                for (var key in requestParams) {
                    url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(requestParams[key]);
                }
            }
            return url;
        },

        setChartDataFromRefreshElement: function (chartNode) {
            var chartOptions = this.extractOptionsFromHtmlNode(chartNode),
               refreshType = chartNode.getAttribute('data-refresh-type');
            if (!refreshType || refreshType == '') {
                refreshType = "UpdateData";
            }
            this.rdSetChartData(chartOptions, refreshType);
        },

        rdSetChartData: function (chartOptions, updateType, maxVisiblePoints) {
            this.preProcessChartOptions(chartOptions);
            if (!updateType || updateType == '') {
                updateType = "UpdateData";
            }
            if (!maxVisiblePoints && this.maxVisiblePoints) {
                maxVisiblePoints = this.maxVisiblePoints;
            }
            switch (updateType) {
                case "UpdateData":
                    {
                        var i = 0, length = chartOptions.series.length,
                            j = 0, jLength = this.chart.series.length,
                            seriesId;
                        for (; i < length; i++) {
                            seriesId = chartOptions.series[i].id;
                            for (j = 0; j < jLength; j++) {
                                if (this.chart.series[j].options.id == seriesId) {
                                    if (chartOptions.series[i].data && chartOptions.series[i].data.length) {
                                        this.chart.series[j].setData(chartOptions.series[i].data);
                                    }
                                }
                            }
                        }
                        
                    }
                    break;
                case "AppendData":
                    {
                        var i = 0, length = chartOptions.series.length,
                            j = 0, jLength = this.chart.series.length,
                            seriesId;
                        for (; i < length; i++) {
                            seriesId = chartOptions.series[i].id;
                            for (j = 0; j < jLength; j++) {
                                if (this.chart.series[j].options.id == seriesId) {
                                    var timespan = chartOptions.series[i].visibleTimespan,
                                        shiftCount = 0;
                                    if (timespan) {
                                        var timeArr = timespan.split(':'),
                                            dateIndent = timeArr[0] * 3600000 + timeArr[1] * 60000 + timeArr[2] * 1000, //in milliseconds
                                            maxDate = LogiXML.getTimestampWithoutClientOffset(new Date()),
                                            minDate = new Date(maxDate - dateIndent);
                                        for (var k = this.chart.series[j].data.length; k >= 0; k--) {
                                            if (this.chart.series[j].data[k] && new Date(this.chart.series[j].data[k].x) < minDate) {
                                                shiftCount++;
                                            }
                                        }
                                        if (chartOptions.series[i].data) {
                                            for (var index = 0; index < chartOptions.series[i].data.length; index++) {
                                                var dataPoint = chartOptions.series[i].data[index];
                                                if (shiftCount > 0) {
                                                    this.chart.series[j].addPoint(dataPoint, false, true);
                                                    shiftCount--;
                                                } else {
                                                    this.chart.series[j].addPoint(dataPoint, false, false);
                                                }
                                            }
                                        }
                                        this.setRefreshTimerPreviousValue();
                                        this.chart.xAxis[0].setExtremes(minDate, maxDate);
                                    } else {

                                        if (maxVisiblePoints && maxVisiblePoints > 0) {
                                            var pointsLength = this.chart.series[j].data.length,
                                                pointsToDeleteCnt = pointsLength - maxVisiblePoints;
                                            if (pointsToDeleteCnt > 0) {
                                                for (var k = 0; k < pointsToDeleteCnt; k++) {
                                                    shiftCount++;
                                                }
                                            }
                                        }

                                        if (chartOptions.series[i].data) {
                                            for (var index = 0; index < chartOptions.series[i].data.length; index++) {
                                                var dataPoint = chartOptions.series[i].data[index];
                                                if (shiftCount > 0) {
                                                    this.chart.series[j].addPoint(dataPoint, false, true);
                                                    shiftCount--;
                                                } else {
                                                    this.chart.series[j].addPoint(dataPoint, false, false);
                                                }
                                            }
                                        }
                                    }
                                    this.chart.redraw();
                                }
                            }
                        }
                    }
                    break;
                default:
                    throw ('Refresh type is undefined');
            }
            this.postProcessChartOptions(chartOptions);
        },

        setRefreshTimerInitialDateRange: function (chartOptions) {
            if (!chartOptions.series || chartOptions.series.length == 0) {
                return;
            }
            var i = 0, length = chartOptions.series.length,
                xAxis, ret = false, isAppend = false;
            for (; i < length; i++) {
                isAppend = false;
                var serie = chartOptions.series[i];
                if (serie.visibleTimespan) {
                    isAppend = true;
                    var timeSpan = serie.visibleTimespan,
                        timeArr = timeSpan.split(':'),
                        dateIndent = timeArr[0] * 3600000 + timeArr[1] * 60000 + timeArr[2] * 1000, //in milliseconds
                        maxDate = LogiXML.getTimestampWithoutClientOffset(new Date()),
                        minDate = new Date(maxDate - dateIndent),
                        axisId = LogiXML.getGuid();
                    if (!chartOptions.xAxis) {
                        chartOptions.xAxis = [];
                    }
                    if (chartOptions.xAxis.length == 0) {
                        chartOptions.xAxis.push({ id: axisId, labels: {}, title: { text: null }, type: 'datetime' });
                        serie.xAxis = axisId;
                    } 
                    chartOptions.xAxis[0].min = minDate.getTime();
                    chartOptions.xAxis[0].max = new Date(maxDate).getTime();
                    ret = true;
                }

                if (serie.refreshInterval) {
                    var prms = "rdAjaxCommand=RefreshElement&rdRefreshElementID=" + this.id +
                                    "&rdRefreshSeriesTimerEvent=True"+
                                    "&rdChartRefreshType=" + (isAppend? "AppendData" : "UpdateData") +
                                    "&rdChartCanvasId=" + this.id +
                                    "&rdChartCanvasSeriesId=" + serie.id +
                                    "&rdReport=" + this.reportName;
                    this.refreshTimers.push(this.createRefreshInterval(prms, serie.refreshInterval));
                }
            }
            return ret;
        },

        createRefreshInterval: function (prms, timeout) {
            return setInterval(function () { rdAjaxRequestWithFormVars(prms); }, timeout);
        },

        setRefreshTimerPreviousValue: function () {
            if (!this.chart || !this.chart.series || !this.chart.series.length > 0) {
                return;
            }
            var i = 0, length = this.chart.series.length,
                serie, maxDataValue;
            for (; i < length; i++) {
                var serie = this.chart.series[i];
                if (serie.userOptions && serie.userOptions.visibleTimespan) {
                    maxDataValue = null;
                    if (serie.xData && serie.xData.length > 0) {
                        maxDataValue = serie.xData[serie.xData.length - 1];
                    }
                    if (maxDataValue) {
                        var inputIdForLastValue = serie.userOptions.inputIdForLastValue;
                        if (inputIdForLastValue) {
                            this.getOrCreateInputElement(inputIdForLastValue).setAttribute('value', new Date(maxDataValue).toISOString());
                        }
                    }
                }
            }
        },

        destructor: function () {
            var configNode = this.configNode;
            this._clearHandlers();
            this.chart.destroy();
            configNode.setData(TRIGGER, null);
        },

        _clearHandlers: function() {
            var self = this;
            Y.each(this._handlers, function(item) {
                if (item) {
                    item.detach();
                    item = null;
                }
            });

            Y.each(this.refreshTimers, function (item) {
                if (item) {
                    clearTimeout(item);
                }
            });
        },

        _parseHTMLConfig: function() {

            this.configNode = this.get('configNode');
            this.id = this.configNode.getAttribute('id');
            this.reportName = this.configNode.getAttribute('data-report-name');
            this.renderMode = this.configNode.getAttribute('data-render-mode');
            this.jsonUrl = this.configNode.getAttribute('data-json-url');
            this.chartPointer = this.configNode.getAttribute('data-chart-pointer');
            this.refreshAfterResize = this.configNode.getAttribute('data-refresh-after-resize') == "True";
            this.debugUrl = this.configNode.getAttribute('data-debug-url');
            this.isUnderSE = this.configNode.getAttribute('data-under-se');
        },

        initChart: function(chartOptions) {
            //what about resizer?
            if (this.id) {
                var idForResizer = this.id.replace(/_Row[0-9]+$/g, "");
                if (Y.one('#rdResizerAttrs_' + idForResizer) && rdInitHighChartsResizer) {
                    rdInitHighChartsResizer(this.configNode.getDOMNode());
                }
            }
            //post processing
            if (this.renderMode != "Skeleton") {
                this.createChart(chartOptions);
            } else {
                this.createChart(chartOptions);
                this.chart.showLoading('<img src="rdTemplate/rdWait.gif" alt="loading..."></img>');
                this.requestChartData(null, "createChart", true);
            }
        },

        preProcessChartOptions: function (chartOptions) {
            if (chartOptions.series) {
                this.setActions(chartOptions.series);
            }

            if (chartOptions.tooltip) {
                chartOptions.tooltip.formatter = LogiXML.HighchartsFormatters.tooltipFormatter;
            }

            if (!chartOptions.chart.events) {
                chartOptions.chart.events = {};
            }

            if (chartOptions.title && chartOptions.title.text) {
                chartOptions.title.text = LogiXML.decodeHtml(chartOptions.title.text);
            }

            if (chartOptions.legend && chartOptions.legend.title && chartOptions.legend.title.text) {
                chartOptions.legend.title.text = LogiXML.decodeHtml(chartOptions.legend.title.text, chartOptions.legend.labelFormat == 'HTML');
            }

            if (chartOptions.subtitle && chartOptions.subtitle.text) {
                chartOptions.subtitle.text = LogiXML.decodeHtml(chartOptions.subtitle.text);
            }

            if (chartOptions.series && chartOptions.series.length > 0) {
                for (i = 0; i < chartOptions.series.length; i++) {
                    var series = chartOptions.series[i];
                    if (series.name) {
                        series.name = LogiXML.decodeHtml(series.name);
                    }
                    var data = series.data;
                    for (var j = 0; data && j < data.length; j++) {
                        if (data[j].name) {
                            data[j].name = LogiXML.decodeHtml(data[j].name/*, series.dataLabels && series.dataLabels.format === 'HTML'*/);
                        }
                    }
                }
            }

            if (chartOptions.xAxis && chartOptions.xAxis.length > 0) {
                for (var i = 0; i < chartOptions.xAxis.length; i++) {
                    var axis = chartOptions.xAxis[i];
                    if (axis.title && axis.title.text) {
                        axis.title.text = LogiXML.decodeHtml(axis.title.text);
                    }

                    var plotBands = axis.plotBands;
                    if (plotBands){
                        for (var k = 0; k < plotBands.length; k++) {
                            var plotBand = plotBands[k];
                            if (plotBand && plotBand.label && plotBand.label.text) {
                                plotBand.label.text = LogiXML.decodeHtml(plotBand.label.text, plotBand.label.format == 'HTML');
                            }
                        }
                    }

                    var plotLines = axis.plotLines;
                    if (plotLines) {
                        for (k = 0; k < plotLines.length; k++) {
                            var plotLine = plotLines[k];
                            if (plotLine && plotLine.label && plotLine.label.text) {
                                plotLine.label.text = LogiXML.decodeHtml(plotLine.label.text, plotLine.label.format == 'HTML');
                            }
                        }
                    }
                }
            }

            if (chartOptions.yAxis && chartOptions.yAxis.length > 0) {
                for (i = 0; i < chartOptions.yAxis.length; i++) {
                    var axis = chartOptions.yAxis[i];
                    if (axis.title && axis.title.text) {
                        axis.title.text = LogiXML.decodeHtml(axis.title.text);
                    }

                    var plotBands = axis.plotBands;
                    if (plotBands) {
                        for (var k = 0; k < plotBands.length; k++) {
                            var plotBand = plotBands[k];
                            if (plotBand && plotBand.label && plotBand.label.text) {
                                plotBand.label.text = LogiXML.decodeHtml(plotBand.label.text, plotBand.label.format == 'HTML');
                            }
                        }
                    }

                    var plotLines = axis.plotLines;
                    if (plotLines) {
                        for (k = 0; k < plotLines.length; k++) {
                            var plotLine = plotLines[k];
                            if (plotLine && plotLine.label && plotLine.label.text) {
                                plotLine.label.text = LogiXML.decodeHtml(plotLine.label.text, plotLine.label.format == 'HTML');
                            }
                        }
                    }
                }
            }

            if (chartOptions.quicktips && chartOptions.quicktips.length > 0) {
                for (i = 0; i < chartOptions.quicktips.length; i++) {
                    if (chartOptions.quicktips[i].rows && chartOptions.quicktips[i].rows.length > 0) {
                        for (var j = 0; j < chartOptions.quicktips[i].rows.length; j++) {
                            var row = chartOptions.quicktips[i].rows[j];
                            if (row && row.caption) {
                                row.caption = LogiXML.decodeHtml(row.caption, row.format == 'HTML');
                            }
                        }
                    }
                }
            }

            LogiXML.HighchartsFormatters.setFormatters(chartOptions);
        },

        postProcessChartOptions: function (chartOptions) {
            if (chartOptions.quicktips) {
                this.setQuicktipsData(chartOptions.quicktips);
            }
        },

        createChart: function (chartOptions, fromPostProcessing) {
            this.configNode.fire('beforeCreateChart', { id: this.id, options: chartOptions, chartCanvas: this, chart: this.chart });
            var viewstates;

            if (this.chart) {
                viewstates = this.chart.viewstates;
                this.chart.destroy();
            }

            //width and height by parent?
            var dataWidth = this.configNode.getAttribute('data-width'),
                dataHeight = this.configNode.getAttribute('data-height');
            if (dataWidth > 0 && dataHeight > 0) {
                chartOptions.chart.width = dataWidth;
                chartOptions.chart.height = dataHeight;
                //cleanup old size
                if (fromPostProcessing) {
                    this.configNode.removeAttribute('data-width');
                    this.configNode.removeAttribute('data-height');
                }
            }

            chartOptions.chart.renderTo = this.configNode.getDOMNode();

            this.preProcessChartOptions(chartOptions);

            this.setSelection(chartOptions);
            var shouldSetPrevValue = this.setRefreshTimerInitialDateRange(chartOptions);

            if (chartOptions.chart.options3d) {
                //Fix for Pie chart depth
                if (chartOptions.series) {
                    var containsPie = false;
                    for (var i = 0; i < chartOptions.series.length; i++) {
                        if (chartOptions.series[i].type=='pie') {
                            containsPie = true;
                            break;
                        }
                    }
                    if (containsPie) {
                        if (!chartOptions.plotOptions) {
                            chartOptions.plotOptions = {};
                        }
                        if (!chartOptions.plotOptions.pie) {
                            chartOptions.plotOptions.pie = {};
                        }
                        chartOptions.plotOptions.pie.depth = chartOptions.chart.options3d.depth;
                    }
                }
            }

            this.chart = new Highcharts.Chart(chartOptions);

            if (shouldSetPrevValue) {
                this.setRefreshTimerPreviousValue();
            }

            this.chart.options3d = chartOptions.chart.options3d;

            if (this.chart.options3d) {
                //mouse dragging rotation
                if (!this.chart.options3d.disableDragging) {
                    addRotationMouseEvents(this.chart);
                    if (saveOptions3DState) {
                        saveRotationStateFunc = saveOptions3DState;
                    }
                }
            }

            if (viewstates) {
                this.chart.viewstates = viewstates;
            }

            this.postProcessChartOptions(chartOptions);

            if (chartOptions.autoQuicktip === false) {
                this.chart.autoQuicktip = false;
            }

            if (this.restoreSelectionForSeriesIndex !== null) {
                this.syncSelectedValues(this.chart.series[this.restoreSelectionForSeriesIndex]);
                this.restoreSelectionForSeriesIndex = null;
            }
            if (typeof setChartStateEventHandlers != 'undefined') {
                setChartStateEventHandlers(this.chart);
            }
            if (fromPostProcessing) {
                
                //23988 restore chart viewstates from bookmark
                if (!this.chart.viewstates) {
                    var viewstateElem = document.getElementById('rdBookmarkReqId_' + this.chart.userOptions.id + '_viewstates');
                    if (viewstateElem) {
                        this.chart.viewstates = viewstateElem.innerHTML;
                    }
                }
            }
            if (typeof restoreChartState != 'undefined') {
                restoreChartState(this.chart);
            }

            //export 
            var wrapperNode = this.configNode.ancestor('.rdBrowserBorn');
            if (wrapperNode) {
                wrapperNode.setAttribute("data-rdBrowserBornReady", "true");
            }
            this.configNode.fire('afterCreateChart', { id: this.id, options: chartOptions, chartCanvas: this, chart: this.chart});
        },

        requestChartData: function (url, callbackFunctionName, prm1, prm2, prm3) {
            var chartUrl = url ? url : this.jsonUrl;
            if (this.chart) {
                chartUrl += "&rdDynamicChartWidth=" + this.chart.chartWidth;
                chartUrl += "&rdDynamicChartHeight=" + this.chart.chartHeight;
            }
            chartUrl += "&guid=" + LogiXML.getGuid();
            if (!callbackFunctionName) {
                callbackFunctionName = "createChart";
            }

            this.configNode.fire('beforeRequestData', { id: this.id, chartCanvas: this, chart: this.chart, dataUrl: chartUrl });
            Y.io(chartUrl, {
                on: {
                    success: function(tx, r) {
                        var parsedResponse = this.parseJson(r.responseText);
                        this.configNode.fire('afterRequestData', { id: this.id, chartCanvas: this, chart: this.chart, options: parsedResponse });
                        if (parsedResponse) {
                            this[callbackFunctionName](parsedResponse, prm1, prm2, prm3);
                        }
                    },
                    failure: function(id, o, a) {
                        this.showError("ERROR " + id + " " + a);
                    }
                },
                context: this
            });
        },

        parseJson: function(jsonString) {
            var obj;
            try {
                var reportDevPrefix = "rdChart error;";
                var redirectPrefix = "redirect:";
                
                if (jsonString.startsWith(reportDevPrefix)) {
                    this.debugUrl = jsonString.substring(reportDevPrefix.length);
                    if (this.debugUrl && this.debugUrl.startsWith(redirectPrefix)) {
                        this.debugUrl = this.debugUrl.substring(redirectPrefix.length);
                    }
                    this.showError();
                    return;
                }
                if (document.URL && document.URL.indexOf('file:') != -1) {
                    eval("window.tmp=" + jsonString + ";");
                    obj = window.tmp;
                } else {
                    obj = Y.JSON.parse(jsonString);
                }
                if (LogiXML.EventBus && LogiXML.EventBus.ChartCanvasEvents) {
                    LogiXML.EventBus.ChartCanvasEvents().fire('load', { id: this.id, options: obj });
                }
            } catch (e) {
                this.showError("JSON parse failed: " + jsonString);
                return;
            }
            return obj;
        },

        setSelection: function(chartOptions) {
            if (!chartOptions.series || chartOptions.series.length == 0) {
                return;
            }
            var series,
                selection,
                i = 0,
                length = chartOptions.series.length,
                self = this;

            if (!chartOptions.chart.events) {
                chartOptions.chart.events = {};
            }
            for (; i < length; i++) {
                series = chartOptions.series[i];
                if (series.selection) {
                    selection = series.selection;

                    //turn on markers for point selection
                    if (selection.mode != "Range") {
                        series.marker.enabled = true;
                    }

                    if (!series.events) {
                        series.events = {};
                    }

                    switch (selection.selectionType) {
                    case "ClickSinglePoint":
                    case "ClickMultiplePoints":
                        series.allowPointSelect = true;
                        series.accumulate = selection.selectionType == "ClickMultiplePoints";
                        this.syncSelectedValues(series);
                        series.events.pointselection = function(e) {
                            self.pointsSelected(e.target, true);
                            return false
                        };
                        break;
                    case "Area":
                    case "AreaXAxis":
                    case "AreaYAxis":
                        switch (selection.selectionType) {
                        case "AreaXAxis":
                            chartOptions.chart.zoomType = "x";
                            break;
                        case "AreaYAxis":
                            chartOptions.chart.zoomType = "y";
                            break;
                        default:
                            chartOptions.chart.zoomType = "xy";
                            break;
                        }

                        series.accumulate = true;
                        chartOptions.chart.events.selection = function(e) {
                            self.selectionDrawn(e, true);
                            return false;
                        };
                        chartOptions.chart.events.redraw = function(e) { self.chartRedrawn(e); };
                        chartOptions.chart.events.selectionStarted = function(e) { self.destroySelection(); };

                        if (selection.mode == "Point") {
                            this.syncSelectedValues(series);
                        } else {
                            this.restoreSelectionForSeriesIndex = i;
                        }
                        chartOptions.chart.customSelection = true;

                        if (!selection.disableClearSelection) {
                            chartOptions.chart.events.click = function(e) { self.destroySelection(e, true); };
                        }

                        break;
                    }
                }
            }
        },

        pointsSelected: function (series, fireEvent) {
            var point, idx, value, values = [],
                i = 0, length = series.points.length,
                selection = series.options.selection,
                valueElement, changeFlagElement, oldValue, newValue;

            if (!selection) {
                return;
            }

            for (; i < length; i++) {
                point = series.points[i];
                if (point.selected) {
                    value = point.id || '';
                    idx = values.indexOf(value);
                    if (idx == -1) {
                        values.push(value);
                    }
                }
            }

            if (selection.valueElementId && selection.valueElementId.length > 0) {
                valueElement = this.getOrCreateInputElement(selection.valueElementId);
                oldValue = this.getInputElementValue(valueElement);
                //TODO do encoding for commas in values
                newValue = values.join(',');
                if (oldValue != newValue) {
                    this.setInputElementValue(valueElement, newValue);
                    if (selection.changeFlagElementId && selection.changeFlagElementId.length > 0) {
                        changeFlagElement = this.getOrCreateInputElement(selection.changeFlagElementId);
                        changeFlagElement.set('value', 'True');
                    }

                    if (fireEvent) {
                        HighchartsAdapter.fireEvent(series, 'selectionChange', null);

                        //if (selection.selectionType != "ClickSinglePoint" && selection.selectionType != "ClickMultiplePoints") {
                        if (newValue == '') {
                            HighchartsAdapter.fireEvent(series, 'selectionCleared', null);
                        } else {
                            HighchartsAdapter.fireEvent(series, 'selectionMade', null);
                        }
                        //}
                    }

                }
            }
        },

        rangeSelected: function (series, xMin, xMax, yMin, yMax, rect, fireEvent) {
            var point,
                i = 0, length = series.points.length,
                selection = series.options.selection,
                valueElement;

            if (!selection) {
                return;
            }

            if (selection.mode == 'Point') {

                for (; i < length; i++) {
                    point = series.points[i];
                    //TODO: check selection mode (if x only, y only, xy. Now is xy)
                    if (point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax) {
                        point.select(true, true);
                    } else {
                        point.select(false, true);
                    }
                }
                this.pointsSelected(series, fireEvent);
                return;
            }

            if (series.xAxis.isDatetimeAxis) {
                xMin = xMin == null ? '' : LogiXML.Formatter.formatDate(xMin, 'U');
                xMax = xMax == null ? '' : LogiXML.Formatter.formatDate(xMax, 'U');
            } else if (series.xAxis.categories && series.xAxis.names.length > 0) {
                if (xMin !== null) {
                    xMin = Math.max(0, Math.round(xMin));
                    if (series.xAxis.names.length > xMin) {
                        xMin = series.xAxis.names[xMin];
                    }
                }
                if (xMax !== null) {
                    xMax = Math.min(series.xAxis.names.length - 1, Math.round(xMax));
                    if (series.xAxis.names.length > xMax) {
                        xMax = series.xAxis.names[xMax];
                    }
                }
            }

            if (series.yAxis.isDatetimeAxis) {
                yMin = yMin == null ? '' : LogiXML.Formatter.formatDate(yMin, 'U');
                yMax = yMax == null ? '' : LogiXML.Formatter.formatDate(yMax, 'U');
            } else if (series.yAxis.categories && series.yAxis.names.length > 0) {
                if (yMin !== null) {
                    yMin = Math.max(0, Math.round(yMin));
                    if (series.yAxis.names.length > yMin) {
                        yMin = series.yAxis.names[yMin];
                    }
                }
                if (yMax !== null) {
                    yMax = Math.min(series.yAxis.names.length - 1, Math.round(yMax));
                    if (series.yAxis.names.length > yMax) {
                        yMax = series.yAxis.names[yMax];
                    }
                }
            }

            if (xMin === null) {
                xMin = '';
            }
            if (xMax === null) {
                xMax = '';
            }
            if (yMin === null) {
                yMin = '';
            }
            if (yMax === null) {
                yMax = '';
            }

            //range selection 
            if (selection.changeFlagElementId && selection.changeFlagElementId.length > 0) {
                valueElement = this.getOrCreateInputElement(selection.changeFlagElementId);
                valueElement.set('value', 'True');
            }

            if (fireEvent) {
                if (selection.minXElementId && selection.minXElementId.length > 0) {
                    valueElement = this.getOrCreateInputElement(selection.minXElementId);
                    valueElement.set('value', xMin);
                }
                if (selection.maxXElementId && selection.maxXElementId.length > 0) {
                    valueElement = this.getOrCreateInputElement(selection.maxXElementId);
                    valueElement.set('value', xMax);
                }

                if (selection.minYElementId && selection.minYElementId.length > 0) {
                    valueElement = this.getOrCreateInputElement(selection.minYElementId);
                    valueElement.set('value', yMin);
                }

                if (selection.maxYElementId && selection.maxYElementId.length > 0) {
                    valueElement = this.getOrCreateInputElement(selection.maxYElementId);
                    valueElement.set('value', yMax);
                }
                var eventArgs = {
                    rect: rect,
                    xMin: xMin,
                    xMax: xMax,
                    yMin: yMin,
                    yMax: yMax
                };
                HighchartsAdapter.fireEvent(series, 'selectionChange', eventArgs);
                HighchartsAdapter.fireEvent(series, 'selectionMade', eventArgs);
            }
        },

        getOrCreateInputElement: function (id) {
            var inputElement = Y.one("input[name='" + id + "'],select[name='" + id + "']");
            if (inputElement === null) {
                inputElement = Y.Node.create('<input type="hidden" name="' + id + '" id="' + id + '" />');
                this.configNode.ancestor().appendChild(inputElement);
            }
            return inputElement;
        },

        getInputElementValue: function (inputElement) {
            var inputElementType = inputElement.getAttribute('type'),
                selectedValues = [];
            switch (inputElementType) {
                case "checkbox":
                case "radio":
                    Y.all("input[name='" + inputElement.getAttribute('name') + "']").each(function (inputNode) {
                        if (inputNode.get('checked')) {
                            selectedValues.push(inputNode.get('value'));
                        }
                    });
                    return selectedValues.join(',');
                    break;
                default:
                    if (inputElement.get('nodeName').toLowerCase() == "select") {
                        inputElement.all('option').each(function (inputNode) {
                            if (inputNode.get('selected')) {
                                selectedValues.push(inputNode.get('value'));
                            }
                        });
                        return selectedValues.join(',');
                    } else {
                        return inputElement.get('value');
                    }
                    break;
            }
            return "";
        },

        setInputElementValue: function (inputElement, value) {
            var inputElementType = inputElement.getAttribute('type'),
                selectedValues = value.split(',');
            switch (inputElementType) {
                case "checkbox":
                case "radio":
                    Y.all("input[name='" + inputElement.getAttribute('name') + "']").each(function (inputNode) {
                        if (selectedValues.indexOf(inputNode.get('value')) != -1) {
                            inputNode.set('checked', true);
                        } else {
                            
                            inputNode.set('checked', false);
                        }
                        console.log(inputNode.get('value'));
                    });
                    break;
                default:
                    if (inputElement.get('nodeName').toLowerCase() == "select") {
                        inputElement.all('option').each(function (inputNode) {
                            if (selectedValues.indexOf(inputNode.get('value')) != -1) {
                                inputNode.set('selected', true);
                            } else {
                                inputNode.set('selected', false);
                            }
                            console.log(inputNode.get('value'));
                        });
                    } else {
                        return inputElement.set('value', value);
                    }
                    break;
            }
            return "";
        },

        destroySelection: function (e, fireEvent) {
            var i = 0, y = 0,
                length = this.chart.series.length, dataLength,
                point, series, selection, wasSelected = false, notClearSelection = false;

            if (this.rangeSelection) { 
                wasSelected = true;
            }
            //clear selected points
            for (; i < length; i++) {
                series = this.chart.series[i];
                selection = series.options.selection;

                if (!selection) {
                    continue;
                }
                switch (selection.mode) {
                    case 'Range':
                        if (!notClearSelection && series.options.selection.disableClearSelection === true) {
                            notClearSelection = true;
                        }
                        if (!notClearSelection) {
                            this.rangeSelected(series, null, null, null, null);
                            if (wasSelected && fireEvent) {
                                HighchartsAdapter.fireEvent(series, 'selectionChange', null);
                                HighchartsAdapter.fireEvent(series, 'selectionCleared', null);
                            }
                        }
                        break;

                    default:
                        if (wasSelected && fireEvent) {
                            y = 0; dataLength = series.points.length;
                            for (; y < dataLength; y++) {
                                point = series.points[y];
                                if (point.selected) {
                                    point.select(false, true);
                                }
                            }
                            this.pointsSelected(series, fireEvent);
                        }
                        break;
                }
            }

            if (wasSelected && !notClearSelection) {
                this.rangeSelection.destroy();
                this.rangeSelection = null;
            }
        },

        selectionDrawn: function (e, fireEvent) {
            var self = this,
                zoomType = this.chart.options.chart.zoomType;
            if (this.chart.inverted) {
                zoomType = zoomType == 'x' ? 'y' : zoomType == 'y' ? 'x' : zoomType;
            }
            this.rangeSelection = new Y.LogiXML.ChartCanvasRangeSelection(
            {
                callback: function (rect) { self.selectionChanged(rect, true) },
                configNode: this.configNode,
                maskRect: e.selectionBox,
                constrainRect: this.chart.plotBox,
                maskType: zoomType,
                fillColor: this.chart.options.chart.selectionMarkerFill || 'rgba(69,114,167,0.25)'
            });
            this.selectionChanged(e.selectionBox, fireEvent);
            return false;
        },

        chartRedrawn: function (e) {

            var chart = e.target,
                oldWidth = chart.oldChartWidth,
                oldHeight = chart.oldChartHeight,
                chartHeight = chart.chartHeight,
                chartWidth = chart.chartWidth,
                diffWidth, diffHeight;

            var zoomType = chart.options.chart.zoomType,
                i = 0, length = chart.series.length, series, selection;

            if (oldWidth && oldWidth != chartWidth) {
                diffWidth = chartWidth - oldWidth;
            }
            if (oldHeight && oldHeight != chartHeight) {
                diffHeight = chartHeight - oldHeight;
            }

            //reset selection
            if (zoomType && this.rangeSelection && (diffWidth || diffHeight)) {
                for (; i < length; i++) {
                    series = this.chart.series[i];
                    selection = series.options.selection;

                    if (!selection) {
                        continue;
                    }

                    if (selection.mode == 'Range') {
                        this.syncSelectedValues(series);
                    } else if (selection.mode == 'Point' &&
                        (selection.selectionType == "ClickSinglePoint" || selection.selectionType == "ClickMultiplePoints") && this.rangeSelection) {
                        this.destroySelection();
                    }
                }
            }
        },

        selectionChanged: function (rect, fireEvent) {
            var xMin, xMax, yMin, yMax,
                i = 0, y = 0,
                length = this.chart.series.length, dataLength,
                point, series, selection, valueElement;

            for (; i < length; i++) {
                series = this.chart.series[i];
                selection = series.options.selection;

                if (!selection || (selection.selectionType == "ClickSinglePoint" || selection.selectionType == "ClickMultiplePoints")) {
                    continue;
                }

                //turn off zoom if DisableClearSelection
                if (selection.disableClearSelection) {
                    this.chart.pointer.zoomX = false;
                    this.chart.pointer.zoomY = false;
                }

                //TODO: check if series has x/y axis
                if (this.chart.inverted) {
                    switch (selection.selectionType) {
                    case 'AreaXAxis':
                        xMin = series.xAxis.toValue(rect.x);
                        xMax = series.xAxis.toValue(rect.x + rect.width);
                        yMin = null;
                        yMax = null;
                        break;
                    case 'AreaYAxis':
                        xMin = null;
                        xMax = null;
                        yMin = series.yAxis.toValue(rect.y + rect.height);
                        yMax = series.yAxis.toValue(rect.y);
                        break;
                    default:
                        xMin = series.xAxis.toValue(rect.y + rect.height);
                        xMax = series.xAxis.toValue(rect.y);
                        yMin = series.yAxis.toValue(rect.x);
                        yMax = series.yAxis.toValue(rect.x + rect.width);
                    }
                } else {
                    switch (selection.selectionType) {
                    case 'AreaXAxis':
                        xMin = series.xAxis.toValue(rect.x);
                        xMax = series.xAxis.toValue(rect.x + rect.width);
                        yMin = null;
                        yMax = null;
                        break;
                    case 'AreaYAxis':
                        xMin = null;
                        xMax = null;
                        yMin = series.yAxis.toValue(rect.y + rect.height);
                        yMax = series.yAxis.toValue(rect.y);
                        break;
                    default:
                        xMin = series.xAxis.toValue(rect.x);
                        xMax = series.xAxis.toValue(rect.x + rect.width);
                        yMin = series.yAxis.toValue(rect.y + rect.height);
                        yMax = series.yAxis.toValue(rect.y);
                    }
                }
                this.rangeSelected(series, xMin, xMax, yMin, yMax, rect, fireEvent);
            }
        },

        syncSelectedValues: function (series) {
            var selection = series.options ? series.options.selection : series.selection,
                valueElement, value, values, id,
                i = 0, length, minX, maxX, minY, maxY, selectionBox;
            if (!selection) {
                return;
            }
            if (selection.mode == 'Point') {
                if (!selection.valueElementId || selection.valueElementId.length == 0) {
                    return;
                }

                valueElement = this.getOrCreateInputElement(selection.valueElementId);
                if (!valueElement) {
                    return;
                }
                value = this.getInputElementValue(valueElement);
                if (!value || value.length == 0) {
                    return;
                }
                values = value.split(',');
                length = series.data ? series.data.length : 0;
                for (; i < length; i++) {
                    id = series.data[i].id;
                    if (values.indexOf(id) != -1) {
                        series.data[i].selected = true;
                        if (series.type == "pie") {
                            series.data[i].sliced = true;
                        }
                    }
                }
            }

            if (selection.mode == 'Range') {
                if (selection.RestoreSelection) {
                    if (selection.SelectedValues[0]) {
                        minX = selection.SelectedValues[0];
                    }
                    if (selection.SelectedValues[1]) {
                        minY = selection.SelectedValues[1];
                    }
                    if (selection.SelectedValues[2]) {
                        maxX = selection.SelectedValues[2];
                    }
                    if (selection.SelectedValues[3]) {
                        maxY = selection.SelectedValues[3];
                    }
                    selectionBox = this.getSelectionBox(series, minX, maxX, minY, maxY);
                    series.chart.renderer.rect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height, 5).attr({ fill: this.chart.options.chart.selectionMarkerFill || 'rgba(69,114,167,0.25)' }).add();
                } else {
                    if (selection.minXElementId && selection.minXElementId.length > 0) {
                        valueElement = this.getOrCreateInputElement(selection.minXElementId);
                        minX = valueElement.get('value');
                    }
                    if (selection.maxXElementId && selection.maxXElementId.length > 0) {
                        valueElement = this.getOrCreateInputElement(selection.maxXElementId);
                        maxX = valueElement.get('value');
                    }
                    //}

                    //if (selection.maskType == 'y' || selection.maskType == 'xy') {
                    if (selection.minYElementId && selection.minYElementId.length > 0) {
                        valueElement = this.getOrCreateInputElement(selection.minYElementId);
                        minY = valueElement.get('value');
                    }

                    if (selection.maxYElementId && selection.maxYElementId.length > 0) {
                        valueElement = this.getOrCreateInputElement(selection.maxYElementId);
                        maxY = valueElement.get('value');
                    }
                    if ((minX && minX != "") || (minY && minY != "")) {
                        selectionBox = this.getSelectionBox(series, minX, maxX, minY, maxY);
                        if (this.rangeSelection) {
                            this.destroySelection();
                        }
                        this.selectionDrawn({ selectionBox: selectionBox }, false);
                    }
                }
            }
        },

        getSelectionBox: function(series, minX, maxX, minY, maxY) {
            var selectionBox = {},
                x1, x2, y1, y2, dt, tmp;
            if (series.xAxis.isDatetimeAxis) {
                minX = minX && minX != "" ? new Date(minX) : null;
                maxX = maxX && maxX != "" ? new Date(maxX) : null;
            } else if (series.xAxis.categories === true) {
                minX = series.xAxis.names.indexOf(minX);
                minX = minX == -1 ? null : minX;

                maxX = series.xAxis.names.indexOf(maxX);
                maxX = maxX == -1 ? null : maxX;
            }
            if (series.yAxis.isDatetimeAxis) {
                minY = minY && minY != "" ? new Date(minY) : null;
                maxY = maxY && maxY != "" ? new Date(maxY) : null;
            } else if (series.yAxis.categories === true) {
                minY = series.yAxis.names.indexOf(minY);
                minY = minY == -1 ? null : minY;

                maxY = series.yAxis.names.indexOf(maxY);
                maxY = maxY == -1 ? null : maxY;
            }

            x1 = series.xAxis.toPixels(minX != null && minX.toString() != "" ? minX : series.xAxis.getExtremes().min);
            x2 = series.xAxis.toPixels(maxX != null && maxX.toString() != "" ? maxX : series.xAxis.getExtremes().max);
            y1 = series.yAxis.toPixels(minY != null && minY.toString() != "" ? minY : series.yAxis.getExtremes().min);
            y2 = series.yAxis.toPixels(maxY != null && maxY.toString() != "" ? maxY : series.yAxis.getExtremes().max);

            if (isNaN(x1) || x1 < series.xAxis.toPixels(series.xAxis.getExtremes().min)) {
                x1 = series.xAxis.toPixels(series.xAxis.getExtremes().min);
            }
            if (isNaN(x2) || x2 > series.xAxis.toPixels(series.xAxis.getExtremes().max)) {
                x2 = series.xAxis.toPixels(series.xAxis.getExtremes().max);
            }
            if (isNaN(y1) || y1 > series.yAxis.toPixels(series.yAxis.getExtremes().min)) {
                y1 = series.yAxis.toPixels(series.yAxis.getExtremes().min);
            }
            if (isNaN(y2) || y2 < series.yAxis.toPixels(series.yAxis.getExtremes().max)) {
                y2 = series.yAxis.toPixels(series.yAxis.getExtremes().max);
            }

            if (y1 < y2 + 15) {
                y1 = y2 + 15;
            }

            if (x1 > x2 - 15) {
                x1 = x2 - 15;
            }

            if (this.chart.inverted) {
                selectionBox.x = y1;
                selectionBox.width = y2 - selectionBox.x;
                selectionBox.y = x2;
                selectionBox.height = x1 - selectionBox.y;
            } else {
                selectionBox.x = x1;
                selectionBox.width = x2 - selectionBox.x;
                selectionBox.y = y2;
                selectionBox.height = y1 - selectionBox.y;
            }

            return selectionBox;
        },

        setQuicktipsData: function (quicktips) {
            if (!quicktips && quicktips.length == 0) {
                return;
            }

            var i = 0, length = quicktips.length;
            for (var i = 0; i < length; i++) {
                this.chart.series[quicktips[i].index].quicktip = quicktips[i];
            }
        },

        setActions: function(series) {
            var i = 0,
                length = series.length,
                options;

            for (; i < length; i++) {
                options = series[i];
                if (options.events) {
                    for (var event in options.events) {
                        if (Lang.isString(options.events[event])) {
                            options.events[event] = new Function('e', options.events[event]);
                        }
                    }
                }
            }
        },

        resized: function (e) {
            if (this.chart && this.chart.options) {
                var width = e.width > 0 ? e.width : this.chart.chartWidth,
                    height = e.height > 0 ? e.height : this.chart.chartHeight;
                var isGauge = this.chart.userOptions.series[0].type.indexOf("gauge") > -1;
                if (this.chart.userOptions.series[0].type.indexOf("bulletgauge")> -1) {
                    this.chart.animation = !this.chart.animation;
                }
                this.chart.setSize(width, height);

                if (e.finished) {
                    if (isGauge) {
                        this.chart.animation = true;
                        var tempUserOptions = this.chart.userOptions;
                        tempUserOptions.chart.width = width;
                        tempUserOptions.chart.height = height;
                        //tempUserOptions.chart.animation = null;
                        this.createChart(tempUserOptions);
                        this.chart.setSize(width, height);
                    }
                    var requestUrl = null;
                    if (this.refreshAfterResize == true) {
                        this.requestChartData(this.jsonUrl + '&rdResizerNewWidth=' + width + '&rdResizerNewHeight=' + height + "&rdResizer=True","createChart");
                        //return;
                        requestUrl = 'rdAjaxCommand=rdAjaxNotify&rdNotifyCommand=SetElementSize&rdWidth=' + width + '&rdHeight=' + height + '&rdElementId=' + this.id + '&rdReport=' + this.reportName + '&rdRequestForwarding=Form';
                    } else if (this.refreshAfterResize) {
                        requestUrl = 'rdAjaxCommand=RefreshElement&rdRefreshElementID=' + this.id + '&rdWidth=' + width + '&rdHeight=' + height + '&rdReport=' + this.reportName + '&rdResizeRequest=True&rdRequestForwarding=Form';
                    } else if (e.notify === undefined || (e.notify == true)) {
                        requestUrl = 'rdAjaxCommand=rdAjaxNotify&rdNotifyCommand=SetElementSize&rdWidth=' + width + '&rdHeight=' + height + '&rdElementId=' + this.id + '&rdReport=' + this.reportName + '&rdRequestForwarding=Form';
                    }
                    if (requestUrl !== null) {
                        if (this.isUnderSE === "True") {
                            requestUrl += "&rdUnderSuperElement=True";
                        }
                        rdAjaxRequest(requestUrl);
                    }
                }
            }
        },

        showError: function (message) {
            if (this.chart) {
                this.chart.destroy();
            }
            if (!message && this.debugUrl == "") {
                
                message = "<img src='rdTemplate/rdChartError.gif'>";
            }
            if (message) {
                var errorContainer = Y.Node.create("<span style='color:red'></span>");
                errorContainer.setHTML(message);
                this.configNode.append(errorContainer);
            } else {
                var aLink, imgError;
                aLink = document.createElement("A")
                aLink.href = this.debugUrl
                //Make a new IMG inside of the anchor that points to the error GIF.
                imgError = document.createElement("IMG")
                imgError.src = "rdTemplate/rdChartError.gif"

                aLink.appendChild(imgError)
                this.configNode.append(aLink);
            }
        }

    }, {
        // Static Methods and properties
        NAME: 'ChartCanvas',
        ATTRS: {
            configNode: {
                value: null,
                setter: Y.one
            }
        },

        createElements: function (isAjax) {
            if (!isAjax) {
                isAjax = false;
            }

            var chart;

            Y.all('.' + TRIGGER).each(function (node) {
                chart = node.getData(TRIGGER);
                if (!chart) {
                    chart = new Y.LogiXML.ChartCanvas({
                        configNode: node,
                        isAjax: isAjax
                    });
                }
            });
        },

        handleError: function (e) {
            var chart = e.chart,
                code = e.code,
                errorText = '';
            switch (code) {
                case 10:
                    errorText = "Can't plot zero or subzero values on a logarithmic axis";
                    break;
                case 11:
                    //errorText = "Can't link axes of different type";
                    break;
                case 12:
                    errorText = "Chart expects point configuration to be numbers or arrays in turbo mode";
                    break;
                case 13:
                    errorText = "Rendering div not found";
                    break;
                case 14:
                    errorText = "String value sent to series.data, expected Number or DateTime";
                    break;
                case 15:
                    //errorText = "Chart expects data to be sorted for X-Axis";
                    break;
                case 17:
                    errorText = "The requested series type does not exist";
                    break;
                case 18:
                    errorText = "The requested axis does not exist";
                    break;
                case 19:
                    errorText = ''; //errorText = "Too many ticks";
                    break;
                default:
                    errorText = "Undefined error";
                    break;
            }
            if (errorText == '') {
                return;
            }
            var container = Y.one(chart.renderTo),
                errorContainer = container.one(".chartError"),
                hasError = false;
            if (!errorContainer) {
                errorContainer = container.append('<div class="rdChartCanvasError" style="display: inline-block; color:red" >Chart error:<ul class="chartError"></ul></div>').one(".chartError");
            }
            errorContainer.get('children').each(function (errorNode) {
                if (errorNode.get('text') == errorText) {
                    hasError = true;
                }
            });

            if (hasError === true) {
                return;
            }
            errorContainer.append('<li>' + errorText  + '</li>');
        },

        reflowCharts: function (rootNode) {
            if (rootNode && rootNode.all) {
                var chart;
                rootNode.all('.' + TRIGGER).each(function (node) {
                    chart = node.getData(TRIGGER);
                    if (chart) {
                        chart.chart.reflow();
                    }
                });
            }
        },

        resizeToWidth: function (width, cssSelectorPrefix) {
            var chart, e;
            Y.all(cssSelectorPrefix + ' .' + TRIGGER).each(function (node) {
                chart = node.getData(TRIGGER);
                if (chart) {
                    e = { width: width, finished: true };
                    chart.resized(e);
                }
            });
        }
    });

}, '1.0.0', { requires: ['base', 'node', 'event', 'node-custom-destroy', 'json-parse', 'io-xdr', 'chartCanvasRangeSelection'] });

function rdGetChartCanvasObject(chartId) {
    if (!chartId || chartId == '') {
        return null;
    }
    var div = Y.one('#' + chartId);
    if (!div) {
        return null;
    }
    return div.getData('rdChartCanvas');
}
