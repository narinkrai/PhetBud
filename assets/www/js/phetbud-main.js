var searchMode = 'day';
var isBlock = false;

$("#mainPage").find("#prevDateButton").on("click", function(event, ui) {
	adjustPrevNextButton('prev');
});

$("#mainPage").find("#nextDateButton").on("click", function(event, ui) {
	adjustPrevNextButton('next');
});

$("#mainPage").find("#trDateBox").bind('datebox', function(e, p) {
	if ( p.method === 'set' ) {
		//e.stopImmediatePropagation();
		//console.log('in set trdatebox');
		GetTransactionDetail();
	}
});

//$("#mainPage").find("[data-role=header]").fixedtoolbar({tapToggle : false});
//$("#mainPage").find("[data-role=header]").fixedtoolbar({visibleOnPageShow : true});
//$("#mainPage").find("[data-role=footer]").fixedtoolbar({tapToggle : false});
//$("#mainPage").find("[data-role=footer]").fixedtoolbar({visibleOnPageShow : true});

function getTrDateBox() {
	return $("#mainPage").find("#trDateBox");
}

function getTrDateBoxSearchValue() {
	var trDateBox = getTrDateBox();
	
	if (searchMode == 'day')
	{
		return trDateBox.data('datebox').theDate.format("dd/MM/yyyy");
	} else if (searchMode == 'week') {
		var tempDate = new Date(trDateBox.data('datebox').theDate);
		var dayNoOfWeek = tempDate.getDay();
		//console.log('get date value : ' + dayNoOfWeek);
		var sunDay = new Date(trDateBox.data('datebox').theDate);
		sunDay = sunDay.add('d', dayNoOfWeek * -1);
		//console.log('get sunday value : ' + sunDay.format("dd/MM/yyyy"));
		var saturnDay = new Date(trDateBox.data('datebox').theDate);
		saturnDay = saturnDay.add('d', 6 - dayNoOfWeek);
		//console.log('get saturnday value : ' + saturnDay.format("dd/MM/yyyy"));
		
		return sunDay.format("dd/MM/yyyy") + ' - ' + saturnDay.format("dd/MM/yyyy");
		
	} else if (searchMode == 'month') {
		return trDateBox.data('datebox').theDate.format("MM/yyyy");
	} else if (searchMode == 'year') {
		return trDateBox.data('datebox').theDate.format("yyyy");
	}
	return '';
}

function adjustPrevNextButton(adjustMode)
{
	var trDateBox = getTrDateBox();
	var currentDateValue = new Date(trDateBox.data('datebox').theDate);
	var addModeSign = adjustMode == 'prev' ? -1 : 1;
	
	if (searchMode == 'year') {
		trDateBox.data('datebox').theDate = currentDateValue.add('y', addModeSign);
	} else if (searchMode == 'month') {
		trDateBox.data('datebox').theDate = currentDateValue.add('M', addModeSign);
	} else if (searchMode == 'week') {
		trDateBox.data('datebox').theDate = currentDateValue.add('d', 7 * addModeSign);
	} else if (searchMode == 'day') {
		trDateBox.data('datebox').theDate = currentDateValue.add('d', addModeSign);
	}
	
	trDateBox.val(trDateBox.data('datebox').theDate.format("yyyy-MM-dd"));
	trDateBox.datebox('refresh');
	
	GetTransactionDetail();
}

function onClickYear()
{
	searchMode = 'year';
	GetTransactionDetail();
}

function onClickMonth()
{
	searchMode = 'month';
	GetTransactionDetail();
}

function onClickWeek()
{
	searchMode = 'week';
	GetTransactionDetail();
}

function onClickDay()
{
	searchMode = 'day';
	GetTransactionDetail();
}

function getTransactionItemTemplate(TransactionId, CategoryIconName, accName,
		SubCategoryName, TransactionAmount, AccountTypeName) {
	return '<li data-icon="false">'
			+ '<a href="#" onclick="javascript:openTransactionPage(\'edit\', '
			//+ TransactionId + ')"> <img' + ' src="' + CategoryIconName + '" />'
			+ TransactionId + ')"> <img' + ' src="img/logo.png" />'
			+ '<h3>' + accName + '</h3>' + '<p>' + SubCategoryName + '</p>'
			+ '<p class="ui-li-aside" valign="center">' + TransactionAmount
			+ '<br>' + '<br>' + AccountTypeName + '</p>' + '</a>' + '</li>';
}

function getNewTransactionItemTemplate() {
	return '<li data-icon="false"><a href="#" onclick="javascript:openTransactionPage(\'add\', 0)"><p><h3 align="center">New</h3></p></a></li>';
}

function displayTransactions(transactions) {
	var transactionListview = $("#mainPage").find("#mainPageListview");

	// Empty current list
	transactionListview.empty();

	$("#transactionItemHtml").tmpl(transactions).appendTo(transactionListview);
	$("#newTransactionItemHtml").appendTo(transactionListview);

	// Call listview jQuery UI Widget after adding
	// items to the list for correct rendering
	transactionListview.listview("refresh");
}

