function rdAcUpdateControls(bRefresh, sReport, sAcId, bInit) {

    var eleBatchSelection = document.getElementById('rowBatchSelection_' + sAcId)
    if (!eleBatchSelection && !bInit) {  //When not batch selection, update the visualization with every control change.
        bRefresh = true
    }

    var sCurrChartType = document.getElementById('rdAcChartType_'+sAcId).value
    //var sElementIDs = sAcId + ",cellAcChart_" + sAcId
    var sElementIDs = sAcId + ",divAcControls_"  + sAcId + ",cellAcChart_" + sAcId

    var bForecast = false;
    if (document.getElementById('rdAcForecastType_' + sAcId) != null) bForecast = true;

    ShowElement(this.id, 'lblChartXLabelColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'lblChartXAxisColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'lblChartYDataColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'lblChartYAxisColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'lblChartSizeColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdAcChartSizeAggrLabel_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartXColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartCrosstabColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdAcChartXLabelColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdAcChartXDataColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdAcChartYColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdChartYShowValues_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdAcChartYAggrLabel_' + sAcId, 'Hide');
    ShowElement(this.id, 'rdAcChartYAggrList_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartExtraDataColumn_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartExtraAggrList_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartForecast_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartOrientation_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowChartRelevance_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowGaugeType_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowGaugeMin_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowGaugeGoal1_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowGaugeGoal2_' + sAcId, 'Hide');
    ShowElement(this.id, 'rowGaugeMax_' + sAcId, 'Hide');

    var eleCrosstab = document.getElementById('rdAcChartCrosstabColumn_' + sAcId)
    var sCrosstabColumn = ''
    if (eleCrosstab) {
        sCrosstabColumn = eleCrosstab.value
    }

	switch (sCurrChartType) {
			case 'Pie':
			case 'Bar':
			    ShowElement(this.id, 'lblChartXLabelColumn_' + sAcId, 'Show');
				ShowElement(this.id,'lblChartYDataColumn_'+sAcId,'Show');
				ShowElement(this.id,'rowChartXColumn_' + sAcId, 'Show');
				ShowElement(this.id, 'rdAcChartXLabelColumn_' + sAcId, 'Show');
				ShowElement(this.id, 'rdAcChartYColumn_' + sAcId, 'Show');
				ShowElement(this.id, 'rdChartYShowValues_' + sAcId, 'Show');
				ShowElement(this.id,'rdAcChartYAggrLabel_'+sAcId,'Show');
				ShowElement(this.id,'rdAcChartYAggrList_'+sAcId,'Show');

				if (sCurrChartType == "Bar") {
				    ShowElement(this.id, 'rowChartOrientation_' + sAcId, 'Show');
                    
				    //Crosstab column?
				    var eleCrosstabColumn = document.getElementById('rdAcChartCrosstabColumn_' + sAcId)
				    if (eleCrosstabColumn) {
				        if (eleCrosstabColumn.options.length > 1) {  //Hide when no column options.
				            ShowElement(this.id, 'rowChartCrosstabColumn_' + sAcId, 'Show');
				            if (sCrosstabColumn == '') {
				                ShowElement(this.id, 'rdAcStacking_' + sAcId, 'Hide');
				            } else {
				                ShowElement(this.id, 'rdAcStacking_' + sAcId, 'Show');
				                ShowElement(this.id, 'rdChartYShowValues_' + sAcId, 'Hide');
				            }
				        }
				    }
				}

				rdAcGetGroupByDateOperatorDiv(document.getElementById('rdAcChartXLabelColumn_'+sAcId).value, sAcId);
		        if(sCurrChartType == 'Pie' || sCurrChartType == ''){ 
				    document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = 'none';
				    document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = 'none';	           
				    if (bForecast && document.getElementById('rowChartForecast_' + sAcId) != null) {
                        rdAcHideForecast(sAcId);
	                }
		        }else{ 
		            if (bForecast) {
		                document.getElementById('rdAcForecastType_' + sAcId).style.display = '';
		                document.getElementById('rdAcChartForecastLabel_' + sAcId).style.display = ''		        
		                rdModifyTimeSeriesCycleLengthOptions(document.getElementById('rdAcChartsDateGroupBy_'+sAcId), sAcId);    
		                rdSetForecastOptions(document.getElementById('rdAcChartXLabelColumn_' + sAcId).value, sAcId);
		                rdShowForecast(document.getElementById('rdAcChartXLabelColumn_' + sAcId).value, sAcId);
		            }
		        }

			    //Relevance controls.
		        var sLabelColumnn = document.getElementById('rdAcChartXLabelColumn_' + sAcId).value
		        var sLabelColumnType = rdAcGetColumnDataType(sLabelColumnn, sAcId);
		        if (sLabelColumnType == "Text") {
		            if (sCrosstabColumn == '' || sCurrChartType == 'Pie') {  //No relevance filter with crosstabbed bar charts.
		                ShowElement(this.id, 'rowChartRelevance_' + sAcId, 'Show');
		                var sRelevanceType = document.getElementById('rdAcRelevanceType_' + sAcId).value
		                if (sRelevanceType == "None" || sRelevanceType == "Automatic") {
		                    ShowElement(this.id, 'rdAcRelevanceValue_' + sAcId, 'Hide');
		                } else {
		                    ShowElement(this.id, 'rdAcRelevanceValue_' + sAcId, 'Show');
		                }
		            }
		        }

		        break;

	    case 'Line':
	    case 'Spline':
	        ShowElement(this.id, 'lblChartXAxisColumn_' + sAcId, 'Show');
	        ShowElement(this.id, 'lblChartYAxisColumn_' + sAcId, 'Show');
	        ShowElement(this.id, 'rowChartXColumn_' + sAcId, 'Show');
	        ShowElement(this.id, 'rdAcChartXDataColumn_' + sAcId, 'Show');
	        ShowElement(this.id, 'rdAcChartYColumn_' + sAcId, 'Show');
	        rdAcSetAggrOptions(document.getElementById('rdAcChartXDataColumn_' + sAcId).value, sAcId);

	        var sColumn = document.getElementById('rdAcChartXDataColumn_' + sAcId).value
	        var sDataColumnType = rdAcGetColumnDataType(sColumn, sAcId);

	        //Crosstab column?
	        if (sCurrChartType == "Line") {  //No crosstabs for splines. #24121
	            if (sDataColumnType.toLowerCase().indexOf("date") != -1) {  //Grouped dates, allow crosstabs.
                    //Are there any columns listed?	               
	                var eleCrosstabColumn = document.getElementById('rdAcChartCrosstabColumn_' + sAcId)
	                if (eleCrosstabColumn) {
	                    if (eleCrosstabColumn.options.length > 1) {  //Hide when no column options.
	                        ShowElement(this.id, 'rowChartCrosstabColumn_' + sAcId, 'Show');
	                        if (sCrosstabColumn == '') {
	                            ShowElement(this.id, 'rdAcStacking_' + sAcId, 'Hide');
	                        } else {
	                            ShowElement(this.id, 'rdAcStacking_' + sAcId, 'Show');
	                        }
	                    }
	                }
	            }
	        }

	        if (bForecast) {
	            document.getElementById('rdAcForecastType_' + sAcId).style.display = '';
	            document.getElementById('rdAcChartForecastLabel_' + sAcId).style.display = ''
	            rdSetForecastOptions(document.getElementById('rdAcChartXDataColumn_' + sAcId).value, sAcId);
	            rdModifyTimeSeriesCycleLengthOptions(document.getElementById('rdAcChartsDateGroupBy_' + sAcId), sAcId);
	            rdShowForecast(sColumn, sAcId);
	        }
	        rdAcGetGroupByDateOperatorDiv(document.getElementById('rdAcChartXDataColumn_' + sAcId).value, sAcId);
	        break;


	    case 'Scatter':
				ShowElement(this.id,'lblChartXAxisColumn_'+sAcId,'Show');
				ShowElement(this.id,'lblChartYAxisColumn_'+sAcId,'Show');
				ShowElement(this.id,'rowChartXColumn_' + sAcId, 'Show');
				ShowElement(this.id,'rdAcChartXDataColumn_'+sAcId,'Show');
				ShowElement(this.id,'rdAcChartYColumn_'+sAcId,'Show');

				////if(bForecast) rdAcHideForecast(sAcId);
				document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = 'none';
				document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = 'none';
//                document.getElementById('rdAcChartsDateGroupBy_'+sAcId).value = '';	
				break;

			case 'Heatmap':
				ShowElement(this.id,'lblChartXLabelColumn_'+sAcId,'Show');
				ShowElement(this.id,'lblChartSizeColumn_'+sAcId,'Show');
				ShowElement(this.id,'rdAcChartSizeAggrLabel_'+sAcId,'Show');
				ShowElement(this.id,'rowChartXColumn_' + sAcId, 'Show');
				ShowElement(this.id,'rdAcChartXLabelColumn_' + sAcId, 'Show');
				ShowElement(this.id,'rdAcChartYColumn_'+sAcId,'Show');
				ShowElement(this.id,'rdAcChartYAggrList_'+sAcId,'Show');
				ShowElement(this.id,'rowChartExtraDataColumn_'+sAcId,'Show');
				ShowElement(this.id,'rowChartExtraAggrList_'+sAcId,'Show');

				document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = 'none';
				document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = 'none';
				
				break;

	        case 'Gauge':
	            ShowElement(this.id,'lblChartYDataColumn_' + sAcId, 'Show');
				ShowElement(this.id,'rdAcChartYColumn_' + sAcId, 'Show');
				ShowElement(this.id, 'rdAcChartYAggrLabel_' + sAcId, 'Show');
				ShowElement(this.id, 'rdAcChartYAggrList_' + sAcId, 'Show');
				ShowElement(this.id, 'rowGaugeType_' + sAcId, 'Show');
				ShowElement(this.id, 'rowGaugeMin_' + sAcId, 'Show');
				ShowElement(this.id,'rowGaugeGoal1_' + sAcId, 'Show');
				ShowElement(this.id,'rowGaugeGoal2_' + sAcId, 'Show');
				ShowElement(this.id,'rowGaugeMax_' + sAcId, 'Show');
				break;

    }

    //No Crosstab with Min nor Max aggregataions.
	var eleAggrSelect = document.getElementById("rdAcChartYAggrList_" + sAcId)
	var sSelectedAggr = eleAggrSelect.value
	if (sSelectedAggr == "MIN" || sSelectedAggr == "MAX") {
	    eleCrosstab.value = eleCrosstab.options[0].value
	    ShowElement(this.id, 'rowChartCrosstabColumn_' + sAcId, 'Hide');
    }

    //No forecast with Crosstab.
	if (sCrosstabColumn != '' && (sCurrChartType == 'Bar' || sCurrChartType == 'Line')) {
	    rdAcHideForecast(sAcId)
	}
	
	rdAcSetButtonStyle(sAcId,sCurrChartType,'Pie')
	rdAcSetButtonStyle(sAcId,sCurrChartType,'Bar')
	rdAcSetButtonStyle(sAcId,sCurrChartType,'Line')
	rdAcSetButtonStyle(sAcId,sCurrChartType,'Spline')
	rdAcSetButtonStyle(sAcId,sCurrChartType,'Scatter')
	rdAcSetButtonStyle(sAcId, sCurrChartType, 'Heatmap')
	rdAcSetButtonStyle(sAcId, sCurrChartType, 'Gauge')

	rdAcLoadDropdowns(sCurrChartType, sAcId)
    	
	if (bRefresh) {
        //Refresh the aggregation type lists.
        sElementIDs += ',lblHeadingAnalChart_' + sAcId;  //This is the AG's panel heading, when running AG.
	    var sAjaxUrl = "rdAjaxCommand=RefreshElement&rdAcRefresh=True&rdRefreshElementID=" + sElementIDs + '&rdReport=' + sReport + '&rdAcId=' + sAcId;
	    sAjaxUrl = sAjaxUrl + '&rdAcNewCommand=True';
	    rdAjaxRequestWithFormVars(sAjaxUrl);
	}
}


