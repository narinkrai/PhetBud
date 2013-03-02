var frDate;
var toDate;
var Period;
var Cat;


$('#report1Page').live(
		'pagebeforeshow',
		function(event, ui) {
		 
				console.log($(this).data("url"));

				var query = $(this).data("url").split("?")[1];
				query = query.split("&");
				frDate = query[0].replace("FrDate=", "");
				toDate = query[1].replace("ToDate=", "");
				Period = query[2].replace("Period=", "");
				Cat = query[3].replace("Cat=", "");
				
				console.log(frDate);
				console.log(toDate);
				var rep = $("#report1Page").find("#reportHeader");
				rep.empty();
				var htmloutput;
				htmloutput = "<li data-theme=''> <h6> สรุปข้อมูลรายจ่ายแยกตามหมวดหมู่หลัก </h6></li>"; 
				rep.append(htmloutput).listview('refresh');
				if (Period != "") {
					var sPeriod = Period.split("-");
					htmloutput = "<li data-theme=''> <h6> แสดงข้อมูลตามเดือน/ปี " +
					 sPeriod[1] + "/" + sPeriod[0] +"</h6></li>";
				} else {
					var sfrDate = frDate.split("-");
					var stoDate = toDate.split("-");
					htmloutput = "<li data-theme=''> <h6> แสดงข้อมูลช่วงวันที่ </br> " +
					 sfrDate[2] + "/" + sfrDate[1] + "/" + sfrDate[0] + " ถึง " + 
					 stoDate[2] + "/" + stoDate[1] + "/" + stoDate[0] + "</h6></li>";
				}

				rep.append(htmloutput).listview('refresh');
				GetReportDetail();
		});


function errorQueryReportDetail(err) {
	console.log("Error processing SQL: " + err.code);

	phetbudPageHideLoading();
}

function GetReportDetail() {

	phetbudPageShowLoading();

	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
	db.transaction(QueryReportDetail, errorQueryReportDetail);
}

function queryReportDetailSuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);

	var rep = $("#report1Page").find("#reportDetail");
	var accumValue = 0.00;

	// Empty current list
	rep.empty();
	
	for ( var i = 0; i < results.rows.length; i++) {
		var resultMsg = "Row = " + i + " CategoryName : "
		+ results.rows.item(i).CategoryName + " Amount : "
		+ results.rows.item(i).TransactionAmount;
		console.log(resultMsg);

		/*var htmloutput = "<li data-theme=''> <div class='ui-grid-a'> <div class='ui-block-a' style='float: left'> " +
						 " <p id='pTotalCategoryType'>"+ results.rows.item(i).CategoryName +"</p> </div>" +
						 " <div class='ui-block-b'  style='float: right'> <p id='pTotalTransactionAmount' align='right'>"+ results.rows.item(i).TransactionAmount +"</p>" +
						 " </div> </div> </li>";*/
		var htmloutput = "<li data-theme=''> <div class='ui-grid-a'> <div class='ui-block-a' style='float: left'><h6>" +
		 " "+ results.rows.item(i).CategoryName +"</h6></div>" +
		 " <div class='ui-block-b' style='float: right'> <h6 align='right'> <span class='formatCurrencyWithBlankSymbol'>"+ results.rows.item(i).TransactionAmount +"</span></h6> " +
		 " </div> </div> </li>";
		accumValue += Number(results.rows.item(i).TransactionAmount); 
		console.log(htmloutput);
		rep.append(htmloutput).listview('refresh');
	}
	var htmltotal = "<li data-theme=''> <div class='ui-grid-a'> <div class='ui-block-a' style='float: left'><h3>" +
	 " รวมสุทธิ</h3></div>" +
	 " <div class='ui-block-b' style='float: right'> <h6 align='right'> <span class='formatCurrencyWithBlankSymbol'>"+ accumValue +"</span></h6> " +
	 " </div> </div> </li>";
	rep.append(htmltotal).listview('refresh');
	rep.append("<li data-theme=''><input id='Back' type='submit' data-inline='false' data-icon='back' data-iconpos='left' " +
               " value='ยกเลิก' data-mini='false' onclick='javascript:backToPrevPage()'> </li>").listview('refresh');

}


/*function CreateReportView() {
	$('ul').append('<li><a>hello</a></li>').listview('refresh');
}

function queryReportDetailSuccess(tx, results) {
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
} */

function QueryReportDetail(tx) {

	var sql = "select Cat.CategoryName, sum(Trans.TransactionAmount) TransactionAmount " +
	 " from Transactions Trans join SubCategories SubCat on Trans.SubCategoryId = SubCat.SubCategoryId join " +
	 " Categories Cat on SubCat.CategoryId = Cat.CategoryId join " + 
	 " TransactionTypes Type on Trans.TransactionTypeId = Type.TransactionTypeId " + 
	 " where Type.TransactionTypeUse = 1 and Trans.TransActiveStatus = 'Y' ";

	
	if (Period != "") {
		// month year period

		sql += " and  substr(TransactionDate,1,7) = '" + Period.substring(0,7) + "'";
	} else {
		// from date to date
		sql += " and TransactionDate between '" + frDate + "' and '" + toDate + "'";
	}
	
	if (Cat != "") {
		sql += " and Cat.CategoryId = " + Cat;
	}
	
	sql += " group by Cat.CategoryName ";

	
	console.log(sql);
	
	
	tx.executeSql(sql, [], queryReportDetailSuccess, errorQueryReportDetail);
}
