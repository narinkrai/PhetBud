var sDate = new Date();
var mode = '';
var isBlockPageshow = false;

//$('#transactionPage').find('#selectSubCategories-menu').click(function (e) {
//	isBlockPageshow = true;
//	console.log('Click sub');
//});

function aSubCatOnclick() {
	console.log('on click');
	isBlockPageshow = true;
	$('#transactionPage').find('#selectSubCategories').selectmenu('open');
}

$('#transactionPage').find('#popupSubCat').bind({ popupafteropen: function(event, ui) { 
	isBlockPageshow = true;
	
}});

$('#transactionPage').find('#popupSubCat').bind({ popupafterclose: function(event, ui) { 
	isBlockPageshow = true;
	
}});

function onClickSubCatPopupList(subCategoryName, subCategoryId) {
	$('#transactionPage').find('#aSubCategories').siblings('.ui-btn-inner').children('.ui-btn-text').text(subCategoryName);
}

$('#transactionPage').find('#selectSubCategories').on( "focus", function(event, ui) {
	console.log('on focus');
	isBlockPageshow = true;
});

$('#transactionPage').find('#selectSubCategories').on( "change", function(event, ui) {
	console.log('on change');
	isBlockPageshow = true;
	if ($(this).find(":selected") === undefined) {
		//$('#transactionPage').find('#aSubCategories').prev('a').find('span.ui-btn-text').text("");
		//$('#transactionPage').find('#aSubCategories').html('&nbsp;');
		$('#transactionPage').find('#aSubCategories').siblings('.ui-btn-inner').children('.ui-btn-text').text("");
	} else {
		//$('#transactionPage').find('#aSubCategories').prev('a').find('span.ui-btn-text').text($(this).find(":selected").text());
		//$('#transactionPage').find('#aSubCategories').html($(this).find(":selected").text());
		$('#transactionPage').find('#aSubCategories').siblings('.ui-btn-inner').children('.ui-btn-text').text($(this).find(":selected").text());
		
	}
});

$('#transactionPage').find('#selectSubCategories').on( "blur", function(event, ui) {
	console.log('on blur');
	isBlockPageshow = true;
});

$('#transactionPage').find('#selectAccountId').on( "change", function(event, ui) {
	isBlockPageshow = true;
});

$('#transactionPage').find('#selectAccountId').on( "blur", function(event, ui) {
	isBlockPageshow = true;
});

$('#transactionPage').find('#selectAccountIdTo').on( "change", function(event, ui) {
	isBlockPageshow = true;
});

$('#transactionPage').find('#selectAccountIdTo').on( "blur", function(event, ui) {
	isBlockPageshow = true;
});

$('#transactionPage').find('input[name=radio-transactionType]').on( "change", function(event, ui) {
	onChangeRadioTransactionType();
});

function onChangeRadioTransactionType() {
	console.log('radio change');
	
	phetbudPageShowLoading();
	
	var TransactionTypeId = $('#transactionPage').find('input[name=radio-transactionType]:checked').val();
	
	console.log('value = ' + TransactionTypeId);
	
	if (TransactionTypeId == '2') {
		$('#transactionPage').find('#div-AccountIdTo').show();
		setSelectMenuSubCategory(SUBCATEGORY_TRANSFER_ITEMS);
		
	} else {
		$('#transactionPage').find('#div-AccountIdTo').hide();
		$('#transactionPage').find('#selectAccountIdTo').val('0');
		$('#transactionPage').find('#selectAccountIdTo').selectmenu("refresh");
		
		if (TransactionTypeId == '0') {
			setSelectMenuSubCategory(SUBCATEGORY_INCOME_ITEMS);
		} else {
			setSelectMenuSubCategory(SUBCATEGORY_EXPENSE_ITEMS);
		}
	}
	
	phetbudPageHideLoading();
}

function getTransactionDateBox() {
	return $("#transactionPage").find("#transactionDateBox");
}

function getTransActiveDateBox() {
	return $("#transactionPage").find("#transActiveDateBox");
}

function getTransRecurrStartDateBox() {
	return $("#transactionPage").find("#transRecurrStartDateBox");
}

function getTransRecurrEndDateBox() {
	return $("#transactionPage").find("#transRecurrEndDateBox");
}