function rdAcLoadDropdowns(sCurrChartType, sAcId) {
    //These column dropdowns are set dynamically, client-side, based on chart type and data type.
    if (sCurrChartType == 'Pie' || sCurrChartType == 'Heatmap') {
        rdAcSetDropdownColumns(sAcId, "rdAcChartXLabelColumn", "Text")
    } else {
        rdAcSetDropdownColumns(sAcId, "rdAcChartXLabelColumn", "Text,Date,DateTime")
    }

    if (sCurrChartType == 'Line' || sCurrChartType == 'Spline' || sCurrChartType == 'Scatter') {
        rdAcSetDropdownColumns(sAcId, "rdAcChartYColumn", "Number")
    } else {
        rdAcSetDropdownColumns(sAcId, "rdAcChartYColumn", "Text,Number")
    }

    //Set the available aggregation types, depending on data types.
    rdAcSetDropdownAggrs(sAcId, "rdAcChartYAggrList", "rdAcChartYColumn")
    rdAcSetDropdownAggrs(sAcId, "rdAcChartExtraAggrList", "rdAcChartExtraDataColumn")

}

function rdAcSetDropdownColumns(sAcId, sSelectID, sDataTypes) {
    //Remove all existing columns.
    var eleSelect = document.getElementById(sSelectID + '_' + sAcId)
    var sSelectedValue = eleSelect.value
    for (var i = eleSelect.childNodes.length - 1; i>=0; i--) {
        var eleColumn = eleSelect.childNodes[i]
        if (eleColumn.tagName == "OPTION") {
            eleSelect.removeChild(eleColumn)
        }
    }
    
    //Add the columns that belong.
    var eleAllColumns = document.getElementById('rdAcAllColumnsHidden_' + sAcId)
    for (var i = 0; i < eleAllColumns.childNodes.length; i++) {
        var eleColumn = eleAllColumns.childNodes[i]
        if (eleColumn.tagName == "OPTION") {
            var sDataType = rdAcGetColumnDataType(eleColumn.value, sAcId)
            if (sDataTypes.indexOf(sDataType) != -1) {
                eleSelect.appendChild(eleColumn.cloneNode(true))
            }
        }
    }
    //Reselect the previous value, or the first. (need to make sure there is at least one)
    eleSelect.value = sSelectedValue
    if (eleSelect.value == "" && eleSelect.options[0]) {
        eleSelect.value = eleSelect.options[0].value 
    }
}


