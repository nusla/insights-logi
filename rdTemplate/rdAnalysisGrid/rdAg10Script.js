YUI.add('analysis-grid', function(Y) {

	var rdFilterOldComparisonOptionsArray = new Array();    // Array holds the Analysis Grid Filter Comparison options ('Starts With' and 'Contains') in memory.
	var rdFilterNewComparisonOptionsArray = new Array();    // Array holds the Analysis Grid Filter Comparison option ('Date Range') in memory.
	// Holding the values in memory seems to be a better option to handle the issues that may raise with internationalization.

	Y.namespace('LogiInfo').AnalysisGrid = Y.Base.create('AnalysisGrid', Y.Base, [], {
	
		initializer : function() {
		
			//Show the selected tab (if the menu is not hidden) -- Dont show menu if we just added a crosstab or chart 24511
		    if (!(location.href.indexOf("AcChartAdd") > -1 || location.href.indexOf("AxAdd") > -1)
                && !Y.Lang.isValue(Y.one('hideAgMenu'))
			&& Y.Lang.isValue(document.getElementById('rdAgCurrentOpenPanel')))
			    this.rdAgShowMenuTab(document.getElementById('rdAgCurrentOpenPanel').value, true);

		    //Show the selected tab (if the menu is not hidden)
			if (!Y.Lang.isValue(Y.one('hideAgMenu'))
			&& Y.Lang.isValue(document.getElementById('rdAgCurrentOpenTablePanel')))
			    this.rdAgShowTableMenuTab(document.getElementById('rdAgCurrentOpenTablePanel').value, true);
			
			//Open the correct chart panel if there is an error
			var chartError = Y.one('#rdChartError');
			if (Y.Lang.isValue(chartError))
				this.rdAgShowChartAdd(chartError.get('value'));
		
			//Initialize draggable panels if not disabled
			if (Y.Lang.isValue(Y.one('#rdAgDraggablePanels')))
			    this.rdInitDraggableAgPanels();

			if (document.getElementById('rdAgCurrentOpenTablePanel') && document.getElementById('rdAgCurrentOpenTablePanel').value == "")
			    this.rdAgShowTableMenuTab("Layout");

			if (document.getElementById('rdAllowCrosstabBasedOnCurrentColumns') && document.getElementById('rdAllowCrosstabBasedOnCurrentColumns').value == "False")
			    this.rdSetPanelDisabledClass('Crosstab');
		},
		
		/* -----Analysis Grid Methods----- */

		rdAgShowMenuTab: function (sTabName, bCheckForReset, sSelectedColumn, bKeepOpen) {

		    var bNoData = false;
		    var eleStartTableDropdown = document.getElementById('rdStartTable');

		    if (eleStartTableDropdown != null) {
		        if (eleStartTableDropdown.selectedIndex == 0) {
		                //No table selected in QB. Show the QB.
		            sTabName = "QueryBuilder"
		            bNoData = true
		        }
		    }

		    var bOpen = true;

			if (sTabName.length==0){
				bOpen=false;
			}else{
				var eleSelectedTab = document.getElementById('col' + sTabName);
				var eleSelectedRow = document.getElementById('row' + sTabName);

                //24368
				if (eleSelectedTab && eleSelectedTab.className.indexOf('rdAgSelectedTab')!=-1) {
					bOpen = false;
				}
				if (bCheckForReset){
					if (location.href.indexOf("rdAgLoadSaved")!=-1){
						bOpen = false;
					}
				}
			}
			if (bNoData) {
			    bOpen = true;  //When no data, that tab must always remain open.
			}

			if (bKeepOpen && bKeepOpen == true) {
			    bOpen = true;  //Coming from the ag column menu so we dont want to toggle
			}

			var bAlreadyOpen = false;
			if (document.getElementById('rdAgCurrentOpenPanel').value == sTabName)
			    bAlreadyOpen = true;

			document.getElementById('rdAgCurrentOpenPanel').value = '';

			this.rdSetClassNameById('colQueryBuilder', 'rdAgUnselectedTab');
			this.rdSetClassNameById('colCalc', 'rdAgUnselectedTab');
			this.rdSetClassNameById('colFilter', 'rdAgUnselectedTab');
			this.rdSetClassNameById('colTableEdit', 'rdAgUnselectedTab');

			this.rdSetDisplayById('rowQueryBuilder', 'none');
			this.rdSetDisplayById('rowCalc', 'none');
			this.rdSetDisplayById('rowFilter', 'none');
			this.rdSetDisplayById('rowEdit', 'none');
		
			if (bOpen) {
			    
			    document.getElementById('rdAgCurrentOpenPanel').value = sTabName;
                if(eleSelectedTab)
			        eleSelectedTab.className = 'rdAgSelectedTab';

                if(eleSelectedRow)
                    eleSelectedRow.style.display = '';

			    //Dont fade the tab if it is already open
                if (!bCheckForReset && eleSelectedRow && eleSelectedRow.firstChild && !bAlreadyOpen)   // Avoid flicker/fading effect when Paged/Sorted/Postbacks.
                {             
                    rdFadeElementIn(eleSelectedRow.firstChild, 400);    //#11723, #17294 tr does not handle transition well.
                }
			}
			
			this.rdSetPanelModifiedClass('QueryBuilder');
			this.rdSetPanelModifiedClass('Calc');
			this.rdSetPanelModifiedClass('Filter');
			this.rdSetPanelModifiedClass('TableEdit');

			if (bNoData) {
			    this.rdSetPanelDisabledClass('Calc');
			    this.rdSetPanelDisabledClass('Filter');
			    this.rdSetPanelDisabledClass('TableEdit');
			    this.rdSetPanelDisabledClass('Chart');
			    this.rdSetPanelDisabledClass('Crosstab');
            }

			if (typeof window.rdRepositionSliders != 'undefined') {
				//Move CellColorSliders, if there are any.
				rdRepositionSliders();
			}

            //Set column and scroll into view if this came from the table menu
			if (sTabName == "Filter") {
			    if (sSelectedColumn && sSelectedColumn != "") {
                    //Select the right column
			        Y.one("#rdAgFilterColumn").get("options").each(function () {
			            var value = this.get('value');
			            if (value == sSelectedColumn)
			                this.set('selected', true);
			        });
			        Y.one('#rowsAnalysisGrid').scrollIntoView();
			    }
				this.rdAgShowPickDistinctButton();
			}
			
		},

		rdGetCookie: function (varName) {
		    var name = varName + "=";
		    var cookieString = document.cookie.split(';');
		    for (var i = 0; i < cookieString.length; i++) {
		        var cookie = cookieString[i].trim();
		        if (cookie.indexOf(name) == 0) return cookie.substring(name.length, cookie.length);
		    }
		    return "";
		},

		rdSetCookie: function (name, value) {
		    document.cookie = name + "=" + value + "; ";
		},

		rdAgToggleTablePanel: function (initializing) {

		    var expandedState = this.rdGetCookie('rdPanelExpanded_Table');
		    //We do not want to toggle if we are intializing the AG
		    if (!initializing) {
		        if (expandedState != "True") {
		            expandedState = "True";
		            this.rdSetCookie('rdPanelExpanded_Table', "True");
		        }
		        else {
		            expandedState = "False";
		            this.rdSetCookie('rdPanelExpanded_Table', "False");
		        }
		    }
		    
		    if (expandedState != "False") {
		        var divClosed = document.getElementById('divPanelClosed_Table');
		        if (divClosed)
		            divClosed.style.display = 'none';
		        var divOpen = document.getElementById('divPanelOpen_Table');
		        if (divOpen)
		            divOpen.style.display = '';
		        var rowContent = document.getElementById('rowContentTable');
		        if (rowContent)
		            rowContent.style.display = '';
		        var rowMenuOptions = document.getElementById('rowsTableMenuOptions');
		        if (rowMenuOptions)
		            rowMenuOptions.style.display = '';
		        var rowControls = document.getElementById('rowTableControls');
		        if (rowControls)
		            rowControls.style.display = '';
		        var colAddToDashboard = document.getElementById('colTableAddDashboard');
		        if (colAddToDashboard)
		            colAddToDashboard.style.display = '';
		        var rowTableMenu = document.getElementById('colTableMenu');
		        if (rowTableMenu)
		            rowTableMenu.style.display = '';
		        var colTableExport = document.getElementById('colTableExportControls');
		        if (colTableExport)
		            colTableExport.style.display = '';

		    }
		    else {
		        var divClosed = document.getElementById('divPanelClosed_Table');
		        if (divClosed)
		            divClosed.style.display = '';
		        var divOpen = document.getElementById('divPanelOpen_Table');
		        if (divOpen)
		            divOpen.style.display = 'none';
		        var rowContent = document.getElementById('rowContentTable');
		        if (rowContent)
		            rowContent.style.display = 'none';
		        var rowMenuOptions = document.getElementById('rowsTableMenuOptions');
		        if (rowMenuOptions)
		            rowMenuOptions.style.display = 'none';
		        var rowControls = document.getElementById('rowTableControls');
		        if (rowControls)
		            rowControls.style.display = 'none';
		        var colAddToDashboard = document.getElementById('colTableAddDashboard');
		        if (colAddToDashboard)
		            colAddToDashboard.style.display = 'none';
		        var colTableMenu = document.getElementById('colTableMenu');
		        if (colTableMenu)
		            colTableMenu.style.display = 'none';
		        var colTableExport = document.getElementById('colTableExportControls');
		        if (colTableExport)
		            colTableExport.style.display = 'none';
		    }

		    if (typeof window.rdRepositionSliders != 'undefined') {
		        //Move CellColorSliders, if there are any.
		        rdRepositionSliders();
		    }

		},

		rdAgToggleCrosstabPanel: function (sID, initializing) {

		    var expandedState = this.rdGetCookie('rdPanelExpanded_' + sID);
		    //We do not want to toggle if we are intializing the AG
		    if (!initializing) {
		        if (expandedState != "True") {
		            expandedState = "True";
		            this.rdSetCookie('rdPanelExpanded_' + sID, "True");
		        }
		        else {
		            expandedState = "False";
		            this.rdSetCookie('rdPanelExpanded_' + sID, "False");
		        }
		    }

		    if (expandedState == "True") {
		        var divClosed = document.getElementById('divPanelClosed_' + sID);
		        if (divClosed)
		            divClosed.style.display = 'none';
		        var divOpen = document.getElementById('divPanelOpen_' + sID);
		        if (divOpen)
		            divOpen.style.display = '';
		        var rowContent = document.getElementById('rowContentAnalCrosstab_' + sID);
		        if (rowContent)
		            rowContent.style.display = '';
		        var colAddToDashboard = document.getElementById('colAnalCrosstabAddDashboard_' + sID);
		        if (colAddToDashboard)
		            colAddToDashboard.style.display = '';
		        var colEdit = document.getElementById('colAxEdit_' + sID);
		        if (colEdit)
		            colEdit.style.display = '';
		        var colExport = document.getElementById('divCrosstabExportControls_' + sID);
		        if (colExport)
		            colExport.style.display = '';
            }
		    else {
		        var divClosed = document.getElementById('divPanelClosed_' + sID);
		        if (divClosed)
		            divClosed.style.display = '';
		        var divOpen = document.getElementById('divPanelOpen_' + sID);
		        if (divOpen)
		            divOpen.style.display = 'none';
		        var rowContent = document.getElementById('rowContentAnalCrosstab_' + sID);
		        if (rowContent)
		            rowContent.style.display = 'none';
		        var colAddToDashboard = document.getElementById('colAnalCrosstabAddDashboard_' + sID);
		        if (colAddToDashboard)
		            colAddToDashboard.style.display = 'none';
		        var colEdit = document.getElementById('colAxEdit_' + sID);
		        if (colEdit)
		            colEdit.style.display = 'none';
		        var colExport = document.getElementById('divCrosstabExportControls_' + sID);
		        if (colExport)
		            colExport.style.display = 'none';
            }
		    if (typeof window.rdRepositionSliders != 'undefined') {
		        //Move CellColorSliders, if there are any.
		        rdRepositionSliders();
		    }

		},


	    /* ---This function gets a list of AG columns for the datatype specified --- */
		rdAgGetColumnList: function (array, arrayLabel, sDataType, aAggrGroupLabel, aAggrGroupLabelClass, includeGroupAggr) {
		    var eleAgDataColumnDetails = document.getElementById('rdAgDataColumnDetails');
		    if (eleAgDataColumnDetails.value != '') {
		        var sDataColumnDetails = eleAgDataColumnDetails.value;
		        var aDataColumnDetails = sDataColumnDetails.split(',')
		        if (aDataColumnDetails.length > 0) {
		            var i; var j = 0;
		            var sColumnVal = '';
		            for (i = 0; i < aDataColumnDetails.length; i++) {
		                var sDataColumnDetail = aDataColumnDetails[i];
		                if (includeGroupAggr == false && sDataColumnDetail.indexOf('^') > -1) {
		                    sDataColumnDetail = '';
		                }
		                if (sDataColumnDetail.length > 1 && sDataColumnDetail.indexOf(':') > -1) {
		                    var sDataColumnType = sDataColumnDetail.split(':')[1].split("|")[0];
		                    if (sDataType == '') {
		                        sColumnVal = sDataColumnDetail.split(':')[0];
		                        array[i] = sColumnVal.split(';')[0];
		                        arrayLabel[i] = sColumnVal.split(';')[1];
		                        /* 21211 - Non IE browsers need a blank value defined for empty array entries */
		                        if (i == 1) {
		                            array[0] = '';
		                            arrayLabel[0] = '';
		                        }
		                        if (sDataColumnDetail.indexOf("|") > -1) {
		                            aAggrGroupLabel[i] = sDataColumnDetail.split('|')[1].split('-')[0];
		                            if (sDataColumnDetail.indexOf("^") > -1) {
		                                aAggrGroupLabelClass[i] = sDataColumnDetail.split('-')[1].split('^')[0];
		                            }
		                            else {
		                                aAggrGroupLabelClass[i] = sDataColumnDetail.split('|')[1].split('-')[1];
		                            }
		                        }
		                        else {
		                            aAggrGroupLabel[i] = '';
		                            aAggrGroupLabelClass[i] = '';
		                        }
		                    }
		                    else if (sDataType == 'number' && sDataColumnType == 'Number') {
		                        sColumnVal = sDataColumnDetail.split(':')[0];
		                        array[j] = sColumnVal.split(';')[0];
		                        arrayLabel[j] = sColumnVal.split(';')[1];
		                        j++;
		                        if (sDataColumnDetail.indexOf("|") > -1) {
		                            aAggrGroupLabel[j] = sDataColumnDetail.split('|')[1].split('-')[0];
		                            aAggrGroupLabelClass[j] = sDataColumnDetail.split('|')[1].split('-')[1];
		                        }
		                        else {
		                            aAggrGroupLabel[j] = '';
		                            aAggrGroupLabelClass[j] = '';
		                        }
		                    }
		                }
		            }
		            if (sDataType == 'number') {
		                array.unshift('');
		                arrayLabel.unshift('');
		            }
		        }
		    }
		},

		rdAgGetColumnDataType: function (sColumn) {
		    var eleAgDataColumnDetails = document.getElementById('rdAgDataColumnDetails');
		    if (eleAgDataColumnDetails.value != '') {
		        var sDataColumnDetails = eleAgDataColumnDetails.value;
		        var aDataColumnDetails = sDataColumnDetails.split(',')
		        if (aDataColumnDetails.length > 0) {
		            var i;
		            for (i = 0; i < aDataColumnDetails.length; i++) {
		                var sDataColumnDetail = aDataColumnDetails[i];
		                if (sDataColumnDetail.length > 1 && sDataColumnDetail.indexOf(':') > -1) {
		                    var sDataColumn = sDataColumnDetail.split(':')[0];
		                    sDataColumn = sDataColumn.split(';')[1];
		                    if (sDataColumn == sColumn) {
		                        //22397
		                        return sDataColumnDetail.split(':')[1].split("|")[0];
		                    }
		                }
		            }
		        }
		    }
		},


		rdAgToggleChartPanel: function (sID, initializing) {

		    var expandedState = this.rdGetCookie('rdPanelExpanded_' + sID);
		    //We do not want to toggle if we are intializing the AG
		    if (!initializing) {
		        if (expandedState != "True") {
		            expandedState = "True";
		            this.rdSetCookie('rdPanelExpanded_' + sID, "True");
		        }
		        else {
		            expandedState = "False";
		            this.rdSetCookie('rdPanelExpanded_' + sID, "False");
		        }
		    }

		    if (expandedState == "True") {
		        var divClosed = document.getElementById('divPanelClosed_' + sID);
		        if (divClosed)
		            divClosed.style.display = 'none';
		        var divOpen = document.getElementById('divPanelOpen_' + sID);
		        if(divOpen)
		            divOpen.style.display = '';
		        var rowContent = document.getElementById('rowContentAnalChart_' + sID);
		        if (rowContent)
		            rowContent.style.display = '';
		        var colAddToDashboard = document.getElementById('colAnalChartAddDashboard_' + sID);
		        if (colAddToDashboard)
		            colAddToDashboard.style.display = '';
		        var colEdit = document.getElementById('colAcEdit_' + sID);
		        if (colEdit)
		            colEdit.style.display = '';
		    }
		    else {
		        var divClosed = document.getElementById('divPanelClosed_' + sID);
		        if (divClosed)
		            divClosed.style.display = '';
		        var divOpen = document.getElementById('divPanelOpen_' + sID);
		        if (divOpen)
		            divOpen.style.display = 'none';
		        var rowContent = document.getElementById('rowContentAnalChart_' + sID);
		        if (rowContent)
		            rowContent.style.display = 'none';
		        var colAddToDashboard = document.getElementById('colAnalChartAddDashboard_' + sID);
		        if (colAddToDashboard)
		            colAddToDashboard.style.display = 'none';
		        var colEdit = document.getElementById('colAcEdit_' + sID);
		        if (colEdit)
		            colEdit.style.display = 'none';
		    }
		    if (typeof window.rdRepositionSliders != 'undefined') {
		        //Move CellColorSliders, if there are any.
		        rdRepositionSliders();
		    }

		},

		rdChangeAggregateOptions: function(){
		    var aAggrList = []; var aAggrListLabel = []; var aAggrGroupLabel = []; var aAggrGroupLabelClass = [];

		    this.rdAgGetColumnList(aAggrList, aAggrListLabel, '', aAggrGroupLabel, aAggrGroupLabelClass, false);
	
		    var rdColList = document.getElementById('rdAgAggrColumn');
		    var sVal = rdColList.options[rdColList.selectedIndex].value;

		    var dataType = this.rdAgGetColumnDataType(sVal);
		    rdchangeList('rdAgAggrFunction', aAggrList, aAggrListLabel, dataType, '', '');
		},

		rdAgTableTogglePanelMenu: function (initializing) {

		    var expandedState = this.rdGetCookie('rdTablePanelMenuExpanded');
		    //We do not want to toggle if we are intializing the AG
		    if (!initializing) {
		        if (expandedState != "True") {
		            expandedState = "True";
		            this.rdSetCookie('rdTablePanelMenuExpanded', "True");
		        }
		        else {
		            expandedState = "False";
		            this.rdSetCookie('rdTablePanelMenuExpanded', "False");
		        }
		    }

		    if (expandedState == "False") {
		        var menu = document.getElementById('rowTableMenu');
		        if (menu)
		            menu.style.display = 'none';
		        var selected = document.getElementById('divTableEditSelected');
		        if (selected)
		            selected.style.display = 'none';
		        var unselected = document.getElementById('divTableEditUnselected');
		        if (unselected)
		            unselected.style.display = '';
		    }
		    else {
		        var menu = document.getElementById('rowTableMenu');
		        if (menu)
		            menu.style.display = '';
		        var selected = document.getElementById('divTableEditSelected');
		        if (selected)
		            selected.style.display = '';
		        var unselected = document.getElementById('divTableEditUnselected');
		        if (unselected)
		            unselected.style.display = 'none';
		    }
		    if (typeof window.rdRepositionSliders != 'undefined') {
		        //Move CellColorSliders, if there are any.
		        rdRepositionSliders();
		    }

		},

		rdAgChartTogglePanelMenu: function (sID, initializing) {
  
		    var expandedState = this.rdGetCookie('rdChartPanelMenuExpanded_' + sID);
		    //We do not want to toggle if we are intializing the AG
		    if (!initializing) {
		        if (expandedState != "True") {
		            expandedState = "True";
		            this.rdSetCookie('rdChartPanelMenuExpanded_' + sID, "True");
		        }
		        else {
		            expandedState = "False";
		            this.rdSetCookie('rdChartPanelMenuExpanded_' + sID, "False");
		        }
		    }
		    if (expandedState == "False") {
		        var types = document.getElementById('divAcChartTypes_' + sID);
		        if (types)
		            types.style.display = 'none';
		        var lists = document.getElementById('divChartLists_' + sID);
		        if (lists)
		            lists.style.display = 'none';
		        var controls = document.getElementById('divAcControls_' + sID);
		        if (controls)
		            controls.style.display = 'none';
		        var selected = document.getElementById('divAcEditSelected_' + sID);
		        if (selected)
		            selected.style.display = 'none';
		        var unselected = document.getElementById('divAcEditUnselected_' + sID);
		        if (unselected)
		            unselected.style.display = '';
		    }
		    else {
		        var types = document.getElementById('divAcChartTypes_' + sID);
		        if (types)
		            types.style.display = '';
		        var lists = document.getElementById('divChartLists_' + sID);
		        if (lists)
		            lists.style.display = '';
		        var controls = document.getElementById('divAcControls_' + sID);
		        if (controls)
		            controls.style.display = '';
		        var selected = document.getElementById('divAcEditSelected_' + sID);
		        if (selected)
		            selected.style.display = '';
		        var unselected = document.getElementById('divAcEditUnselected_' + sID);
		        if (unselected)
		            unselected.style.display = 'none';
		    }
		    if (typeof window.rdRepositionSliders != 'undefined') {
		        //Move CellColorSliders, if there are any.
		        rdRepositionSliders();
		    }

		},
    
		rdAgCrosstabTogglePanelMenu: function (sID, initializing) {

		    var expandedState = this.rdGetCookie('rdCrosstabPanelMenuExpanded_' + sID);
            //We do not want to toggle if we are intializing the AG
		    if (!initializing) {
		        if (expandedState != "True") {
		            expandedState = "True";
		            this.rdSetCookie('rdCrosstabPanelMenuExpanded_' + sID, "True");
		        }
		        else {
		            expandedState = "False";
		            this.rdSetCookie('rdCrosstabPanelMenuExpanded_' + sID, "False");
		        }
		    }

		    if (expandedState == "False") {
		        var controls = document.getElementById('divAxControls_' + sID);
		        if(controls)
		            controls.style.display = 'none';
		        var selected = document.getElementById('divAxEditSelected_' + sID);
		        if(selected)
		            selected.style.display = 'none';
		        var unselected = document.getElementById('divAxEditUnselected_' + sID);
		        if(unselected)
		            unselected.style.display = '';
		    }
		    else {
		        var controls = document.getElementById('divAxControls_' + sID);
		        if (controls)
		            controls.style.display = '';
		        var selected = document.getElementById('divAxEditSelected_' + sID);
		        if (selected)
		            selected.style.display = '';
		        var unselected = document.getElementById('divAxEditUnselected_' + sID);
		        if (unselected)
		            unselected.style.display = 'none';
		    }
		    if (typeof window.rdRepositionSliders != 'undefined') {
		        //Move CellColorSliders, if there are any.
		        rdRepositionSliders();
		    }

		},

		rdAgShowTableMenuTab: function (sTabName, bCheckForReset, sSelectedColumn) {

		    var bNoData = false;
		    var bOpen = true;

		    //sTabName may have a ,
		    sTabName = sTabName.replace(/,/g, "")

		    if (sTabName.length == 0) {
		        bOpen = false;
		    } else {
		        var eleSelectedTab = document.getElementById('lblHeading' + sTabName);
		        var eleSelectedRow = document.getElementById('row' + sTabName);

		        //24368
                if (eleSelectedTab && eleSelectedTab.className.indexOf('rdAgCommandHighlight') != -1) {
		            bOpen = false;
		        }
		        if (bCheckForReset) {
		            if (location.href.indexOf("rdAgLoadSaved") != -1) {
		                bOpen = false;
		            }
		        }
		    }
		    if (bNoData) {
		        bOpen = true;  //When no data, that tab must always remain open.
		    }

		    document.getElementById('rdAgCurrentOpenTablePanel').value = '';

		    this.rdSetClassNameById('lblHeadingGroup', 'rdAgCommandIdle');
		    this.rdSetClassNameById('lblHeadingAggr', 'rdAgCommandIdle');
		    this.rdSetClassNameById('lblHeadingPaging', 'rdAgCommandIdle');
		    this.rdSetClassNameById('lblHeadingSortOrder', 'rdAgCommandIdle');
		    this.rdSetClassNameById('lblHeadingLayout', 'rdAgCommandIdle');

		    this.rdSetDisplayById('rowLayout', 'none');
		    this.rdSetDisplayById('rowSortOrder', 'none');
		    this.rdSetDisplayById('rowGroup', 'none');
		    this.rdSetDisplayById('rowAggr', 'none');
		    this.rdSetDisplayById('rowPaging', 'none');


		    if (bOpen && eleSelectedTab) {
		        document.getElementById('rdAgCurrentOpenTablePanel').value = sTabName;
		        eleSelectedTab.className = 'rdAgCommandHighlight';

		        if (eleSelectedRow)
		            eleSelectedRow.style.display = '';
		        if (!bCheckForReset && eleSelectedRow && eleSelectedRow.firstChild)   // Avoid flicker/fading effect when Paged/Sorted/Postbacks.
		            rdFadeElementIn(eleSelectedRow.firstChild, 400);    //#11723, #17294 tr does not handle transition well.
		    }

		    this.rdSetPanelModifiedClass('Layout');
		    this.rdSetPanelModifiedClass('SortOrder');
		    this.rdSetPanelModifiedClass('Group');
		    this.rdSetPanelModifiedClass('Aggr');
		    this.rdSetPanelModifiedClass('Paging');

		    if (sTabName == "Group") {
		        this.rdAgGetGroupByDateOperatorDiv();
		    }
		},

		rdAgLayoutSelect: function (sAllNone) {
		    var nlCheckboxes = Y.all('.rdAgColVisible')
		    for (var i = 0; i < nlCheckboxes.size() ; i++) {
		        nlCheckboxes.item(i).set('checked', (sAllNone == "All"))
		    }
		},

		rdQbColumnSelect: function (sAllNone) {
		    var nlCheckboxes = Y.all('.rdAgColSelect')
		    for (var i = 0; i < nlCheckboxes.size() ; i++) {
		        nlCheckboxes.item(i).set('checked', (sAllNone == "All"))
		    }
		},

		rdSetClassNameById: function (sId, sClassName) {
			var ele = document.getElementById(sId);
			if(ele) {
				ele.className = sClassName;
			}
		},
		rdSetDisplayById : function(sId, sDisplay) {
			var ele = document.getElementById(sId);
			if(ele) {
				ele.style.display = sDisplay;
			}
		},
		rdSetPanelModifiedClass: function (sPanel) {
		    var nodeButton = Y.one("#col" + sPanel);
		    if (Y.Lang.isValue(nodeButton) && nodeButton.one('table').hasClass('rdHighlightOn'))
		        nodeButton.addClass(nodeButton.get('className') + "On");
		},
		rdSetPanelDisabledClass: function (sPanel) {
		    var nodeButton = Y.one("#col" + sPanel);
		    if (nodeButton != null) {
		        nodeButton.addClass("rdAgDisabledTab");
		    }
		},
		rdAgShowPickDistinctButton: function () {
			// Function gets called on the onchange event of the Filter column dropdown.           
			this.rdAgRemoveAllWhiteSpaceNodesFromFilterOperatorDropdown();        // Do this to clear the FilterOparator dropdown off all whitespace/text nodes.
			ShowElement(this.id,'divPickDistinct','Show');
			var i = 0;
			if (document.rdForm.rdAgFilterColumn.value!=""){
				 //Dates
				if((document.rdForm.rdAgPickDateColumns.value.indexOf(document.rdForm.rdAgFilterColumn.value + ",")!=-1) | (document.rdForm.rdAgPickDateColumns.value.indexOf(document.rdForm.rdAgFilterColumn.value +"-NoCalendar" + ",")!=-1 )){
					// Manipulate the DataColumn Dropdown.       
					if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Date Range'){    // condition specific for a fresh dropdown.
						for(i=1;i<=1;i++){
							rdFilterNewComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);    // remove the new Comparison option 'Date Range'.
							document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
						}  
						if (document.rdForm.rdAgFilterOperator.lastChild.value == 'Not Contains') {    //remove 'Not Contains' and 4 options before that.
							for (i=0;i<=5;i++){
								rdFilterOldComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);
								document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
							}
						}
						 for(i=1;i<=1;i++){ // Add the new Comparison option 'Date Range' back.
							document.rdForm.rdAgFilterOperator.appendChild(rdFilterNewComparisonOptionsArray.pop());
						}  
					}
					else{   // condition specific for an already manipulated dropdown.
					    if (document.rdForm.rdAgFilterOperator.lastChild.value == 'Not Contains') {    //remove 'Not Contains' and 4 options before that.
							for (i=0;i<=5;i++){
								rdFilterOldComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);
								document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
							}
						}
						for(i=1;i<=1;i++){ // Add the new Comparison option 'Date Range' back.
							document.rdForm.rdAgFilterOperator.appendChild(rdFilterNewComparisonOptionsArray.pop());
						}
					}
					this.rdAgManipulateFilterInputTextBoxValuesForDateColumns(document.rdForm.rdAgFilterColumn.value, document.rdForm.rdAgFilterOperator.value, document.rdForm.rdAgCurrentFilterValue.value, document.rdForm.rdAgCurrentDateType.value);
					return;
				}
				// Distinct values popup.
				else if(document.rdForm.rdAgPickDistinctColumns.value.indexOf(document.rdForm.rdAgFilterColumn.value + ",")!=-1){
					if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Date Range'){
						for(i=1;i<=1;i++){
							rdFilterNewComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);    // remove the new Comparison option.
							document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
						}  
						if(document.rdForm.rdAgFilterOperator.lastChild.value != 'Not Contains'){    // condition specific for an already manipulated dropdown.
						    for (i = 0; i <= 5; i++) {
						        document.rdForm.rdAgFilterOperator.appendChild(rdFilterOldComparisonOptionsArray.pop());
							}
						}
					}
					var elePopupIFrame = document.getElementById('subPickDistinct')
					var sSrc = Y.one(elePopupIFrame).getData("hiddensource");

					//Put the picked column name into the URL.
					var nStart = sSrc.indexOf("&rdAgDataColumn=")
					var nEnd = sSrc.indexOf("&", nStart + 1)
					sSrc = sSrc.substr(0, nStart) + "&rdAgDataColumn=" + encodeURIComponent(document.rdForm.rdAgFilterColumn.value) + sSrc.substr(nEnd)
					var nStart = sSrc.indexOf("&rdAgFilterOperator=")
					var nEnd = sSrc.indexOf("&", nStart + 1)
					sSrc = sSrc.substr(0, nStart) + "&rdAgFilterOperator=" + encodeURIComponent(document.rdForm.rdAgFilterOperator.value) + sSrc.substr(nEnd)

                    //Get format of column for subreport and put it into the URL
					var columnFormat = "";
					var columnFormats = document.getElementById("rdAgColumnFormats").value;
					columnFormats = columnFormats.split("|");
					for (var i = 0; i < columnFormats.length - 1; i++) {
					    var colId = columnFormats[i].split(":")[0];
					    if (colId == document.rdForm.rdAgFilterColumn.value) {
					        columnFormat = columnFormats[i].split(":")[1];
					        break;
					    }
					}
					var nStart = sSrc.indexOf("&rdAgColumnFormat=")
					var nEnd = sSrc.indexOf("&", nStart + 1)
					sSrc = sSrc.substr(0, nStart) + "&rdAgColumnFormat=" + encodeURIComponent(columnFormat) + sSrc.substr(nEnd)

				    //Get data type of column for subreport and put it into the URL
					var columnDataType = "";
					var columnDataTypes = document.getElementById("rdAgColumnDataTypes").value;
					columnDataTypes = columnDataTypes.split("|");
					for (var i = 0; i < columnDataTypes.length - 1; i++) {
					    var colId = columnDataTypes[i].split(":")[0];
					    if (colId == document.rdForm.rdAgFilterColumn.value) {
					        columnDataType = columnDataTypes[i].split(":")[1];
					        break;
					    }
					}
					var nStart = sSrc.indexOf("&rdAgColumnDataType=")
					var nEnd = sSrc.indexOf("&", nStart + 1)
					sSrc = sSrc.substr(0, nStart) + "&rdAgColumnDataType=" + encodeURIComponent(columnDataType) + sSrc.substr(nEnd)

					Y.one(elePopupIFrame).setData("hiddensource", sSrc);
					//elePopupIFrame.setAttribute("HiddenSource", elePopupIFrame.getAttribute("HiddenSource").replace("rdPickDataColumn",encodeURI(document.rdForm.rdAgFilterColumn.value)))
					this.rdAgHideAllFilterDivs();
					ShowElement(this.id,'divPickDistinct','Show')
					ShowElement(this.id,'divPickDistinctPopUpButton','Show')
					elePopupIFrame.removeAttribute("src") //Clear the list so it's rebuilt when the user clicks.
					//15311
					//rdAgManipulateFilterInputTextBoxValuesForDateColumns(document.rdForm.rdAgFilterColumn.value, document.rdForm.rdAgFilterOperator.value, document.rdForm.rdAgCurrentFilterValue.value, document.rdForm.rdAgCurrentDateType.value);
					return;
				}
				else{                      
					this.rdAgHideAllFilterDivs();
					ShowElement(this.id,'divPickDistinct','Show')     
					if(document.rdForm.rdAgFilterOperator.lastChild.value != 'Not Contains'){
						if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Date Range'){
							for(i=1;i<=1;i++){
							rdFilterNewComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);    // remove the new Comparison option 'Date Range'.
							document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
							} 
						}
						if (rdFilterOldComparisonOptionsArray[0] && rdFilterOldComparisonOptionsArray[0] != '') {
							for(i=0;i<=5;i++){
								document.rdForm.rdAgFilterOperator.appendChild(rdFilterOldComparisonOptionsArray.pop());
							}
						}
					}            
				}
			}
			else{   // When no column is selected.
				this.rdAgHideAllFilterDivs();
				ShowElement(this.id,'divPickDistinct','Show')    
				document.rdForm.rdAgFilterOperator.value = "="; 
			}
		},		
		rdAgGetGroupByDateOperatorDiv : function(){
			// Function used by the Grouping division for hiding/unhiding the GroupByOperator Div.
			if((document.rdForm.rdAgPickDateColumnsForGrouping.value.indexOf(document.rdForm.rdAgGroupColumn.value + ",")!=-1) && (document.rdForm.rdAgGroupColumn.value.length != 0)){
				if(Y.Lang.isValue(Y.one('#divGroupByDateOperator')))
					ShowElement(this.id,'divGroupByDateOperator','Show');
			}
			else{
				if(Y.Lang.isValue(Y.one('#divGroupByDateOperator'))){
					ShowElement(this.id,'divGroupByDateOperator','Hide');
					document.rdForm.rdAgDateGroupBy.value='';
				}
			}
		},
	
		rdAgRemoveAllWhiteSpaceNodesFromFilterOperatorDropdown : function(){
			// Function removes all the unnecessary text/WhiteSpace nodes from the dropdown which cause issues with different browsers.
			var elerdAgFilterOperator = document.rdForm.rdAgFilterOperator;
			if(elerdAgFilterOperator){
				for(i=0; i<= elerdAgFilterOperator.childNodes.length; i++){
					if(elerdAgFilterOperator.childNodes[i]) 
						if(elerdAgFilterOperator.childNodes[i].nodeName == '#text')
							elerdAgFilterOperator.removeChild(elerdAgFilterOperator.childNodes[i]);
				}
			}
		},
		
		rdAgManipulateFilterInputTextBoxValuesForDateColumns : function(sFilterColumn, sFilterOperator, sFilterValue, sDateType, sSlidingDateName) {
			// Function runs to set the values of the filter into the input text boxes.
			document.rdForm.rdAgFilterColumn.value = sFilterColumn;
			if(sFilterOperator.indexOf('&lt;') > -1)  sFilterOperator = sFilterOperator.replace('&lt;','<');    //#17188.
			document.rdForm.rdAgFilterOperator.value = sFilterOperator;
			if(Y.Lang.isValue(Y.one('#rdAgCurrentFilterValue')))
				document.rdForm.rdAgCurrentFilterValue.value = sFilterValue;
			var sDateTypeOperator;
			var sSlidingDateValue;
			var sInputElementValue = sFilterValue.split('|')[0];
			if (sFilterValue) {
				document.rdForm.rdAgFilterStartDate.value = sInputElementValue;
				document.rdForm.rdAgFilterStartDateTextbox.value = sInputElementValue;
				document.rdForm.rdAgFilterValue.value = sInputElementValue; 
				document.rdForm.rdAgFilterEndDate.value = '';
				document.rdForm.rdAgFilterEndDateTextbox.value = '';
				if(sDateType){
					sDateTypeOperator = sDateType.split(',')[0];
					if(sDateTypeOperator)
						document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value = sDateTypeOperator;
				}
				else{
					document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value = "Specific Date";
				}
				if(sSlidingDateName){
					sSlidingDateValue = sSlidingDateName.split(',')[0];
					if(sSlidingDateValue)
						document.rdForm.rdAgSlidingTimeStartDateFilterOpearatorOptions.value = sSlidingDateValue;
				}  
				if(sFilterValue.split('|')[1]){
					sInputElementValue = sFilterValue.split('|')[1];
					document.rdForm.rdAgFilterEndDate.value = sInputElementValue;
					document.rdForm.rdAgFilterEndDateTextbox.value = sInputElementValue;
					if(sDateType){
						sDateTypeOperator = sDateType.split(',')[1];
						if(sDateTypeOperator)
							document.rdForm.rdAgSlidingTimeEndDateFilterOpearator.value = sDateTypeOperator;
					}
					else{
						document.rdForm.rdAgSlidingTimeEndDateFilterOpearator.value = "Specific Date";
					} 
					if(sSlidingDateName){
						sSlidingDateValue = sSlidingDateName.split(',')[1];
						if(sSlidingDateValue)
							document.rdForm.rdAgSlidingTimeEndDateFilterOpearatorOptions.value = sSlidingDateValue;
					} 
				}
			}
			this.rdAgShowProperElementDiv(sFilterColumn, sFilterOperator);    // Run through this function to show hide the divs
		},
		
		rdAgShowProperElementDiv : function(sFilterColumn, sFilterOperator){
			// Function runs on clicking the filter link with the filter info to show the proper panel/Div.
			if(sFilterColumn){    
				if(document.rdForm.rdAgPickDateColumns.value.indexOf(sFilterColumn + ",")!=-1){
					if(sFilterOperator == 'Date Range'){
						this.rdAgHideAllFilterDivs();
						ShowElement(this.id,'divSlidingTimeStartDateFilterOpearator','Show')
						ShowElement(this.id,'divSlidingTimeEndDateFilterOpearator','Show')
						if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Specific Date'){ 
							ShowElement(this.id,'divFilterStartDateCalendar','Show')
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Hide')
						}
						if(document.rdForm.rdAgSlidingTimeEndDateFilterOpearator.value == 'Specific Date'){
							ShowElement(this.id,'divFilterEndDateCalendar','Show')
							ShowElement(this.id,'divSlidingTimeEndDateFilterOpearatorValues','Hide')
						}                        
						if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Sliding Date'){
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Show')
							ShowElement(this.id,'divFilterStartDateCalendar','Hide')
						}
						if(document.rdForm.rdAgSlidingTimeEndDateFilterOpearator.value == 'Sliding Date'){
							ShowElement(this.id,'divSlidingTimeEndDateFilterOpearatorValues','Show')
							ShowElement(this.id,'divFilterEndDateCalendar','Hide')
						}                   
					}
					else{
						this.rdAgHideAllFilterDivs();
						ShowElement(this.id,'divSlidingTimeStartDateFilterOpearator','Show')
						if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Specific Date'){
							ShowElement(this.id,'divFilterStartDateCalendar','Show')
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Hide')
						}
						else{               
							ShowElement(this.id,'divFilterStartDateCalendar','Hide')     
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Show')
						}
					}   
				}
				else if(document.rdForm.rdAgPickDateColumns.value.indexOf(sFilterColumn +"-NoCalendar" + ",")!=-1){
				   if(sFilterOperator == 'Date Range'){
						this.rdAgHideAllFilterDivs();
						ShowElement(this.id,'divSlidingTimeStartDateFilterOpearator','Show')
						ShowElement(this.id,'divSlidingTimeEndDateFilterOpearator','Show')
						if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Specific Date'){ 
							ShowElement(this.id,'divFilterStartDateTextbox','Show')
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Hide')
						}
						if(document.rdForm.rdAgSlidingTimeEndDateFilterOpearator.value == 'Specific Date'){
							ShowElement(this.id,'divFilterEndDateTextbox','Show')
							ShowElement(this.id,'divSlidingTimeEndDateFilterOpearatorValues','Hide')
						}
						if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Sliding Date'){
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Show')
							ShowElement(this.id,'divFilterStartDateTextbox','Hide')
						}
						if(document.rdForm.rdAgSlidingTimeEndDateFilterOpearator.value == 'Sliding Date'){
							ShowElement(this.id,'divSlidingTimeEndDateFilterOpearatorValues','Show')
							ShowElement(this.id,'divFilterEndDateTextbox','Hide')
						}    
					}
					else{
						this.rdAgHideAllFilterDivs();
						 ShowElement(this.id,'divSlidingTimeStartDateFilterOpearator','Show')
						 if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Specific Date'){ 
							ShowElement(this.id,'divFilterStartDateTextbox','Show')
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Hide')
						}
						if(document.rdForm.rdAgSlidingTimeStartDateFilterOpearator.value == 'Sliding Date'){
							ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Show')
							ShowElement(this.id,'divFilterStartDateTextbox','Hide')
						}
					}
				}
				else{  // When filter column is not a Date column.
					if(document.rdForm.rdAgPickDistinctColumns.value.indexOf(document.rdForm.rdAgFilterColumn.value + ",")!=-1){
						this.rdAgHideAllFilterDivs();
						ShowElement(this.id,'divPickDistinct','Show')
						ShowElement(this.id,'divPickDistinctPopUpButton','Show')}
					else{
						this.rdAgHideAllFilterDivs();
						ShowElement(this.id,'divPickDistinct','Show')
					}
				}
			}
		},
		
		rdAgHideAllFilterDivs : function(){
			// Function hides all the Divs mentioned below used to seperate elements that are used in specific conditions under the Filters section.
				ShowElement(this.id,'divPickDistinct','Hide');                               // Div holds a common TextBox.

				ShowElement(this.id,'divPickDistinctPopUpButton','Hide');                    // Div holds the popup button that pulls up the list of ID's, like CustomerID, OrderID etc. This above div is always hidden for Date Time Columns.   
																																																											   
				ShowElement(this.id,'divSlidingTimeStartDateFilterOpearator','Hide');        // Div holds a dropdown with the sliding time filter operatior values like Sliding Date etc.
																  
				ShowElement(this.id,'divSlidingTimeEndDateFilterOpearator','Hide');          // Div holds a dropdown with the sliding time filter operatior values.
																  
				ShowElement(this.id,'divSlidingTimeStartDateFilterOpearatorValues','Hide');  // Div holds a dropdown with the sliding time filter operatior option values like Today, Yesterday etc.
																
				ShowElement(this.id,'divSlidingTimeEndDateFilterOpearatorValues','Hide');    // Div holds a dropdown with the sliding time filter operatior option values like Today, Yesterday etc.
				
				ShowElement(this.id,'divFilterStartDateCalendar','Hide');        // Div holds a calendar control for start date.
				
				ShowElement(this.id,'divFilterEndDateCalendar','Hide');           // Div holds a calendar control for start date.
				
				ShowElement(this.id,'divFilterStartDateTextbox','Hide');          // Div holds a textbox for start date.
				
				ShowElement(this.id,'divFilterEndDateTextbox','Hide');            // Div holds a textbox for end date.
		},
		
		/* -----Action.Javascript Methods----- */
		
		rdAgManipulateFilterOptionsDropdownForDateColumns : function(sFilterColumn, sFilterOperator, sFilterValue){
			// Function gets called when the filter link (with the filter info displayed above the data table) displayed is clicked to set the drop down values.  
			this.rdAgRemoveAllWhiteSpaceNodesFromFilterOperatorDropdown();      
			document.rdForm.rdAgFilterColumn.value = sFilterColumn;
			var i = 0;
			if(document.rdForm.rdAgFilterColumn.value){
				if((document.rdForm.rdAgPickDateColumns.value.indexOf(document.rdForm.rdAgFilterColumn.value + ",")!=-1)|(document.rdForm.rdAgPickDateColumns.value.indexOf(document.rdForm.rdAgFilterColumn.value +"-NoCalendar" + ",")!=-1)){
					if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Date Range'){
						for(i=1;i<=1;i++){
							rdFilterNewComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);    // remove the new Comparison option 'Date Range'.
							document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
						}  
						if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Contains'){    //remove the options 'Starts With' and 'Contains'.
							for (i=0;i<=1;i++){
								rdFilterOldComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);
								document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
							}
						}
						for(i=1;i<=1;i++){ // Add the new Comparison option 'Date Range' back.
							document.rdForm.rdAgFilterOperator.appendChild(rdFilterNewComparisonOptionsArray.pop());
						}  
					}
					else{
					   if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Contains'){    //remove the options 'Starts With' and 'Contains'.
							for (i=0;i<=1;i++){
								rdFilterOldComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);
								document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
							}
						}
						for(i=1;i<=1;i++){ // Add the new Comparison option 'Date Range' back.
							document.rdForm.rdAgFilterOperator.appendChild(rdFilterNewComparisonOptionsArray.pop());
						}  
					}
					document.rdForm.rdAgFilterColumn.value = "Date Range"           
				}
			   else if(document.rdForm.rdAgFilterOperator.lastChild.value != 'Contains'){   // Code path executed for putting the original options back.
					if(document.rdForm.rdAgFilterOperator.lastChild.value == 'Date Range'){
						for(i=1;i<=1;i++){
							rdFilterNewComparisonOptionsArray.push(document.rdForm.rdAgFilterOperator.lastChild);    // remove the new Comparison option.
							document.rdForm.rdAgFilterOperator.removeChild(document.rdForm.rdAgFilterOperator.lastChild); 
						}  
						if(document.rdForm.rdAgFilterOperator.lastChild.value != 'Contains'){    //Add the original options back.
						    for (i = 0; i <= 1; i++) {
						        if (rdFilterOldComparisonOptionsArray.length > 0) {
						            document.rdForm.rdAgFilterOperator.appendChild(rdFilterOldComparisonOptionsArray.pop());
                                    //22860 - Existance check to prevent trying to pop an empty array
						        }
							}
						}
					}  
				}
			}   
		},
		
		rdAgSetPickedFilterValueByRow: function (nPickListRowNr) {
		    var fraPopup = document.getElementById("subPickDistinct");
		    var eleValue = fraPopup.contentWindow.document.getElementById("lblFilter_Row" + nPickListRowNr);
		    var sValue;
		    if (eleValue.textContent) {
		        sValue = eleValue.textContent; //Mozilla
		    } else {
		        sValue = eleValue.innerText;  //IE
		    }
		    document.rdForm.rdAgFilterValue.value = sValue;
		},

		rdAgSetPickedFilterValues: function (sValues) {
		    var fraPopup = document.getElementById("subPickDistinct");
		    document.rdForm.rdAgFilterValue.value = sValues;
		},

		rdAgPickProperElementDiv: function () {
			// Function used to regulate the hiding/unhiding of the Divs containing the InputDate elements, called on the onchange event of the filter operator(values like <, <= etc) dropdown.
			if(document.rdForm.rdAgFilterColumn.value){
				this.rdAgShowProperElementDiv(document.rdForm.rdAgFilterColumn.value, document.rdForm.rdAgFilterOperator.value);
			} 
		},

		/* -----Draggable Panels----- */
		rdInitDraggableAgPanels : function(){
			var bDraggableAgPanels = false;
			var eleDraggableAgPanels = document.getElementById('rdAgDraggablePanels');
			if (eleDraggableAgPanels!= null) bDraggableAgPanels = true;  
		  			
			var aDraggableAgPanels = this.rdGetDraggableAgPanels();
		    //Destroy the registered drag/drop nodes if any.
			for (i = 0; i < aDraggableAgPanels.length; i++) {
			    Y.DD.DDM.getNode(aDraggableAgPanels[i]).destroy();
			}
			if (aDraggableAgPanels.length > 1) {
			    for (var i = 0; i < aDraggableAgPanels.length; i++) {
			        var eleAgPanel = aDraggableAgPanels[i];
			        if (bDraggableAgPanels) {

			            var pnlNode = Y.one('#' + eleAgPanel.id);
			            var pnlDD = new Y.DD.Drag({
			                node: pnlNode
			            });
			            var pnlDrop = pnlNode.plug(Y.Plugin.Drop);

			            var pnlDragged = null;
			            var originalPanelPosition = [0, 0];
			            var bDoNothingMore = false;

			            pnlDD.on('drag:start', this.Panel_onDragStart, this);
			            pnlDD.on('drag:drag', this.Panel_onDrag, this);
			            pnlDD.on('drag:over', this.Panel_onDragOver, this);
			            pnlDD.on('drag:drophit', this.Panel_onDropHit, this);
			            pnlDD.on('drag:end', this.Panel_onDragEnd, this);

			            var elePanelHeaderId = (Y.Selector.query('table.rdAgContentHeadingRow', eleAgPanel).length == 0 ?
                                                Y.Selector.query('td.rdAgContentHeading', eleAgPanel)[0].id :
                                                Y.Selector.query('table.rdAgContentHeadingRow', eleAgPanel)[0].id);

			            var pnlTitleNode = Y.one('#' + elePanelHeaderId);
			            pnlDD.addHandle('#' + elePanelHeaderId).plug(Y.Plugin.DDWinScroll, { horizontal: false, vertical: true, scrollDelay: 100, windowScroll: true });
			            pnlTitleNode.setStyle('cursor', 'move');
			        }
			    }
			}
		},
			
		/* -----Events----- */
		
		Panel_onDragStart : function(e) {
			pnlDragged = e.target.get('dragNode').getDOMNode();
			this.rdSetDraggableAgPanelsZIndex(pnlDragged, e.target.panels);
			Y.DOM.setStyle(pnlDragged, "opacity", '.65');
			originalPanelPosition = Y.DOM.getXY(pnlDragged);
			bDoNothingMore = false;
			this.set('targetPanel', null);
		},
		
		Panel_onDragOver : function(e) {
			this.set('targetPanel', e.drop.get('node').getDOMNode());
			
			var eleTargetPanel = this.get('targetPanel');
			pnlDragged = e.target.get('dragNode').getDOMNode();
			
			if(eleTargetPanel.id.match('rdDivAgPanelWrap_')) {
					var regionDraggedPanel = Y.DOM.region(pnlDragged);
					var regionTargetPanel = Y.DOM.region(eleTargetPanel);
					var nTargetPanelHeight = regionTargetPanel.height; 
					eleTargetPanelHandle = eleTargetPanel.nextSibling;
					if(originalPanelPosition[1] < regionDraggedPanel.top){
						if(regionDraggedPanel.top > (regionTargetPanel.top + Math.round(nTargetPanelHeight/2))){
							 eleTargetPanel.nextSibling.firstChild.firstChild.firstChild.className = 'rdAgDropZoneActive';
						}else{
							 eleTargetPanel.previousSibling.firstChild.firstChild.firstChild.className = 'rdAgDropZoneActive';
						}
					}else{
						 if(regionDraggedPanel.top < (regionTargetPanel.top + Math.round(nTargetPanelHeight/2))){
							eleTargetPanel.previousSibling.firstChild.firstChild.firstChild.className = 'rdAgDropZoneActive';                             
						}else{
							eleTargetPanel.nextSibling.firstChild.firstChild.firstChild.className = 'rdAgDropZoneActive';  
						}
					}
				} 
		},
		
		Panel_onDrag : function(e) {
			this.rdNeutralizeDropZoneColor();   
			
			var eleTargetPanel = this.get('targetPanel');
			
			if(!Y.Lang.isValue(eleTargetPanel)){							
				pnlDragged.previousSibling.firstChild.firstChild.firstChild.className = 'rdAgDropZoneActive';
			}
		},
		
		Panel_onDropHit : function(e) {
			this.rdMoveAgPanels(pnlDragged, this.get('targetPanel'), originalPanelPosition, bDoNothingMore);		    
			pnlDragged.style.cssText = '';
			Y.DOM.setStyle(pnlDragged, "opacity", '1');
			bDoNothingMore = true;
		},
		
		Panel_onDragEnd : function(e) {
			var context = this;
			this.rdMoveAgPanels(pnlDragged, this.get('targetPanel'), originalPanelPosition, bDoNothingMore);
			pnlDragged.style.cssText = '';
			Y.DOM.setStyle(pnlDragged, "opacity", '1');
			if(LogiXML.features['touch']) 
				setTimeout(function(){context.rdResetAGPanelAfterDDScroll(pnlDragged)}, 1000);  // Do this for the Tablet only, #15364.
		},
		
		/* -----Draggable Panel Methods----- */
		
		rdMoveAgPanels : function(eleDraggedPanel, eleTargetPanel, originalPanelPosition, bDoNothing) {
			
			if(!bDoNothing){
			
				var regionDraggedPanel = Y.DOM.region(eleDraggedPanel);						
				var eleDraggedPanelHandle = eleDraggedPanel.nextSibling;
					
				if(eleTargetPanel){						
					
					var regionTargetPanel = Y.DOM.region(eleTargetPanel);	
					var nTargetPanelHeight = regionTargetPanel.height;
					var eleTargetPanelHandle = eleTargetPanel.nextSibling;							
					
					if(eleTargetPanel.id.match('rdDivAgPanelWrap_')) {
						
						if(originalPanelPosition[1] < regionDraggedPanel.top){
							if(regionDraggedPanel.top > (regionTargetPanel.top + Math.round(nTargetPanelHeight/2))){
								 if(eleTargetPanelHandle.nextSibling){
									eleTargetPanel.parentNode.insertBefore(eleDraggedPanel, eleTargetPanelHandle.nextSibling);
									eleTargetPanel.parentNode.insertBefore(eleDraggedPanelHandle, eleTargetPanelHandle.nextSibling.nextSibling);                                
								}else{
									 eleTargetPanel.parentNode.appendChild(eleDraggedPanel);
									 eleTargetPanel.parentNode.appendChild(eleDraggedPanelHandle);
								}
							}else{
								eleTargetPanel.parentNode.insertBefore(eleDraggedPanel, eleTargetPanel);
								eleTargetPanel.parentNode.insertBefore(eleDraggedPanelHandle, eleTargetPanel);
							}
							this.rdSaveDraggableAgPanelPositions();
						}else{
							 if(regionDraggedPanel.top < (regionTargetPanel.top + Math.round(nTargetPanelHeight/2))){
								eleTargetPanel.parentNode.insertBefore(eleDraggedPanel, eleTargetPanel);
								eleTargetPanel.parentNode.insertBefore(eleDraggedPanelHandle, eleTargetPanel);                          
							}else{
								if(eleTargetPanelHandle.nextSibling){
									eleTargetPanel.parentNode.insertBefore(eleDraggedPanel, eleTargetPanelHandle.nextSibling);
									eleTargetPanel.parentNode.insertBefore(eleDraggedPanelHandle, eleTargetPanelHandle.nextSibling.nextSibling);
								}else{
									eleTargetPanel.parentNode.appendChild(eleDraggedPanel);
									eleTargetPanel.parentNode.appendChild(eleDraggedPanelHandle);
								}
							} 
							this.rdSaveDraggableAgPanelPositions();
						}
					}
				}
				else{
					var aDraggableAgPanels = this.rdGetDraggableAgPanels();
					var regionDraggedPanel = Y.DOM.region(eleDraggedPanel);
					if(originalPanelPosition[1] < regionDraggedPanel.top){
						if(eleDraggedPanel.id != aDraggableAgPanels[aDraggableAgPanels.length-1].id){
							if(regionDraggedPanel.top > Y.DOM.region(aDraggableAgPanels[aDraggableAgPanels.length-1]).bottom){
								aDraggableAgPanels[0].parentNode.appendChild(eleDraggedPanel);
								aDraggableAgPanels[0].parentNode.appendChild(eleDraggedPanelHandle);
								this.rdSaveDraggableAgPanelPositions();
							}
						}
					}else{
						if(eleDraggedPanel.id != aDraggableAgPanels[0].id){
							if(regionDraggedPanel.top < Y.DOM.region(aDraggableAgPanels[0]).top){
								aDraggableAgPanels[0].parentNode.insertBefore(eleDraggedPanel, aDraggableAgPanels[0]);
								aDraggableAgPanels[0].parentNode.insertBefore(eleDraggedPanelHandle, aDraggableAgPanels[0]);
								this.rdSaveDraggableAgPanelPositions();
							}
						}
					}
				}
				this.rdNeutralizeDropZoneColor();
				eleDraggedPanel.style.top = '0px';   
				eleDraggedPanel.style.left = '0px';
			}
			
		},
		
		rdSaveDraggableAgPanelPositions : function(){
			var rdPanelParams = "&rdReport=" + document.getElementById("rdAgReportId").value;
			rdPanelParams += "&rdAgPanelOrder="; 
			var aDraggableAgPanels = this.rdGetDraggableAgPanels();
			for (var i=0; i < aDraggableAgPanels.length; i++){
			    var eleAgPnl = aDraggableAgPanels[i];
			    if(rdPanelParams.indexOf(eleAgPnl.id.replace('rdDivAgPanelWrap_', '') + ',') < 0)
				    rdPanelParams += eleAgPnl.id.replace('rdDivAgPanelWrap_', '') + ',';
			}
			rdPanelParams += "&rdAgId=" + document.getElementById('rdAgId').value;

			window.status = "Saving dashboard panel positions.";
			rdAjaxRequestWithFormVars('rdAjaxCommand=rdAjaxNotify&rdNotifyCommand=UpdateAgPanelOrder' + rdPanelParams);
		},

		rdGetDraggableAgPanels : function(){
				var aDraggableAgPanels = new Array();
				var eleDivAgPanels = document.getElementById('rdDivAgPanels');
				if(eleDivAgPanels == null) return aDraggableAgPanels; //#16596.
				var aDraggableAgDivs = eleDivAgPanels.getElementsByTagName("div")
				for(i=0;i<aDraggableAgDivs.length;i++){
					var eleDraggableAgDiv = aDraggableAgDivs[i];
					if (eleDraggableAgDiv.id && eleDraggableAgDiv.id.indexOf('rowMenu') < 0 && eleDraggableAgDiv.id.indexOf('rowTitle') < 0) {
						if((eleDraggableAgDiv.id.indexOf('rdDivAgPanelWrap_row') > -1)) {
						    if(Y.Lang.isValue(eleDraggableAgDiv.firstChild.firstChild)){
						        if(eleDraggableAgDiv.firstChild.firstChild.firstChild.style.display != 'none'){
						            aDraggableAgPanels.push(eleDraggableAgDiv);
						        }
						    }else{
                                //Defensive way of avoiding the empty panel issues.
						        var eleEmptyPanel = Y.one(eleDraggableAgDiv).getDOMNode();
						        var eleEmptyPanelDropZone = eleEmptyPanel.previousSibling;
						        eleEmptyPanel.parentNode.removeChild(eleEmptyPanel);
						        eleEmptyPanelDropZone.parentNode.removeChild(eleEmptyPanelDropZone);
						        eleDraggableAgDiv = Y.one('#' + eleDraggableAgDiv.id).getDOMNode();
						        aDraggableAgPanels.push(eleDraggableAgDiv);
						    }
						}
					}
				}
				return aDraggableAgPanels;
		},
		
		rdSetDraggableAgPanelsZIndex : function(eleAgPanel, aDraggableAgPanels){
			
			aDraggableAgPanels = this.rdGetDraggableAgPanels()
			for (var i=0; i < aDraggableAgPanels.length; i++){
				var eleAgPnl = aDraggableAgPanels[i];
				if(eleAgPnl.id == eleAgPanel.id){
					 Y.DOM.setStyle(eleAgPnl, "zIndex", 1000);
				}else{
					Y.DOM.setStyle(eleAgPnl, "zIndex", 0);
				}           
			}    
		},
					
		rdResetAGPanelAfterDDScroll : function(elePnlDragged){

			var pnlDragged = Y.one(elePnlDragged);
			pnlDragged.setStyles({
				left:0,
				top:0        
			});    
		},
		
		rdNeutralizeDropZoneColor : function(){

			var aDropZoneTDs = Y.Selector.query('td.rdAgDropZoneActive', Y.DOM.byId('rdDivAgPanels'));
			for (var i=0; i < aDropZoneTDs.length; i++){
				var eleDropZoneTD = aDropZoneTDs[i];
				eleDropZoneTD.className = 'rdAgDropZone';
			}
		}
		
	},{
		// Y.AnalysisGrid properties		
		/**
		 * The identity of the widget.
		 *
		 * @property AnalysisGrid.NAME
		 * @type String
		 * @default 'AnalysisGrid'
		 * @readOnly
		 * @protected
		 * @static
		 */
		NAME : 'analysisgrid',
		
		/**
		 * Static property used to define the default attribute configuration of
		 * the Widget.
		 *
		 * @property AnalysisGrid.ATTRS
		 * @type {Object}
		 * @protected
		 * @static
		 */
		ATTRS : {
		
			targetPanel : {
				value: null
			}
		
			/*rdFilterOldComparisonOptionsArray: {
				value: new Array()
			},
			rdFilterNewComparisonOptionsArray: {
				value: new Array()
			}*/			
		}
	});

}, '1.0.0', {requires: ['dd-drop-plugin', 'dd-plugin', 'dd-scroll', 'dd-constrain']});