function clearTransactionForm() {
	// $('#transactionPage').find('input[name=radio-transactionType]:checked').val();
	var incomeRadio = $('#transactionPage').find('#radio-transactionType1');
	var expenseRadio = $('#transactionPage').find('#radio-transactionType2');
	var transferRadio = $('#transactionPage').find('#radio-transactionType3');
	incomeRadio.attr('checked', true).checkboxradio("refresh");
	expenseRadio.attr('checked', false).checkboxradio("refresh");
	transferRadio.attr('checked', false).checkboxradio("refresh");
	$('#transactionPage').find('#selectAccountId').empty();
	$('#transactionPage').find('#selectAccountId').selectmenu("refresh");
	$('#transactionPage').find('#selectAccountIdTo').empty();
	$('#transactionPage').find('#selectAccountIdTo').selectmenu("refresh");
	$('#transactionPage').find('#div-AccountIdTo').hide();
	//$('#transactionPage').find('#subCategoryId').val('');
	$('#transactionPage').find('#selectSubCategories').empty();
	$('#transactionPage').find('#selectSubCategories').selectmenu("refresh");
	var trDateBox = getTransactionDateBox();
	trDateBox.val(sDate.format("yyyy-MM-dd"));
	trDateBox.data('datebox').theDate = new Date(sDate);
	trDateBox.datebox('refresh');
	$('#transactionPage').find('#transactionAmount').val('');
	$('#transactionPage').find('#transactionRemark').val('');
	// $('#transactionPage').find('input[name=radio-transActiveStatus]:checked').val();
	var trActDateBox = getTransActiveDateBox();
	trActDateBox.val(sDate.format("yyyy-MM-dd"));
	trActDateBox.data('datebox').theDate = new Date(sDate);
	trActDateBox.datebox('refresh');
	var trRecurStrDateBox = getTransRecurrStartDateBox();
	trRecurStrDateBox.val('');
	trRecurStrDateBox.datebox('refresh');
	var trRecurrEndDateBox = getTransRecurrEndDateBox();
	trRecurrEndDateBox.val('');
	trRecurrEndDateBox.datebox('refresh');
	var TransRecurrType = ''; // $('#transactionPage').find('#').val();
	var TransRecurrValue = ''; // $('#transactionPage').find('#').val();
	var TransRecurrOrgId = null; // $('#transactionPage').find('#').val();
	var TransRecurrNextId = null; // $('#transactionPage').find('#').val();
	$('#transactionPage').find('#div-buttonAddMode').show();
	$('#transactionPage').find('#div-buttonEditMode').hide();
	
	// edit mode
	TransactionEditId = '';
	TransactionEdit = null;
}

function setSelectMenuAccounts(rows) {
	var oldAccountTypeId = 0;
	var selectHtml = '';
	var selectHtmlAccTo = '';
	
	var selectAccId = $('#transactionPage').find('#selectAccountId');
	var selectAccIdTo = $('#transactionPage').find('#selectAccountIdTo');
	selectAccId.empty();
	selectAccIdTo.empty();
	
	
	for ( var i = 0; i < rows.length; i++) {
		
		if (oldAccountTypeId == 0) {
			oldAccountTypeId = parseInt(rows.item(i).AccountTypeId);
			selectHtml += getAccountOpenOptGroupItem(rows.item(i).AccountTypeId, rows.item(i).AccountTypeName);
		} else if (oldAccountTypeId != parseInt(rows.item(i).AccountTypeId)) {
			oldAccountTypeId = parseInt(rows.item(i).AccountTypeId);
			selectHtml += getAccountCloseOptGroupItem();
			selectHtml += getAccountOpenOptGroupItem(rows.item(i).AccountTypeId, rows.item(i).AccountTypeName);
		}
		
		selectHtml += getAccountOptionItem(rows.item(i).AccountId, rows.item(i).AccountName);
	}
	
	if (selectHtml != '') {
		selectHtml += getAccountCloseOptGroupItem();
		selectHtmlAccTo = '<optgroup id="accgroupid-0" label="Clear AccountIdTo">';
		selectHtmlAccTo += '<option value="0">&nbsp;</option>';
		selectHtmlAccTo += '</optgroup>';
		selectHtmlAccTo += selectHtml;
	}
	
	selectAccId.append(selectHtml);
	selectAccIdTo.append(selectHtmlAccTo);
	
	selectAccId.selectmenu("refresh").trigger("change");
	selectAccIdTo.selectmenu("refresh").trigger("change");
}