function rdAcSetDropdownAggrs(sAcId, sAggrSelectID, sColumnSelectID) {
    //Remove all existing aggrs.
    var eleAggrSelect = document.getElementById(sAggrSelectID + '_' + sAcId)
    var sSelectedAggr = eleAggrSelect.value
    for (var i = eleAggrSelect.childNodes.length - 1; i >= 0; i--) {
        var eleAggr = eleAggrSelect.childNodes[i]
        if (eleAggr.tagName == "OPTION") {
            eleAggrSelect.removeChild(eleAggr)
        }
    }

    //Get the data type for the selected column
    var eleDataColumn = document.getElementById(sColumnSelectID + '_' + sAcId)
    var sDataType = rdAcGetColumnDataType(eleDataColumn.value, sAcId)

    //Add the columns that belong.
    var eleAllAggrs = document.getElementById('rdAcAllAggrsHidden_' + sAcId)
    for (var i = 0; i < eleAllAggrs.childNodes.length; i++) {
        var eleAggr = eleAllAggrs.childNodes[i]
        if (eleAggr.tagName == "OPTION") {
            if (sDataType == "Number" || eleAggr.value.toLowerCase().indexOf("count") != -1) {
                //All aggregates for Numbers.  Other data types get Count and DistinctCount.
                eleAggrSelect.appendChild(eleAggr.cloneNode(true))
            }
        }
    }
    //Reselect the previous value, or the first.
    eleAggrSelect.value = sSelectedAggr
    if (eleAggrSelect.value == "") {
        eleAggrSelect.value = eleAggrSelect.options[0].value
    }

}