function QueryTransactionAndDetail(tx) {
	var trDateBox = getTrDateBox();
	var sql = getSQLSelectTransactionDetails();
	
	if (searchMode == 'day')
	{
		sql = sql + ' AND ts.TransActiveDate = "' + trDateBox.data('datebox').theDate.format("yyyy-MM-dd")
				+ '" ';
	} else if (searchMode == 'week') {
		var tempDate = new Date(trDateBox.data('datebox').theDate);
		var dayNoOfWeek = tempDate.getDay();
		//console.log('get date value : ' + dayNoOfWeek);
		var sunDay = new Date(trDateBox.data('datebox').theDate);
		sunDay = sunDay.add('d', dayNoOfWeek * -1);
		//console.log('get sunday value : ' + sunDay.format("dd/MM/yyyy"));
		var saturnDay = new Date(trDateBox.data('datebox').theDate);
		saturnDay = saturnDay.add('d', 6 - dayNoOfWeek);
		//console.log('get saturnday value : ' + saturnDay.format("dd/MM/yyyy"));
		
		sql = sql + ' AND ts.TransActiveDate >= "' + sunDay.format("yyyy-MM-dd") 
					+ '" AND ts.TransActiveDate <= "' + saturnDay.format("yyyy-MM-dd") + '" ';
		
	} else if (searchMode == 'month') {
		sql = sql + ' AND ts.TransActiveDate LIKE "' + trDateBox.data('datebox').theDate.format("yyyy-MM")
				+ '%" ';
	} else if (searchMode == 'year') {
		sql = sql + ' AND ts.TransActiveDate LIKE "' + trDateBox.data('datebox').theDate.format("yyyy")
				+ '%" ';
	}
	
	console.log(sql);
	
	
	tx.executeSql(sql, [], queryTransactionAndDetailSuccess,
			errorQueryTransactionAndDetail);
}

function queryTransactionAndDetailSuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);

	var transactionListview = $("#mainPage").find("#mainPageListview");
	var accumValue = 0.00;

	// Empty current list
	transactionListview.empty();

	for ( var i = 0; i < results.rows.length; i++) {
		var resultMsg = "Row = " + i + " transcation id : "
				+ results.rows.item(i).TransactionId + " Amount : "
				+ results.rows.item(i).TransactionAmount;
		resultMsg = resultMsg + ", SubCategoryName : "
				+ results.rows.item(i).SubCategoryName + ", AccountName : "
				+ results.rows.item(i).accName;
		console.log(resultMsg);

		var transactionTemplate = getTransactionItemTemplate(results.rows
				.item(i).TransactionId, results.rows.item(i).CategoryIconName,
				results.rows.item(i).accName,
				results.rows.item(i).SubCategoryName,
				results.rows.item(i).TransactionAmount,
				results.rows.item(i).AccountTypeName);

		console.log(transactionTemplate);
		
		if (results.rows.item(i).CategoryTypeName == 'INCOME') {
			accumValue = Math.round((parseFloat(accumValue + '', 10) + parseFloat(results.rows.item(i).TransactionAmount, 10)) * 100) / 100;
		} else if (results.rows.item(i).CategoryTypeName == 'EXPENSE') {
			accumValue = Math.round((parseFloat(accumValue + '', 10) - parseFloat(results.rows.item(i).TransactionAmount, 10)) * 100) / 100;
		}
		
		transactionListview.append(transactionTemplate);
	}

	transactionListview.append(getNewTransactionItemTemplate());

	// Call listview jQuery UI Widget after adding
	// items to the list for correct rendering
	transactionListview.listview("refresh");
	
	var totalDescribe = '';
	if (accumValue >= 0.00) {
		totalDescribe = 'INCOME';
	} else {
		totalDescribe = 'EXPENSE';
	}
	$("#mainPage").find("#pTotalCategoryType").html(totalDescribe);
	
	$("#mainPage").find("#pTotalTransactionAmount").html('' + accumValue.toFixed(2) + ' Baht');
	$("#mainPage").find("#pSearchByDate").html(getTrDateBoxSearchValue());
	console.log('end appending');

	phetbudPageHideLoading();
}

function errorQueryTransactionAndDetail(err) {
	console.log("Error processing SQL: " + err.code);

	phetbudPageHideLoading();
}

function GetTransactionDetail() {
	phetbudPageShowLoading();

	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
	db.transaction(QueryTransactionAndDetail, errorQueryTransactionAndDetail);
}

function openTransactionPage(mode, transactionId) {
	console.log('mode : ' + mode + ', transactionID : ' + transactionId);
	$('#transactionPage').remove();
	$.mobile.changePage("transaction.html?mode=" + mode + "&trDate="
			+ getTrDateBox().data('datebox').theDate.format("dd/MM/yyyy") + "&trId=" + transactionId, {
		transition : "slideup"
	});
}

function closeProgram() {
	navigator.app.exitApp();
}

// console.log('in main2.html');

$('#mainPage').live(
		'pageshow',
		function(event, ui) {
			
			if (!isBlock) {
				console.log($.mobile.activePage.id);
	
				console.log('prevPage : ' + ui.prevPage.attr('id'));
	
				var dateHeader = getTrDateBox();
	
				console.log('get default datebox : '
						+ dateHeader.data('datebox').theDate);
				
				console.log('get change datebox : '
						+ dateHeader.data('datebox').theDate);
				
	//			var fixDate = new Date();
	//			dateHeader.data('datebox').theDate = fixDate.add('d', -2);
				
				console.log('get date trbox : ' + dateHeader.data('datebox').theDate.getDay());
	
				if (dateHeader.val() == '' || dateHeader.val() == null
						|| ui.prevPage.attr('id') == 'transactionPage') {
					// dateHeader.val(sDate.format("dd/MM/yyyy"));
					// dateHeader.datebox('setTheDate', sDate);
	
					dateHeader.val(dateHeader.data('datebox').theDate
							.format("yyyy-MM-dd"));
					dateHeader.datebox('refresh');
	
					GetTransactionDetail();
				}
			} else {
				isBlock = false;
			}

		});