function setSelectMenuSubCategory(rows) {
	console.log("Returned rows = " + rows.length);
	
	var oldCategoryId = 0;
	var selectHtml = '';
	
	var selectSubCat = $('#transactionPage').find('#selectSubCategories');
	selectSubCat.empty();
	
	
	for ( var i = 0; i < rows.length; i++) {
		
		if (oldCategoryId == 0) {
			oldCategoryId = parseInt(rows.item(i).CategoryId);
			selectHtml += getCategoryOpenOptGroupItem(rows.item(i).CategoryId, rows.item(i).CategoryName, rows.item(i).CategoryIconName);
		} else if (oldCategoryId != parseInt(rows.item(i).CategoryId)) {
			oldCategoryId = parseInt(rows.item(i).CategoryId);
			selectHtml += getCategoryCloseOptGroupItem();
			selectHtml += getCategoryOpenOptGroupItem(rows.item(i).CategoryId, rows.item(i).CategoryName, rows.item(i).CategoryIconName);
		}
		
		selectHtml += getSubCategoryOptionItem(rows.item(i).SubCategoryId, rows.item(i).SubCategoryName);
	}
	
	if (selectHtml != '') {
		selectHtml += getCategoryCloseOptGroupItem();
	}
	
	selectSubCat.append(selectHtml);
	
	selectSubCat.selectmenu("refresh").trigger("change");
	
//	var prevAccountType = '';
//	var oldCategoryId = 0;
//	var collapseDivHtml = '';
//	
//	for ( var i = 0; i < rows.length; i++) {
//		
//		if (oldCategoryId != rows.item(i).CategoryId) {
//			
//			if (collapseDivHtml != '') {
//				collapseDivHtml += ' </ul> </div> '; // if not first collapse then close prev one
//			}
//				
//			collapseDivHtml += ' <div data-role="collapsible"  data-theme="b" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-inset="false"> ';
//			
//			if ( rows.item(i).CategoryIconName == null ||  rows.item(i).CategoryIconName === undefined ||  rows.item(i).CategoryIconName == '') {
//				collapseDivHtml += ' <img src="img/cordova.png" /> '; // default picture
//			} else {
//				collapseDivHtml += ' <img src="' + rows.item(i).CategoryIconName + '" />';
//			}
//			
//			collapseDivHtml += ' <h2> ' + rows.item(i).CategoryName + ' </h2> ';
//			collapseDivHtml += ' <ul data-role="listview" data-icon="gear" data-split-theme="d"> ';
//		}
//		
//		collapseDivHtml += ' <li data-icon="gear"><a href="javascript:onClickSubCatPopupList(\'' + rows.item(i).SubCategoryName + '\', ' + rows.item(i).SubCategoryId + ')" > ';
//		
//		
//		
//		
//		collapseDivHtml += ' <h3> ' + rows.item(i).SubCategoryName + ' </h3> ';
//		collapseDivHtml += ' </a></li> ';
//		
//		oldCategoryId = parseInt(rows.item(i).CategoryId);
//	}
//	
//	if (collapseDivHtml != '') {
//		collapseDivHtml += ' </ul> </div> '; // if not first collapse then close prev one
//	}
//	
//	console.log(collapseDivHtml);
//	
//	myClone1 = $(collapseDivHtml);
//	var divAcc = $('#transactionPage').find("#div-subcatpopup");
//	divAcc.html('');
//    myClone1.appendTo(divAcc).trigger('create');
//    
//    $('#transactionPage').find('div[data-role=collapsible]').each(function (){
//    	$(this).collapsible({refresh:true});
//    });
	
}

function setTransactionForm() {
	
	phetbudPageShowLoading();
	
	setSelectMenuAccounts(ACCOUNT_ITEMS);
	
	setSelectMenuSubCategory(SUBCATEGORY_INCOME_ITEMS);
	
	phetbudPageHideLoading();

//	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
//	db.transaction(querySetTransactionForm, errorSetTransactionForm);
}

function errorSetTransactionForm(err) {
	console.log("Error processing SQL program database : " + err);
	phetbudPageHideLoading();
	alert('Failed to initial transaction page');
	history.back();
}

function querySetTransactionForm(tx) {
	var sqlCat = 'SELECT catt.CategoryTypeName, cat.CategoryId, cat.CategoryName, cat.CategoryIconName, scat.SubCategoryId, scat.SubCategoryName ' +
			  'FROM CategoryTypes catt, Categories cat, SubCategories scat ' + 
			  'WHERE catt.CategoryTypeId = cat.CategoryTypeId AND cat.CategoryId = scat.CategoryId ' + 
			  'ORDER BY cat.CategoryId, scat.SubCategoryId '
	tx.executeSql(sqlCat, [], querySubCategorySuccess, errorSetTransactionForm);
	
	var sqlAcc = 'SELECT acct.AccountTypeName, acc.AccountTypeId, acc.AccountId, acc.AccountName, acc.AccountIconName ' +
			  'FROM AccountTypes acct, Accounts acc ' +
			  'WHERE acct.AccountTypeId = acc.AccountTypeId ' +
			  'ORDER BY acct.AccountTypeId, acc.AccountTypeId ';

	tx.executeSql(sqlAcc, [], queryAccountSuccess, errorSetTransactionForm);
}