function rdAcSetButtonStyle(sAcId,sCurrChartType,sButtonType) {
    var eleButton = document.getElementById('lblChart' + sButtonType + '_' + sAcId)
    if (eleButton) {
        if (sButtonType==sCurrChartType) {
            eleButton.className='rdAcCommandHighlight'
        }else{
            eleButton.className='rdAcCommandIdle'
        }
                
        //Round the first and last buttons.
        var bStyleSet = false
        if (eleButton.parentNode.nextSibling.tagName=="A") {
            if (eleButton.parentNode.previousSibling.id.indexOf('actionShow')!=0) {
                //First button.
                eleButton.className = eleButton.className + " rdAcCommandLeft"
                bStyleSet = true
            }
       }
        if (eleButton.parentNode.previousSibling.tagName=="A") {
            if (eleButton.parentNode.nextSibling.id.indexOf('actionShow')!=0) {
                //Last button.
                eleButton.className = eleButton.className + " rdAcCommandRight"
                bStyleSet = true
            }
        }
        if (!bStyleSet) {  
            //Middle button
            eleButton.className = eleButton.className + " rdAcCommandMiddle"
        }
   
    }
}

function rdShowForecast(sColumn, sAcId){
    if(document.getElementById('rdAcForecastType_' + sAcId) == null) return;
    var sColumnDataType = rdAcGetColumnDataType(sColumn, sAcId) //#15892.
    if (sColumnDataType.toLowerCase() == "text") {
        rdAcHideForecast();
        return;
    }

    ShowElement(this.id, 'rowChartForecast_' + sAcId, 'Show');

    var eleForecastType = document.getElementById('rdAcForecastType_' + sAcId);
    if(eleForecastType.value == 'TimeSeriesDecomposition'){
        if(document.getElementById('rdAcChartsDateGroupBy_'+sAcId).value == "FirstDayOfYear"){
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = 'none';
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = 'none';
        }else{
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = '';
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = '';
        }
        document.getElementById('rdAcRegressionType_' + sAcId).style.display = 'none';
        document.getElementById('rdAcRegressionType_' + sAcId + '-Caption').style.display = 'none';      
        return;
    }
    else if(eleForecastType.value == 'Regression'){
        var eleRegression = document.getElementById('rdAcRegressionType_' + sAcId);
        document.getElementById('rdAcRegressionType_' + sAcId).style.display = '';
        document.getElementById('rdAcRegressionType_' + sAcId + '-Caption').style.display = '';
        document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = 'none';
        document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = 'none';
        return;
    }
    else{
        document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = 'none';
        document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = 'none';
        document.getElementById('rdAcRegressionType_' + sAcId).style.display = 'none';
        document.getElementById('rdAcRegressionType_' + sAcId + '-Caption').style.display = 'none';
    }
   
}


