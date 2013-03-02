var frDate;
var toDate;
var Period;
var Cat;
var currCat;

$('#report2Page').live(
		'pagebeforeshow',
		function(event, ui) {
		 
				console.log($(this).data("url"));

				var query = $(this).data("url").split("?")[1];
				query = query.split("&");
				frDate = query[0].replace("FrDate=", "");
				toDate = query[1].replace("ToDate=", "");
				Period = query[2].replace("Period=", "");
				Cat = query[3].replace("Cat=", "");
				
				//console.log(frDate);
				//console.log(toDate);
				var rep = $("#report2Page").find("#reportHeader");
				rep.empty();
				var htmloutput;
				htmloutput = "<li data-theme=''> <h6> สรุปข้อมูลรายจ่ายแยกตามหมวดหมู่หลัก/ย่อย </h6></li>"; 
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

	var rep = $("#report2Page").find("#reportDetail");
	var accumValue = 0.00;

	// Empty current list
	rep.empty();
	
	for ( var i = 0; i < results.rows.length; i++) {
		var resultMsg = "Row = " + i + " CategoryName : "
		+ results.rows.item(i).CategoryName + " Amount : "
		+ results.rows.item(i).TransactionAmount;
		console.log(resultMsg);
		var htmloutput = "<li data-role='list-divider' role='heading'> <div class='ui-grid-a'> <div class='ui-block-a' style='float: left'><h6>" +
		 " "+ results.rows.item(i).CategoryName +"</h6></div>" +
		 " <div class='ui-block-b' style='float: right'> <h6 align='right'> <span class='formatCurrencyWithBlankSymbol'>"+ results.rows.item(i).TransactionAmount +"</span></h6> " +
		 " </div> </div> </li>";
		accumValue += Number(results.rows.item(i).TransactionAmount); 
		console.log(htmloutput);
		rep.append(htmloutput).listview('refresh');
		
		currCat = results.rows.item(i).CategoryId;
		GetSubReportDetail();
		
	}
	var htmltotal = "<li data-role='list-divider' role='heading'> <div class='ui-grid-a'> <div class='ui-block-a' style='float: left'><h3>" +
	 " รวมสุทธิ</h3></div>" +
	 " <div class='ui-block-b' style='float: right'> <h6 align='right'> <span class='formatCurrencyWithBlankSymbol'>"+ accumValue +"</span></h6> " +
	 " </div> </div> </li>";
	rep.append(htmltotal).listview('refresh');
	rep.append("<li data-theme=''><input id='Back' type='submit' data-inline='false' data-icon='back' data-iconpos='left' " +
               " value='ยกเลิก' data-mini='false' onclick='javascript:backToPrevPage()'> </li>").listview('refresh');

}

function QueryReportDetail(tx) {

	var sql = "select Cat.CategoryName, Cat.CategoryId, sum(Trans.TransactionAmount) TransactionAmount " +
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
	
	sql += " group by Cat.CategoryName, Cat.CategoryId ";

	
	console.log(sql);
	
	
	tx.executeSql(sql, [], queryReportDetailSuccess, errorQueryReportDetail);
}

function errorQuerySubReportDetail(err) {
	console.log("Error processing SQL: " + err.code);

}

function GetSubReportDetail() {
	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
	db.transaction(QuerySubReportDetail, errorQuerySubReportDetail);
}

function querySubReportDetailSuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);

	var rep = $("#report2Page").find("#reportDetail");

	
	for ( var i = 0; i < results.rows.length; i++) {
		var resultMsg = "Row = " + i + " SubCategoryName : "
		+ results.rows.item(i).SubCategoryName + " Amount : "
		+ results.rows.item(i).TransactionAmount;
		console.log(resultMsg);

		var htmloutput = "<li data-theme='c'> <div class='ui-grid-a'> <div class='ui-block-a' style='float: left'><h6>" +
		 " "+ results.rows.item(i).SubCategoryName +"</h6></div>" +
		 " <div class='ui-block-b' style='float: right'> <h6 align='right'> <span class='formatCurrencyWithBlankSymbol'>"+ results.rows.item(i).TransactionAmount +"</span></h6> " +
		 " </div> </div> </li>";
		//accumValue += Number(results.rows.item(i).TransactionAmount); 
		console.log(htmloutput);
		rep.append(htmloutput).listview('refresh');

		
	}

}

function QuerySubReportDetail(tx) {

	var sql = "select SubCat.SubCategoryName, sum(Trans.TransactionAmount) TransactionAmount " +
	 " from Transactions Trans join SubCategories SubCat on Trans.SubCategoryId = SubCat.SubCategoryId join " +
	 " TransactionTypes Type on Trans.TransactionTypeId = Type.TransactionTypeId " + 
	 " where Type.TransactionTypeUse = 1 and Trans.TransActiveStatus = 'Y' " +
	 " and SubCat.CategoryId = " + currCat;

	
	if (Period != "") {
		// month year period

		sql += " and  substr(TransactionDate,1,7) = '" + Period.substring(0,7) + "'";
	} else {
		// from date to date
		sql += " and TransactionDate between '" + frDate + "' and '" + toDate + "'";
	}
	
	sql += " group by SubCat.SubCategoryName ";

	
	console.log(sql);
	
	
	tx.executeSql(sql, [], querySubReportDetailSuccess, errorQuerySubReportDetail);
}