function getCategoryOpenOptGroupItem(CategoryId, CategoryName, CategoryIconName) {
	return '<optgroup id="catgroupid-' + CategoryId + '" label="' + CategoryName + '">';
}

function getCategoryCloseOptGroupItem() {
	return '</optgroup>';
}

function getSubCategoryOptionItem(SubCategoryId, SubCategoryName) {
	return '<option value="' + SubCategoryId + '">' + SubCategoryName + '</option>';
}

function querySubCategorySuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);
	
	var oldCategoryId = 0;
	var selectHtml = '';
	
	var selectSubCat = $('#transactionPage').find('#selectSubCategories');
	selectSubCat.empty();
	
	
	for ( var i = 0; i < results.rows.length; i++) {
//		var resultStr = 'CategoryTypeName : ' + results.rows.item(i).CategoryTypeName + ', CategoryId : ' + results.rows.item(i).CategoryId +
//						', CategoryName : ' + results.rows.item(i).CategoryName + ', CategoryIconName : ' + results.rows.item(i).CategoryIconName +
//						', SubCategoryId : ' + results.rows.item(i).SubCategoryId + ', SubCategoryName : ' + results.rows.item(i).SubCategoryName;
//		console.log(resultStr);
		
		if (oldCategoryId == 0) {
			oldCategoryId = parseInt(results.rows.item(i).CategoryId);
			selectHtml += getCategoryOpenOptGroupItem(results.rows.item(i).CategoryId, results.rows.item(i).CategoryName, results.rows.item(i).CategoryIconName);
		} else if (oldCategoryId != parseInt(results.rows.item(i).CategoryId)) {
			oldCategoryId = parseInt(results.rows.item(i).CategoryId);
			selectHtml += getCategoryCloseOptGroupItem();
			selectHtml += getCategoryOpenOptGroupItem(results.rows.item(i).CategoryId, results.rows.item(i).CategoryName, results.rows.item(i).CategoryIconName);
		}
		
		selectHtml += getSubCategoryOptionItem(results.rows.item(i).SubCategoryId, results.rows.item(i).SubCategoryName);
	}
	
	if (selectHtml != '') {
		selectHtml += getCategoryCloseOptGroupItem();
	}
	
	selectSubCat.append(selectHtml);
	
	selectSubCat.selectmenu("refresh").trigger("change");
	
}

function getAccountOpenOptGroupItem(AccountTypeId, AccountTypeName) {
	return '<optgroup id="accgroupid-' + AccountTypeId + '" label="' + AccountTypeName + '">';
}

function getAccountCloseOptGroupItem() {
	return '</optgroup>';
}

function getAccountOptionItem(AccountId, AccountName) {
	return '<option value="' + AccountId + '">' + AccountName + '</option>';
}

function queryAccountSuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);
	
	var oldAccountTypeId = 0;
	var selectHtml = '';
	var selectHtmlAccTo = '';
	
	var selectAccId = $('#transactionPage').find('#selectAccountId');
	var selectAccIdTo = $('#transactionPage').find('#selectAccountIdTo');
	selectAccId.empty();
	selectAccIdTo.empty();
	
	
	for ( var i = 0; i < results.rows.length; i++) {
		
		if (oldAccountTypeId == 0) {
			oldAccountTypeId = parseInt(results.rows.item(i).AccountTypeId);
			selectHtml += getAccountOpenOptGroupItem(results.rows.item(i).AccountTypeId, results.rows.item(i).AccountTypeName);
		} else if (oldAccountTypeId != parseInt(results.rows.item(i).AccountTypeId)) {
			oldAccountTypeId = parseInt(results.rows.item(i).AccountTypeId);
			selectHtml += getAccountCloseOptGroupItem();
			selectHtml += getAccountOpenOptGroupItem(results.rows.item(i).AccountTypeId, results.rows.item(i).AccountTypeName);
		}
		
		selectHtml += getAccountOptionItem(results.rows.item(i).AccountId, results.rows.item(i).AccountName);
	}
	
	if (selectHtml != '') {
		selectHtml += getAccountCloseOptGroupItem();
		selectHtmlAccTo = '<optgroup id="accgroupid-0" label="Clear AccountIdTo">';
		selectHtmlAccTo += '<option value="0">&nbsp;</option>';
		selectHtmlAccTo += '</optgroup>';
		selectHtmlAccTo += selectHtml;
	}
	
	selectAccId.append(selectHtml);
	selectAccIdTo.append(selectHtmlAccTo);
	
	selectAccId.selectmenu("refresh").trigger("change");;
	selectAccIdTo.selectmenu("refresh").trigger("change");;
	
	phetbudPageHideLoading();
}