var sColorPicker = '1';

function GetColorPicker(sColorPickerValue, obj){
    sColorPicker = sColorPickerValue;    
}

function PickGaugeGoalColor(colColor){
    var sColor = Y.Color.toHex(Y.one('#' + colColor.id).getComputedStyle('backgroundColor'));
    var eleColorHolder = document.getElementById('rdAgGaugeGoalsColor' + sColorPicker);
    eleColorHolder.value = sColor;
    var elePickedColorIndicator = document.getElementById('rectColor' + sColorPicker);
    elePickedColorIndicator.style.backgroundColor = sColor;
    ShowElement(this.id,'ppColors','Hide');
}

/* --- Helper functions to change drop down lists for AG aggregate as well as y-axis columns.--- */
function rdchangeList(rdEleId, aNewAggrList, aLabel, sDataColumnType, aAggrGroupLabel, aAggrGroupLabelClass) {
    var rdAggrList = document.getElementById(rdEleId);
    var sSelectedValue = rdAggrList.options[rdAggrList.selectedIndex].text;
    rdemptyList(rdEleId);    
    rdfillList(rdEleId, aNewAggrList, aLabel, sDataColumnType, sSelectedValue, aAggrGroupLabel, aAggrGroupLabelClass);
}

function rdemptyList(rdEleId) {
    var rdAggrList = document.getElementById(rdEleId);
    while (rdAggrList.options.length) rdAggrList.options[0] = null;

    //Remove the option groups if they are present (they get rebuilt later)
    for (var i = 0; i < rdAggrList.childNodes.length; i++) {
        if (rdAggrList.childNodes[i].nodeName == "optgroup" || rdAggrList.childNodes[i].nodeName == "OPTGROUP") {
            rdAggrList.childNodes[i].parentNode.removeChild(rdAggrList.childNodes[i]);
            i = i - 1;
        }
    }
}

