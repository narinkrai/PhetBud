var ACCOUNT_ITEMS = null;
var SUBCATEGORY_INCOME_ITEMS = null;
var SUBCATEGORY_EXPENSE_ITEMS = null;
var SUBCATEGORY_TRANSFER_ITEMS = null;
var TransactionEditId = '';
var TransactionEdit;
var AccountEdit;
var CategoryEditId;
var CategoryEdit;
var SubCategoryEdit;

function phetbudPageShowLoading() {
	$.mobile.loading('show', {
		text : '',
		textVisible : 'false',
		theme : 'a',
		textonly : 'false',
		html : ''
	});
}

function phetbudPageHideLoading() {
	$.mobile.loading('hide');
}

function phetbudDefaultError(err) {
	
}

function phetbudDefaultSuccess() {
	
}

function phetbudDefaultErrorCloseProgram() {
	phetbudPageHideLoading();
	alert('เกิดข้อผิดพลาดในการเตรียมโปรแกรม');
	navigator.app.exitApp();
}

function getPhetbudAppDB() {
	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
	return db;
}

function getPhetbudSysDB() {
	var db = window.openDatabase("PHETBudSysDB", "1.0", "PHETBud System DB", 500000);
	return db;
}

function getSQLUpdateAccountBalance(AccountId, TransactionTypeId, TransactionAmount) {
	var sql = 'UPDATE AccountBalance ';
	
	if (TransactionTypeId == '0') {
		sql += 'SET AccountBalanceCurAmount = AccountBalanceCurAmount + ' + TransactionAmount.toFixed(2) +
				', AccountBalanceAccInAmount = AccountBalanceAccInAmount + ' + TransactionAmount.toFixed(2) + ' ';
	} else if (TransactionTypeId == '1') {
		sql += 'SET AccountBalanceCurAmount = AccountBalanceCurAmount - ' + TransactionAmount.toFixed(2) +
				', AccountBalanceAccOutAmount = AccountBalanceAccOutAmount + ' + TransactionAmount.toFixed(2) + ' ';
	}
	
	sql += 'WHERE AccountId = ' + AccountId;
	return sql;
}

function getSQLSelectTransactionDetails() {
	var sql = 'select ts.TransactionId, ts.TransActiveDate, ts.TransRecurrValue, ts.TransactionAmount, scat.SubCategoryName, cat.CategoryIconName, catt.CategoryTypeName ';
	sql = sql
			+ ' , acc.AccountId accId, acc.AccountName accName, acct.AccountTypeName, tst.TransactionTypeUse '
	sql = sql
			+ ' FROM Transactions ts left outer join Accounts accto ON ts.AccountIdTo = accto.AccountId, TransactionTypes tst, SubCategories scat, Categories cat, CategoryTypes catt, Accounts acc, AccountTypes acct ';
	sql = sql
			+ ' WHERE ts.TransactionTypeId = tst.TransactionTypeUse AND ts.SubCategoryId = scat.SubCategoryId AND scat.CategoryId = cat.CategoryId AND cat.CategoryTypeId = catt.CategoryTypeId AND ts.AccountId = acc.AccountId AND acc.AccountTypeId = acct.AccountTypeId ';
	
	return sql;
}

function querySetAccountItemsSuccess(tx, results) {
	console.log("Account items rows = " + results.rows.length);
	if (results.rows.length > 0) {
		console.log('set account items');
		ACCOUNT_ITEMS = results.rows;
	}
		
}

function querySetAccountItems(tx) {
	ACCOUNT_ITEMS = null;
	
	var sql = 'SELECT acct.AccountTypeName, acc.AccountTypeId, acc.AccountId, acc.AccountName, acc.AccountIconName ' +
	  'FROM AccountTypes acct LEFT OUTER JOIN Accounts acc ON acct.AccountTypeId = acc.AccountTypeId ' +
	  'ORDER BY acct.AccountTypeId, acc.AccountTypeId ';
	
	tx.executeSql(sql, [], querySetAccountItemsSuccess, phetbudDefaultError);
}

function setAccountItems() {
	var db = getPhetbudAppDB();
	db.transaction(querySetAccountItems, phetbudDefaultErrorCloseProgram);
}

function querySetSubCategoryItemsSuccess(tx, results) {
	console.log("SubCategory items rows = " + results.rows.length);
	if (results.rows.length > 0) {
		if (results.rows.item(0).CategoryTypeName == 'INCOME') {
			console.log('set subcat income items');
			SUBCATEGORY_INCOME_ITEMS = results.rows;
		} else if (results.rows.item(0).CategoryTypeName == 'EXPENSE') {
			console.log('set subcat expense items');
			SUBCATEGORY_EXPENSE_ITEMS = results.rows;
		} 
	}
}

function querySetSubCategoryAllItemsSuccess(tx, results) {
	console.log("SubCategory all items rows = " + results.rows.length);
	if (results.rows.length > 0) {
		console.log('set subcat transfer items');
		SUBCATEGORY_TRANSFER_ITEMS = results.rows;
	}
}