function queryTransactionEditForm(tx) {
	var sqlCat = 'SELECT ts.*, tst.TransactionTypeUse FROM Transactions ts, TransactionTypes tst WHERE ts.TransactionTypeId = tst.TransactionTypeId AND TransactionId = ' + TransactionEditId;
	tx.executeSql(sqlCat, [], queryTransactionEditFormSuccess, phetbudDefaultError);
}

function queryTransactionEditFormSuccess(tx, results) {
	TransactionEdit = null;
//	window.localStorage.setItem("TransactionEdit", results.rows.item(0));
//	TransactionEdit = window.localStorage.getItem("TransactionEdit");
	TransactionEdit = results.rows.item(0);
}

function setTransactionFormEdit() {
	phetbudPageShowLoading();
	
	//console.log('in set edit');

	var db = getPhetbudAppDB();
	db.transaction(queryTransactionEditForm, errorSetTransactionForm);
	
	if (TransactionEdit != null) {
		console.log('in TransactionEdit');
		
		var transTypeEdit = TransactionEdit.TransactionTypeUse;
		console.log('radio : ' + transTypeEdit);
		var incomeRadio = $('#transactionPage').find('#radio-transactionType1');
		var expenseRadio = $('#transactionPage').find('#radio-transactionType2');
		var transferRadio = $('#transactionPage').find('#radio-transactionType3');
		
		if (transTypeEdit == 0 || transTypeEdit == 3) {
			
			incomeRadio.attr('checked', true).checkboxradio("refresh");
			expenseRadio.attr('checked', false).checkboxradio("refresh");
			transferRadio.attr('checked', false).checkboxradio("refresh");
			setSelectMenuSubCategory(SUBCATEGORY_INCOME_ITEMS);
			
		} else if (transTypeEdit == 1 || transTypeEdit == 4) {
			
			incomeRadio.attr('checked', false).checkboxradio("refresh");
			expenseRadio.attr('checked', true).checkboxradio("refresh");
			transferRadio.attr('checked', false).checkboxradio("refresh");
			setSelectMenuSubCategory(SUBCATEGORY_EXPENSE_ITEMS);
			
		} else if (transTypeEdit == 2 || transTypeEdit == 5) {
			
			incomeRadio.attr('checked', false).checkboxradio("refresh");
			expenseRadio.attr('checked', false).checkboxradio("refresh");
			transferRadio.attr('checked', true).checkboxradio("refresh");
			setSelectMenuSubCategory(SUBCATEGORY_TRANSFER_ITEMS);
			
			var divAccountIdTo = $('#transactionPage').find('#div-AccountIdTo');
			divAccountIdTo.show();
			$('#transactionPage').find('#selectAccountIdTo').val('' + TransactionEdit.AccountIdTo);
			$('#transactionPage').find('#selectAccountIdTo').selectmenu("refresh");
		}
		
		console.log('account id : ' + TransactionEdit.AccountId);
		
		var selectAccountId = $('#transactionPage').find('#selectAccountId');
		selectAccountId.val("" + TransactionEdit.AccountId);
		selectAccountId.selectmenu("refresh");
		
		console.log('subcatid : ' + TransactionEdit.SubCategoryId);
		console.log('before subcat');
		
		var selectSubCat = $('#transactionPage').find('#selectSubCategories');
		selectSubCat.val("" + TransactionEdit.SubCategoryId);
		selectSubCat.selectmenu("refresh");
		$('#transactionPage').find('#aSubCategories').siblings('.ui-btn-inner').children('.ui-btn-text').text($('#transactionPage').find('#selectSubCategories').find(":selected").text());
		
		console.log('active date : ' + TransactionEdit.TransActiveDate);
		
		var trDateBox = getTransactionDateBox();
		trDateBox.val(TransactionEdit.TransActiveDate);
		trDateBox.data('datebox').theDate = Date.parseString(TransactionEdit.TransActiveDate, 'yyyy-MM-dd');
		trDateBox.datebox('refresh');
		
		console.log('before amount');
		
		$('#transactionPage').find('#transactionAmount').val( (Math.round((parseFloat(TransactionEdit.TransactionAmount + '', 10)) * 100) / 100).toFixed(2));
		$('#transactionPage').find('#transactionRemark').val(TransactionEdit.TransactionRemark);
		
		console.log('before div mode');
		
		$('#transactionPage').find('#div-buttonAddMode').hide();
		$('#transactionPage').find('#div-buttonEditMode').show();
		
	} else {
		alert('เกิดข้อผิดพลาดในการค้นหา');
		history.back();
	}
	
	phetbudPageHideLoading();
}