function rdAcHideForecast(sAcId) {
    if (document.getElementById('rdAcForecastType_' + sAcId) == null) return;
    document.getElementById('rowChartForecast_' + sAcId).style.display = 'none';
    document.getElementById('rdAcForecastType_' + sAcId).style.display = 'none';
    document.getElementById('rdAcChartForecastLabel_' + sAcId).style.display = 'none'
    document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = 'none';
    document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = 'none';
    document.getElementById('rdAcRegressionType_' + sAcId).style.display = 'none';
    document.getElementById('rdAcRegressionType_' + sAcId + '-Caption').style.display = 'none';
}

function rdAcSetAggrOptions(sColumn, sAcId) {
     // Function shows/Hides the Aggregation dropdown based on the X-axis column picked.
    if(document.getElementById('rdAcChartType_' + sAcId).value != "Line" && document.getElementById('rdAcChartType_' + sAcId).value != "Spline") return;   //#16559.
    if(sColumn == ''){
        document.getElementById('rowChartYAggr_' + sAcId).style.display = 'none';   
        return;
    } 
    var sDataColumnType = rdAcGetColumnDataType(sColumn, sAcId);
    if(sDataColumnType.toLowerCase() == "number"){
        ShowElement(this.id,'rdAcChartYAggrLabel_'+sAcId,'Hide');
		ShowElement(this.id,'rdAcChartYAggrList_'+sAcId,'Hide');                       
    }else{                              
        ShowElement(this.id,'rdAcChartYAggrLabel_'+sAcId,'Show');
		ShowElement(this.id,'rdAcChartYAggrList_'+sAcId,'Show');              
    }
}