function rdfillList(rdEleId, arr, aLabel, sDataColumnType, sSelectedValue, arrGroupLabel, arrGroupLabelClass) {
    var rdAggrList = document.getElementById(rdEleId);    
    if ( sDataColumnType && sDataColumnType != '' ) {
        if (sDataColumnType.toLowerCase() == "text" || sDataColumnType.toLowerCase() == "date" || sDataColumnType.toLowerCase() == "datetime") {
            arr = ["COUNT", "DISTINCTCOUNT"];
            aLabel = ["Count", "Distinct Count"];
        }
        else {
            arr = ["SUM", "AVERAGE", "STDEV", "COUNT", "DISTINCTCOUNT", "MIN", "MAX"];
            aLabel = ["Sum", "Average", "Standard Deviation", "Count", "Distinct Count", "Minimum", "Maximum"];
        }
    }

    var arrList = arr;
    var arrLabel = aLabel;
    var group = null;
    for (i = 0; i < arrList.length; i++) {
        //Option Grouping
        if (arrGroupLabel[i] != "" && arrGroupLabel[i]) {
            //create new group (either first one or the group item name has changed)
            if (group == null || group.getAttribute("Label") != arrGroupLabel[i]) {
                var group = document.createElement("optgroup");
                group.setAttribute("Label", arrGroupLabel[i]);
                group.setAttribute("Class", arrGroupLabelClass[i]);
                rdAggrList.appendChild(group);
            }
            option = new Option(arrLabel[i], arrList[i]);
            if (option.innerHTML == "")
                option.innerHTML = arrLabel[i];
            group.appendChild(option);
        }
        //Non grouped
        else {
            option = new Option(arrLabel[i], arrList[i]);
            rdAggrList.options[rdAggrList.length] = option;
        }

        // set the selected value '21254
        if (arrLabel[i] == sSelectedValue) {
            rdAggrList.selectedIndex = i;
        }
    }
}