function defaultError(err) {
	console.log("Error processing SQL program database : " + err);
	alert('not success');
	phetbudPageHideLoading();
}

function insertUpdateSuccess() {
	
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
			tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
		} else if (TransactionEdit.TransactionTypeUse == '1' || TransactionEdit.TransactionTypeUse == '4') {
			var upBalSql = getSQLUpdateAccountBalance(accountId, '0', transactionAmount);
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
		} else if (TransactionEdit.TransactionTypeUse == '2' || TransactionEdit.TransactionTypeUse == '5') {
			var upBalOutSql = getSQLUpdateAccountBalance(accountId, '0', transactionAmount);
			console.log(upBalOutSql);
			tx.executeSql(upBalOutSql, [], insertUpdateSuccess, defaultError);
			var upBalInSql = getSQLUpdateAccountBalance(accountIdTo, '1', transactionAmount);
			console.log(upBalInSql);
			tx.executeSql(upBalInSql, [], insertUpdateSuccess, defaultError);
		}
	}
	
	console.log(sql);
	
	tx.executeSql(sql, [], deleteTransactionSuccess, defaultError);
	
}

function deleteTransactionSuccess() {
	clearTransactionForm();
	setTransactionForm();
	
	alert("ลบข้อมูลเรียบร้อย");
}

function deleteTransaction() {
	isBlockPageshow = true;
	if (TransactionEdit.TransRecurrType == '' || TransactionEdit.TransRecurrType == null) {
		if (confirm("ต้องการลบรายการนี้?")) {
			var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
			db.transaction(queryDeleteTransaction, defaultError);
		}
	} else {
		// if it is part of recurr transaction, show all transaction and ask to delete them?
		isBlockPageshow = true;
		$('#transactionPage').find('#deleteDialog').click();
	}
}

function getSQLInsertTransaction(TransactionTypeId, AccountId, AccountIdTo,
		SubCategoryId, TransactionDate, TransactionAmount, TransactionRemark,
		TransActiveStatus, TransActiveDate, TransRecurrStart, TransRecurrEnd,
		TransRecurrType, TransRecurrValue, TransRecurrOrgId, TransRecurrNextId) {
	return 'INSERT INTO Transactions ( TransactionTypeId, AccountId, AccountIdTo'
			+ ', SubCategoryId, TransactionDate, TransactionAmount, TransactionRemark'
			+ ', TransActiveStatus, TransActiveDate, TransRecurrStart, TransRecurrEnd'
			+ ', TransRecurrType, TransRecurrValue, TransRecurrOrgId, TransRecurrNextId)'
			+ ' VALUES ( '
			+ TransactionTypeId
			+ ', '
			+ AccountId
			+ ', '
			+ AccountIdTo
			+ ', '
			+ SubCategoryId
			+ ', '
			+ '"'
			+ TransactionDate
			+ '", '
			+ TransactionAmount
			+ ', '
			+ '"'
			+ TransactionRemark
			+ '", '
			+ '"'
			+ TransActiveStatus
			+ '", '
			+ '"'
			+ TransActiveDate
			+ '", '
			+ '"'
			+ TransRecurrStart
			+ '", '
			+ '"'
			+ TransRecurrEnd
			+ '", '
			+ '"'
			+ TransRecurrType
			+ '", '
			+ '"'
			+ TransRecurrValue
			+ '", '
			+ TransRecurrOrgId + ', ' + TransRecurrNextId + ' ' + ') ';
}

function errorInsertTransaction(err) {
	console.log("Error processing SQL program database : " + err);
	phetbudPageHideLoading();
	alert('Failed to insert transaction');
	return true;
}

function insertTransactionSuccess() {
	phetbudPageHideLoading();

	if (confirm('save success!!! do you want to add more?')) {
		clearTransactionForm();
	} else {
		history.back();
	}
}