function rdSetForecastOptions(sColumn, sAcId){
    if(document.getElementById('rdAcForecastType_' + sAcId) == null) return;
    if(sColumn =='') return;
    var eleDataForecastDropdown = document.getElementById('rdAcForecastType_' + sAcId);
    var sForecastValue = eleDataForecastDropdown.value;
    var eleDateGroupByDropdown = document.getElementById('rdAcChartsDateGroupBy_' + sAcId);
    var aForecastValues = ['None', 'TimeSeriesDecomposition', 'Regression']; 
    var aForecastOptions = ['', 'Time Series', 'Regression']; 
    var sDataColumnType = rdAcGetColumnDataType(sColumn, sAcId);
    if (sDataColumnType.toLowerCase() == "text") {
        rdAcHideForecast(sAcId);
        return;
    }
    if(sDataColumnType.toLowerCase() != "date" && sDataColumnType.toLowerCase() != "datetime"){
        if(eleDataForecastDropdown.options[1].value == 'TimeSeriesDecomposition'){
            eleDataForecastDropdown.remove(1);
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = 'none';
        }
    }else{
        if(eleDataForecastDropdown.options.length < 3){ 
            var j;
            for(j=0;j<4;j++){
                if(eleDataForecastDropdown.options.length > 0){
                    eleDataForecastDropdown.remove(0);
                }
            }
            var k;
            for(k=0;k<aForecastOptions.length;k++){
                var eleForecastOption = document.createElement('option');
                eleForecastOption.text = aForecastOptions[k];
                eleForecastOption.value = aForecastValues[k];
                eleDataForecastDropdown.add(eleForecastOption);
            }
            if(sForecastValue.length > 0){
                eleDataForecastDropdown.value = sForecastValue;
            }
            return;
        }
    }
}

function rdResetOrientation(sAcId) {
    var eleOrientation = document.getElementById('rdAcOrientation_' + sAcId)
    if (eleOrientation == null) return;
    var eleLabelColumn = document.getElementById('rdAcChartXLabelColumn_' + sAcId)
    if (eleLabelColumn == null) return;
    var sLabelColumnType = rdAcGetColumnDataType(eleLabelColumn.value, sAcId);
    if (sLabelColumnType.toLowerCase() == "date" || sLabelColumnType.toLowerCase() == "datetime") {
        eleOrientation.value = "Vertical"
    }else{
        eleOrientation.value = "Horizontal"    
    }
}

