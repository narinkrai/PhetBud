//var startReports = function() {
//	alert('Back button clicked!');
//	document.addEventListener("backbutton", backKeyDown, true);
//};

//function backKeyDown()
//{
//	alert('Back button clicked!');
//}

$("#reportsPage").find("#ShowReport").on("click", function(event, ui) {
	var dtpFrom = getObj("#FromDateBox");
	var dtpTo = getObj("#ToDateBox");
	var dtpPeriod = getObj("#PeriodDateBox");
	if (dtpFrom.val() != "" || dtpTo.val() != "" || dtpPeriod.val() != "") {
		var selectCat = getObj("#Categories");
		var togSwitch = getObj("#toggleswitch3");
		var selectRep = getObj("#Reports");
		if ((togSwitch.val() == "on" && selectCat.val() != "") || togSwitch.val() == "off") {
			// call reports
			var strParam;
			if (togSwitch.val() == "on") {
				strParam  = "?FrDate="+dtpFrom.val()+"&ToDate="+dtpTo.val()+"&Period="+dtpPeriod.val()+"&Cat="+selectCat.val();
			} else {
				strParam  = "?FrDate="+dtpFrom.val()+"&ToDate="+dtpTo.val()+"&Period="+dtpPeriod.val()+"&Cat=";
			}
			switch (selectRep.val()) {
			case "Report1":
				$.mobile.changePage( "report1.html"+strParam, { transition: "slideup"} );
				//window.open("Report1.html"+strParam);
				break;
			case "Report2":
				$.mobile.changePage( "report2.html"+strParam, { transition: "slideup"} );
				break;
			case "Report3":
				break;
			case "Report4":
				break;
			default:
				alert('Report not found');
			}
			
			//console.log("report id"+selectRep.val());
		} else {
			alert('กรุณาระบุหมวดหมู่ที่ต้องการ');
		}
			
			
	} else {
		alert('กรุณาเลือกช่วงวันที่ต้องการ');
	}
});

$("#reportsPage").find("#Clear").on("click", function(event, ui){
	clearDates();
});

$("div:jqmData(role='collapsible')").each(function(){
    bindEventTouch($(this)); 
}); 

function bindEventTouch(element) {
    element.bind('tap', function(event, ui) {
    	if(element.hasClass('ui-collapsible-collapsed')) {
    	    clearDates();
    	}
    	/*
       if(element.hasClass('ui-collapsible-collapsed')) {
            alert(element.attr('id')+' is closed');
        } else {
            alert(element.attr('id')+' is open');
        }
        */
    });
}

/*$("#reportsPage").find("#toggleswitch3").on( "slidestart", function( event ) { 
	var selectCat = getObj("#Categories");
	var togSwitch = getObj("#toggleswitch3");
	console.log("togSwitch="+togSwitch.val());
	if (togSwitch.val() == "on")
	{
		selectCat.selectmenu("enable");		
	}	else
	{
		selectCat.selectmenu("disable");
	}
});*/


 $("#reportsPage").find("#toggleswitch3").on( "slidestop", function( event ) {
		var selectCat = getObj("#Categories");
		var togSwitch = getObj("#toggleswitch3");
		console.log("togSwitch="+togSwitch.val());
		if (togSwitch.val() == "on")
		{
			selectCat.selectmenu("enable");		
		}	else
		{
			selectCat.selectmenu("disable");
		}
 });


function getObj(objname){
	return $("#reportsPage").find(objname);
}

function clearDates(){
    var dtpFrom = getObj("#FromDateBox");
    var dtpTo = getObj("#ToDateBox");
	var dtpPeriod = getObj("#PeriodDateBox");
	dtpFrom.val("");
	dtpTo.val("");
	dtpPeriod.val("");
}

function backToPrevPage() {
	history.back();
	return false;
}

function querySetReportForm(tx) {
	var sqlCat = 'SELECT catt.CategoryTypeName, cat.CategoryId, cat.CategoryName, cat.CategoryIconName ' +
	  'FROM CategoryTypes catt, Categories cat ' + 
	  'WHERE catt.CategoryTypeId = cat.CategoryTypeId ' + 
	  'ORDER BY cat.CategoryId '
    tx.executeSql(sqlCat, [], queryCategorySuccess, errorSetReportForm);
	
}

function queryCategorySuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);
	
	var oldCategoryId = 0;
	var selectHtml = '';
	
	var selectCat = getObj("#Categories");
	selectCat.empty();
		
	for ( var i = 0; i < results.rows.length; i++) {
      selectHtml += '<option value="' + results.rows.item(i).CategoryId + '">' + results.rows.item(i).CategoryName + '</option>\n';		
	}

	selectCat.append(selectHtml);
	
	//console.log("selectHtml="+selectHtml);
	
}

function errorSetReportForm(err) {
	console.log("Error processing SQL program database : " + err);
	phetbudPageHideLoading();
	alert('Failed to initial report page');
	history.back();
}
/*
function clearReportForm() {
	var toggleswitch = getObj("toggleswitch3");
	var selectCat = getObj("#Categories");
	var PeriodDateBox = getObj("#PeriodDateBox");
	selectCat.empty();
	selectCat.val('');
	if (toggleswitch.val() == 'on') {
		selectCat.show();
	} else {
		selectCat.hide();	
	}
	PeriodDateBox.val('');
}*/

$('#reportsPage').live(
		'pagebeforeshow',
		function(event, ui) {
			//console.log("live pagebeforeshow");
			//clearReportForm();
			var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
			db.transaction(querySetReportForm, errorSetReportForm);
			var selectCat = getObj("#Categories");
			var togSwitch = getObj("#toggleswitch3");
			selectCat.selectmenu("refresh");
			selectCat.selectmenu("disable");
			togSwitch.val("off");

		});