function insertTransaction(tx) {
	var TransactionTypeId = $('#transactionPage').find(
			'input[name=radio-transactionType]:checked').val();
	var AccountId = $('#transactionPage').find('#selectAccountId').val();
	var AccountIdTo = $('#transactionPage').find('#selectAccountIdTo').val();
	var SubCategoryId = $('#transactionPage').find('#selectSubCategories').val();
	var TransactionDate = $.trim(getTransactionDateBox().val());
	var TransactionAmount = $.trim($('#transactionPage').find('#transactionAmount').val());
	var TransactionRemark = $.trim($('#transactionPage').find('#transactionRemark').val());
	var TransActiveStatus = $('#transactionPage').find('input[name=radio-transActiveStatus]:checked').val();
	var TransActiveDate = $.trim(getTransActiveDateBox().val());
	var TransRecurrStart = $.trim(getTransRecurrStartDateBox().val());
	var TransRecurrEnd = $.trim(getTransRecurrEndDateBox().val());
	var TransRecurrType = ''; // $('#transactionPage').find('#').val();
	var TransRecurrValue = ''; // $('#transactionPage').find('#').val();
	var TransRecurrOrgId = null; // $('#transactionPage').find('#').val();
	var TransRecurrNextId = null; // $('#transactionPage').find('#').val();

	var sql = getSQLInsertTransaction(TransactionTypeId, AccountId,
			AccountIdTo, SubCategoryId, TransactionDate, TransactionAmount,
			TransactionRemark, TransActiveStatus, TransActiveDate,
			TransRecurrStart, TransRecurrEnd, TransRecurrType,
			TransRecurrValue, TransRecurrOrgId, TransRecurrNextId);

	console.log(sql);

	tx.executeSql(sql, [], insertTransactionSuccess, errorInsertTransaction);
}

function saveTransaction() {
	
	if (mode == 'add') {
		isBlockPageshow = true;
		$('#transactionPage').find('#confirmDialog').click();
	} else if (mode == 'edit') {
		editTransaction();
	}

}