function rdAcGetColumnDataType(sColumn, sAcId){
    var eleAcDataColumnDetails = document.getElementById('rdAcDataColumnDetails_' + sAcId);
    if(eleAcDataColumnDetails.value != ''){
        var sDataColumnDetails = eleAcDataColumnDetails.value;
        var aDataColumnDetails = sDataColumnDetails.split(',')
        if(aDataColumnDetails.length > 0){
            var i;
            for(i=0;i<aDataColumnDetails.length;i++){
                var sDataColumnDetail = aDataColumnDetails[i];
                if(sDataColumnDetail.length > 1 && sDataColumnDetail.indexOf(':') > -1){
                    var sDataColumn = sDataColumnDetail.split(':')[0];
                    if(sDataColumn == sColumn){
                        return sDataColumnDetail.split(':')[1];
                    }
                }
            }
        }
    }
}

function rdModifyTimeSeriesCycleLengthOptions(sColumnGroupByDropdown, sAcId){
    if(document.getElementById('rdAcForecastType_' + sAcId) == null) return;
    var eleTimeSeriesCycleLengthDropdown = document.getElementById('rdAcTimeSeriesCycle_' + sAcId);
    var sTimeSeriesCycleLength = eleTimeSeriesCycleLengthDropdown.value;
    var sColumnGroupByValue = sColumnGroupByDropdown.value
    var i; var j = 0; var aColumnGroupByOptions = ['Year', 'Quarter', 'Month', 'Week', 'Day', 'Hour']; 
    rdResetTimeSeriesCycleLenthDropdown(sAcId);
    switch(sColumnGroupByValue){
        case 'FirstDayOfYear':
         for(i=0;i<7;i++){
                var eleTimeSeriesCycleLengthOption = eleTimeSeriesCycleLengthDropdown.options[j]
                if(eleTimeSeriesCycleLengthOption != null){
                    if(eleTimeSeriesCycleLengthOption.value != ''){
                        eleTimeSeriesCycleLengthDropdown.remove(j);
                    }else{
                        if(eleTimeSeriesCycleLengthOption.value == sTimeSeriesCycleLength){
                            eleTimeSeriesCycleLengthDropdown.value = sTimeSeriesCycleLength;
                        }
                        j += 1;
                    }
                }
            }
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = 'none';
            document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = 'none';
            break;
        case 'FirstDayOfQuarter':
        for(i=0;i<7;i++){
                var eleTimeSeriesCycleLengthOption = eleTimeSeriesCycleLengthDropdown.options[j]
                if(eleTimeSeriesCycleLengthOption != null){
                    if(eleTimeSeriesCycleLengthOption.value != '' && eleTimeSeriesCycleLengthOption.value != 'Year'){
                        eleTimeSeriesCycleLengthDropdown.remove(j);
                    }else{
                        if(eleTimeSeriesCycleLengthOption.value == sTimeSeriesCycleLength){
                            eleTimeSeriesCycleLengthDropdown.value = sTimeSeriesCycleLength;
                        }
                        j += 1;
                    }
                }
            }
            if(document.getElementById('rdAcForecastType_' + sAcId).value == 'TimeSeriesDecomposition'){
                document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = '';
                document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = '';
            }
            break;
        case 'FirstDayOfMonth':
            for(i=0;i<7;i++){
                var eleTimeSeriesCycleLengthOption = eleTimeSeriesCycleLengthDropdown.options[j]
                if(eleTimeSeriesCycleLengthOption != null){
                    if(eleTimeSeriesCycleLengthOption.value != '' && eleTimeSeriesCycleLengthOption.value != 'Year' && eleTimeSeriesCycleLengthOption.value != 'Quarter'){
                        eleTimeSeriesCycleLengthDropdown.remove(j);
                    }else{
                        if(eleTimeSeriesCycleLengthOption.value == sTimeSeriesCycleLength){
                            eleTimeSeriesCycleLengthDropdown.value = sTimeSeriesCycleLength;
                        }
                        j += 1;
                    }
                }
            }
            if(document.getElementById('rdAcForecastType_' + sAcId).value == 'TimeSeriesDecomposition'){
                document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = '';
                document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = '';
            }
            break;
        case 'Date':
            for(i=0;i<7;i++){
                var eleTimeSeriesCycleLengthOption = eleTimeSeriesCycleLengthDropdown.options[j]
                if(eleTimeSeriesCycleLengthOption != null){
                    if(eleTimeSeriesCycleLengthOption.value != '' && eleTimeSeriesCycleLengthOption.value != 'Year' && eleTimeSeriesCycleLengthOption.value != 'Quarter' && eleTimeSeriesCycleLengthOption.value != 'Month' && eleTimeSeriesCycleLengthOption.value != 'Week'){
                        eleTimeSeriesCycleLengthDropdown.remove(j);
                    }else{
                        if(eleTimeSeriesCycleLengthOption.value == sTimeSeriesCycleLength){
                            eleTimeSeriesCycleLengthDropdown.value = sTimeSeriesCycleLength;
                        }
                        j += 1;
                    }
                }
            }
            if(document.getElementById('rdAcForecastType_' + sAcId).value == 'TimeSeriesDecomposition'){
                document.getElementById('rdAcTimeSeriesCycle_' + sAcId).style.display = '';
                document.getElementById('rdAcTimeSeriesCycle_' + sAcId + '-Caption').style.display = '';
            }
            break;
    }
    if(eleTimeSeriesCycleLengthDropdown.value == ''){
        eleTimeSeriesCycleLengthDropdown.value = eleTimeSeriesCycleLengthDropdown.options[eleTimeSeriesCycleLengthDropdown.options.length -1].value;
        if(eleTimeSeriesCycleLengthDropdown.options[eleTimeSeriesCycleLengthDropdown.options.length -1].value == "Day"){
            eleTimeSeriesCycleLengthDropdown.value = '';
        }        
    }
}