function querySetSubCategoryItems(tx) {
	SUBCATEGORY_INCOME_ITEMS = null;
	SUBCATEGORY_EXPENSE_ITEMS = null;
	SUBCATEGORY_TRANSFER_ITEMS = null;
	
	var sqlCatIncome = 'SELECT catt.CategoryTypeName, cat.CategoryId, cat.CategoryName, cat.CategoryIconName, scat.SubCategoryId, scat.SubCategoryName ' +
	  'FROM CategoryTypes catt, Categories cat, SubCategories scat ' + 
	  'WHERE catt.CategoryTypeId = cat.CategoryTypeId AND cat.CategoryId = scat.CategoryId AND catt.CategoryTypeName = "INCOME" ' + 
	  'ORDER BY cat.CategoryId, scat.SubCategoryId '
	tx.executeSql(sqlCatIncome, [], querySetSubCategoryItemsSuccess, phetbudDefaultError);
	
	var sqlCatExpense = 'SELECT catt.CategoryTypeName, cat.CategoryId, cat.CategoryName, cat.CategoryIconName, scat.SubCategoryId, scat.SubCategoryName ' +
	  'FROM CategoryTypes catt, Categories cat, SubCategories scat ' + 
	  'WHERE catt.CategoryTypeId = cat.CategoryTypeId AND cat.CategoryId = scat.CategoryId AND catt.CategoryTypeName = "EXPENSE" ' + 
	  'ORDER BY cat.CategoryId, scat.SubCategoryId '
	tx.executeSql(sqlCatExpense, [], querySetSubCategoryItemsSuccess, phetbudDefaultError);
	
	var sqlCatTransfer = 'SELECT catt.CategoryTypeName, cat.CategoryId, cat.CategoryName, cat.CategoryIconName, scat.SubCategoryId, scat.SubCategoryName ' +
	  'FROM CategoryTypes catt, Categories cat, SubCategories scat ' + 
	  'WHERE catt.CategoryTypeId = cat.CategoryTypeId AND cat.CategoryId = scat.CategoryId AND catt.CategoryTypeName = "TRANSFER" ' + 
	  'ORDER BY cat.CategoryId, scat.SubCategoryId '
	tx.executeSql(sqlCatTransfer, [], querySetSubCategoryAllItemsSuccess, phetbudDefaultError);
}

function setSubCategoryItems() {
	var db = getPhetbudAppDB();
	db.transaction(querySetSubCategoryItems, phetbudDefaultErrorCloseProgram);
}

function queryUnactiveTransactionsSuccess(tx, results) {
	console.log('unactive rows : ' + results.rows.length);
	
	for ( var i = 0; i < results.rows.length; i++) {
		
		var upTransActiveSql = 'UPDATE Transactions SET TransActiveStatus = "Y" WHERE TransactionId = ' + results.rows.item(i).TransactionId; 
		var transAmont = phetbudStrToFloat(results.rows.item(i).TransactionAmount);
		tx.executeSql(upTransActiveSql, [], phetbudDefaultSuccess, phetbudDefaultError);
		
		if (results.rows.item(i).TransactionTypeId == '0' || results.rows.item(i).TransactionTypeId == '3') {
			var upBalSql = getSQLUpdateAccountBalance(results.rows.item(i).AccountId, '0', transAmont); // utils
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], phetbudDefaultSuccess, phetbudDefaultError);
		} else if (results.rows.item(i).TransactionTypeId == '1' || results.rows.item(i).TransactionTypeId == '4') {
			var upBalSql = getSQLUpdateAccountBalance(results.rows.item(i).AccountId, '1', transAmont); // utils
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], phetbudDefaultSuccess, phetbudDefaultError);
		} else if (results.rows.item(i).TransactionTypeId == '2' || results.rows.item(i).TransactionTypeId == '5') {
			var upBalOutSql = getSQLUpdateAccountBalance(results.rows.item(i).AccountId, '1', transAmont); // utils
			console.log(upBalOutSql);
			tx.executeSql(upBalOutSql, [], phetbudDefaultSuccess, phetbudDefaultError);
			var upBalInSql = getSQLUpdateAccountBalance(results.rows.item(i).AccountIdTo, '0', transAmont); // utils
			console.log(upBalInSql);
			tx.executeSql(upBalInSql, [], phetbudDefaultSuccess, phetbudDefaultError);
		}
	}
}

function queryUnactiveTransactions(tx) {
	var currentDate = new Date();
	var sql = getSQLSelectTransactionDetails() + ' AND ts.TransActiveStatus = "N" AND ts.TransActiveDate <= "' + currentDate.format("yyyy-MM-dd") +'" ';
	console.log(sql);
	
	tx.executeSql(sql, [], queryUnactiveTransactionsSuccess, phetbudDefaultError);
}

function setUnactiveTransaction() {
	var db = getPhetbudAppDB();
	db.transaction(queryUnactiveTransactions, phetbudDefaultErrorCloseProgram);
}

function phetbudStrToFloat(flStr) {
	return (Math.round((parseFloat(flStr + '', 10)) * 100) / 100);
}