function queryUpdateTransaction(tx) {
	var newTransactionTypeId = $('#transactionPage').find('input[name=radio-transactionType]:checked').val();
	var newAccountId = $('#transactionPage').find('#selectAccountId').val();
	var newAccountIdTo = $('#transactionPage').find('#selectAccountIdTo').val();
	var newSubCategoryId = $('#transactionPage').find('#selectSubCategories').val();
	var newTransactionDate = $.trim($("#transactionPage").find("#transactionDateBox").val());
	var newTransactionAmount = $.trim($('#transactionPage').find('#transactionAmount').val());
	var newTransactionRemark = $.trim($('#transactionPage').find('#transactionRemark').val());
	var newTransActiveStatus = 'N';
	
	var systemCurrentDate = new Date();
	var mainTransActiveDate = Date.parseString(newTransactionDate, 'yyyy-MM-dd');
	
	if (systemCurrentDate.isAfter(mainTransActiveDate) || systemCurrentDate.equalsIgnoreTime(mainTransActiveDate)) {
		newTransActiveStatus = 'Y';
	}
	
	if (TransactionEdit.TransActiveStatus == 'Y') {
		if (TransactionEdit.TransactionTypeUse == '0' || TransactionEdit.TransactionTypeUse == '3') {
			var upBalSql = getSQLUpdateAccountBalance(TransactionEdit.AccountId, '1', (Math.round((parseFloat(TransactionEdit.TransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
		} else if (TransactionEdit.TransactionTypeUse == '1' || TransactionEdit.TransactionTypeUse == '4') {
			var upBalSql = getSQLUpdateAccountBalance(TransactionEdit.AccountId, '0', (Math.round((parseFloat(TransactionEdit.TransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
		} else if (TransactionEdit.TransactionTypeUse == '2' || TransactionEdit.TransactionTypeUse == '5') {
			var upBalOutSql = getSQLUpdateAccountBalance(TransactionEdit.AccountId, '0', (Math.round((parseFloat(TransactionEdit.TransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalOutSql);
			tx.executeSql(upBalOutSql, [], insertUpdateSuccess, defaultError);
			var upBalInSql = getSQLUpdateAccountBalance(TransactionEdit.AccountIdTo, '1', (Math.round((parseFloat(TransactionEdit.TransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalInSql);
			tx.executeSql(upBalInSql, [], insertUpdateSuccess, defaultError);
		}
	}
	
	if (newTransActiveStatus == 'Y') {
		if (newTransactionTypeId == '0' || newTransactionTypeId == '3') {
			var upBalSql = getSQLUpdateAccountBalance(newAccountId, '0', (Math.round((parseFloat(newTransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
		} else if (newTransactionTypeId == '1' || newTransactionTypeId == '4') {
			var upBalSql = getSQLUpdateAccountBalance(newAccountId, '1', (Math.round((parseFloat(newTransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalSql);
			tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
		} else if (newTransactionTypeId == '2' || newTransactionTypeId == '5') {
			var upBalOutSql = getSQLUpdateAccountBalance(newAccountId, '1', (Math.round((parseFloat(newTransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalOutSql);
			tx.executeSql(upBalOutSql, [], insertUpdateSuccess, defaultError);
			var upBalInSql = getSQLUpdateAccountBalance(newAccountIdTo, '0', (Math.round((parseFloat(newTransactionAmount + '', 10)) * 100) / 100)); // utils
			console.log(upBalInSql);
			tx.executeSql(upBalInSql, [], insertUpdateSuccess, defaultError);
		}
	}
	
	var sql = 'UPDATE Transactions SET ';
	sql += ' TransactionTypeId = ' + (parseInt(newTransactionTypeId) + 1) + '';
	sql += ', AccountId = ' + newAccountId;
	sql += ', AccountIdTo = ' + newAccountIdTo;
	sql += ', SubCategoryId = ' + newSubCategoryId;
	sql += ', TransActiveDate = "' + newTransactionDate + '" ';
	sql += ', TransActiveStatus = "' + newTransActiveStatus + '" ';
	sql += ', TransactionRemark = "' + newTransactionRemark + '" ';
	sql += ', TransactionAmount = ' + (Math.round((parseFloat(newTransactionAmount + '', 10)) * 100 / 100)).toFixed(2);
	sql += ' WHERE TransactionId = ' + TransactionEdit.TransactionId;
	
	console.log(sql);
	
	tx.executeSql(sql, [], queryUpdateTransactionSuccess, defaultError);
}

function queryUpdateTransactionSuccess() {
	phetbudPageHideLoading();
	alert("บันทึกสำเร็จ");
	history.back();
}

function queryUpdateTransactionError(err) {
	phetbudPageHideLoading();
	console.log(err);
	alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
	return true;
}

function editTransaction() {
	phetbudPageShowLoading();
	
	var db =  getPhetbudAppDB();
	db.transaction(queryUpdateTransaction, queryUpdateTransactionError);
}

// $('#transactionPage').find('input[type=submit]').bind('submit',
// saveTransaction);

function backToPrevPage() {
	history.back();
}

$('#transactionPage').live(
		'pageshow',
		function(event, ui) {
			console.log('isBlock value : ' + isBlockPageshow);
			if (!isBlockPageshow && ui.prevPage.attr('id') !== undefined) {
				console.log($(this).data("url"));

				var query = $(this).data("url").split("?")[1];
				query = query.split("&");
				mode = query[0].replace("mode=", "");
				var trDate = query[1].replace("trDate=", "");
				var transactionId = '';

				var splTrDate = trDate.split("/");
				sDate = new Date(splTrDate[2], parseInt(splTrDate[1]) - 1,
						splTrDate[0]);
				console.log('show parse date : ' + sDate.format("dd/MM/yyyy"));

				$('#transactionPage').find('#transactionDateHeaderLabel').html(
						sDate.format("dd/MM/yyyy"));
				
				clearTransactionForm();
				setTransactionForm();
				
				console.log('prevPage : ' + ui.prevPage.attr('id'));

				// prevent back from deleteDialog and found deleted transactions
				if (!(ui.prevPage.attr('id') == 'transactionDeletePage' && TransactionEdit == null)) {
					if (mode == 'edit') {
						
						
						TransactionEditId = query[2].replace("trId=", "");
						//console.log('in edit');
						setTransactionFormEdit();
					} else {

					}
				} else {
					mode = 'add';
				}
				

				console.log('mode : ' + mode);
				console.log('trDate : ' + trDate);
				console.log('transactionId : ' + transactionId);
			} else {
				isBlockPageshow = false;
				
//				.selectStyle {
//					   width: 235px;
//					   height: 25px;
//					   overflow: hidden;
//					   background: url(yourArrow.png) no-repeat right #ccc;
//					}
			}
			
		});

$('#transactionPage').live('pagehide',function(event, ui) {
	isBlockPageshow = true;
});