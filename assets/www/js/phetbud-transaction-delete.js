var isBlockPageshow = false;
var transRecurrDelItems = null;

$('#transactionDeletePage').find('#checkbox-recurrDelete').on( "change", function(event, ui) {
//	console.log('in change radio');
//	if ($('#transactionDeletePage').find('#checkbox-recurrDelete').is(':checked')) {
//		console.log('in checked');
//		$('#transactionDeletePage').find('#div-transactionListview').show();
//	} else {
//		console.log('in unchecked');
//		$('#transactionDeletePage').find('#div-transactionListview').hide();
//	}
});

function querySelectDeleteRecurrTransactionError(error) {
	phetbudPageHideLoading();
	alert('find transaction error');
	history.back();
}

function querySelectDeleteRecurrTransactionSuccess(tx, results) {
	
	console.log("Returned rows = " + results.rows.length);
	transRecurrDelItems = results.rows;

	var transactionListview = $("#transactionDeletePage").find("#transactionListView");
	
	// Empty current list
	transactionListview.empty();
	
	var resultListviewHtml = '';
	
	for ( var i = 0; i < results.rows.length; i++) {
		resultListviewHtml += '<li data-icon="false"><a href="#"> ';
		resultListviewHtml += '<img src=\"img/cordova.png\" />';
		//resultListviewHtml += '<img src=\"' + results.rows.item(i).CategoryIconName + '\" />';
		resultListviewHtml += '<h3> Account : ' + results.rows.item(i).accName + ' (' + results.rows.item(i).AccountTypeName +') </h3>';
		resultListviewHtml += '<p> Amount : ' + results.rows.item(i).TransactionAmount + ' Baht </p>';
		resultListviewHtml += '<p> Transaction Date : ' + results.rows.item(i).TransActiveDate + ' , period : ' + results.rows.item(i).TransRecurrValue + '</p>'; 
		resultListviewHtml += '</a></li>';
		
		console.log(resultListviewHtml);
	}
	
	transactionListview.append(resultListviewHtml);
	// Call listview jQuery UI Widget after adding
	// items to the list for correct rendering
	transactionListview.listview("refresh");
	
	phetbudPageHideLoading();
}

function querySelectDeleteRecurrTransaction(tx) {
	var sql = getSQLSelectTransactionDetails(); // in utils
	sql = sql + ' AND ts.TransactionId <> ' + TransactionEdit.TransactionId + ' AND ts.TransActiveStatus = "N" ';
	
	if (TransactionEdit.TransRecurrOrgId === undefined)
	{
		// check if orginal transaction for recurr
		sql = sql + ' AND ts.TransRecurrOrgId = ' + TransactionEdit.TransactionId;
	} else {
		sql = sql + ' AND ts.TransRecurrOrgId = ' + TransactionEdit.TransRecurrOrgId;
	}
	console.log(sql);
	
	tx.executeSql(sql, [], querySelectDeleteRecurrTransactionSuccess, querySelectDeleteRecurrTransactionError);
}

function setDeletePage() {
	
	phetbudPageShowLoading();
	
	transRecurrDelItems = null;
	
	var db =  getPhetbudAppDB();
	db.transaction(querySelectDeleteRecurrTransaction, defaultError);
	
	phetbudPageHideLoading();
}


function defaultError(err) {
	console.log("Error processing SQL program database : " + err);
	alert('not success');
	phetbudPageHideLoading();
}

function deleteTransactionSuccess() {
	phetbudPageHideLoading();
	TransactionEditId = '';
	TransactionEdit = null;
	alert("ลบข้อมูลเรียบร้อย");
	history.back();
}

function queryDeleteTransaction(tx) {
	var sql = 'DELETE FROM Transactions WHERE TransactionId = ' + TransactionEdit.TransactionId;
	var accountId = TransactionEdit.AccountId;
	var accountIdTo = TransactionEdit.AccountIdTo;
	var transactionAmount = Math.round((parseFloat(TransactionEdit.TransactionAmount + '', 10)) * 100) / 100;
	console.log('================================delete========================');
	console.log('active status : ' + TransactionEdit.TransActiveStatus);
	if (TransactionEdit.TransActiveStatus == 'Y') {
		if (TransactionEdit.TransactionTypeUse == '0' || TransactionEdit.TransactionTypeUse == '3') {
			var upBalSql = getSQLUpdateAccountBalance(accountId, '1', transactionAmount);
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], phetbudDefaultSuccess, defaultError);
		} else if (TransactionEdit.TransactionTypeUse == '1' || TransactionEdit.TransactionTypeUse == '4') {
			var upBalSql = getSQLUpdateAccountBalance(accountId, '0', transactionAmount);
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], phetbudDefaultSuccess, defaultError);
		} else if (TransactionEdit.TransactionTypeUse == '2' || TransactionEdit.TransactionTypeUse == '5') {
			var upBalOutSql = getSQLUpdateAccountBalance(accountId, '0', transactionAmount);
			console.log(upBalOutSql);
			tx.executeSql(upBalOutSql, [], phetbudDefaultSuccess, defaultError);
			var upBalInSql = getSQLUpdateAccountBalance(accountIdTo, '1', transactionAmount);
			console.log(upBalInSql);
			tx.executeSql(upBalInSql, [], phetbudDefaultSuccess, defaultError);
		}
	}
	
	console.log(sql);
	
	if (transRecurrDelItems != null && $('#transactionDeletePage').find('#checkbox-recurrDelete').is(':checked')) {
		
		var transRecurrIds = '0 ';
		for (var i = 0; i < transRecurrDelItems.length; i++) {
			transRecurrIds += ', ' + transRecurrDelItems.item(i).TransactionId;
		}
		
		var deleteRecurrSql = 'DELETE FROM Transactions WHERE TransactionId IN ( ' + transRecurrIds + ') ';
		
		console.log(deleteRecurrSql);
		tx.executeSql(deleteRecurrSql, [], phetbudDefaultSuccess, defaultError);
	}
	
	tx.executeSql(sql, [], deleteTransactionSuccess, defaultError);
	
}

function ConfirmDelete() {
	phetbudPageShowLoading();
	var db = getPhetbudAppDB();
	db.transaction(queryDeleteTransaction, defaultError);
}

$('#transactionDeletePage').live('pageshow',function(event, ui) {
		
		if (!isBlockPageshow) {
			setDeletePage();
		} else {
			isBlockPageshow = false;
		}

});