function rdResetTimeSeriesCycleLenthDropdown(sAcId){
    if(document.getElementById('rdAcForecastType_' + sAcId) == null) return;
    var eleTimeSeriesCycleLengthDropdown = document.getElementById('rdAcTimeSeriesCycle_' + sAcId);
    var i; var aColumnGroupByOptions = ['', 'Year', 'Quarter', 'Month', 'Week', 'Day']; 
    if(eleTimeSeriesCycleLengthDropdown.options.length >5) return;
    for(i=0;i<7;i++){
        if(eleTimeSeriesCycleLengthDropdown.options.length > 0){
            eleTimeSeriesCycleLengthDropdown.remove(0);
        }else{
            break;
        }
    }
    for(i=0;i<aColumnGroupByOptions.length;i++){
        var eleTimeSeriesOption = document.createElement('option');
        eleTimeSeriesOption.text = aColumnGroupByOptions[i];
        eleTimeSeriesOption.value = aColumnGroupByOptions[i];
        eleTimeSeriesCycleLengthDropdown.add(eleTimeSeriesOption);
    }
}

function rdAcGetGroupByDateOperatorDiv(sDataColumn,sAcId){
    if(typeof(sDataColumn) == 'undefined'){
        document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = 'none';
	    document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = 'none';
    }
    var eleDateColumnsForGrouping = document.getElementById('rdAcPickDateColumnsForGrouping_' + sAcId);
    if(eleDateColumnsForGrouping != null){
        if(eleDateColumnsForGrouping.value.length > 0){
            if(eleDateColumnsForGrouping.value.indexOf(sDataColumn) > -1){
                document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = '';
                document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = '';
            }
            else {
                document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = 'none';
                document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = 'none';
            }
        }
        else {
            document.getElementById('rdAcChartsDateGroupBy_' + sAcId).style.display = 'none';
            document.getElementById('rdAcChartsDateGroupBy_' + sAcId + '-Caption').style.display = 'none';
        }
    }
    else {
        document.getElementById('rdAcChartsDateGroupBy_'+sAcId).style.display = 'none';
	    document.getElementById('rdAcChartsDateGroupBy_'+sAcId + '-Caption').style.display = 'none';
    }
}

