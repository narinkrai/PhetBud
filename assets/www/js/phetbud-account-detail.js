var isBlock = false;
var mode = '';
var accountTypeId;
var accountId;
var nextAccountId;

$('#accountDetailPage').find('#popupAccountImage').bind({ popupafteropen: function(event, ui) { 
	isBlock = true;
}});

function onClickAccountImage(urlImage) {
	var imageHtml = '<img src="' + urlImage + '" width="50" height="50" />';
	$('#accountDetailPage').find('#accountIconImageButton').html(imageHtml);
	$('#accountDetailPage').find('#accountIconName').val(urlImage);
	console.log('image value : ' + $('#accountDetailPage').find('#accountIconName').val());
	$('#accountDetailPage').find('#popupAccountImage').popup( "close" );
}

function clearAccountDetailForm(){
	var cashRadio = $('#accountDetailPage').find('#radio-accountType1');
	var savingRadio = $('#accountDetailPage').find('#radio-accountType2');
	var chequeRadio = $('#accountDetailPage').find('#radio-accountType3');
	cashRadio.attr('checked', true).checkboxradio("refresh");
	savingRadio.attr('checked', false).checkboxradio("refresh");
	chequeRadio.attr('checked', false).checkboxradio("refresh");
	$('#accountDetailPage').find('#accountName').val('');
	$('#accountDetailPage').find('#accountOpenBalance').val('');
	$('#accountDetailPage').find('#accountOpenBalance').textinput('enable');
	$('#accountDetailPage').find('#accountOrderNo').val('');
	$('#accountDetailPage').find('#accountIconImageButton').html('Select Picture...');
	$('#accountDetailPage').find('#accountIconName').val('');
	
	
	$('#accountDetailPage').find('#div-accountBalanceCurAmount').hide();
	$('#accountDetailPage').find('#accountBalanceCurAmount').val('');
	
	$('#accountDetailPage').find('#div-accountBalancePeriodDateBox').hide();
	var accBalPeriodDateBox = $('#accountDetailPage').find('#accountBalancePeriodDateBox');
	var currDate = new Date();
	accBalPeriodDateBox.val(currDate.format("yyyy-MM-dd"));
	accBalPeriodDateBox.data('datebox').theDate = new Date(currDate);
	accBalPeriodDateBox.datebox('enable');
	accBalPeriodDateBox.datebox('refresh');
	
	$('#accountDetailPage').find('#div-accountBalanceAccuInAmount').hide();
	$('#accountDetailPage').find('#accountBalanceAccuInAmount').val('');
	
	$('#accountDetailPage').find('#div-accountBalanceAccuOutAmount').hide();
	$('#accountDetailPage').find('#accountBalanceAccuOutAmount').val('');
	
	$('#accountDetailPage').find('#div-buttonAddMode').show();
	$('#accountDetailPage').find('#div-buttonEditMode').hide();
	
	mode = '';
	accountTypeId = null;
	accountId = null;
	AccountEdit = null;
	nextAccountId = null;
}

function setRadioAccountType(accountTypeId) {
	var cashRadio = $('#accountDetailPage').find('#radio-accountType1');
	var savingRadio = $('#accountDetailPage').find('#radio-accountType2');
	var chequeRadio = $('#accountDetailPage').find('#radio-accountType3');
	
	if (accountTypeId == '1') {
		cashRadio.attr('checked', true).checkboxradio("refresh");
		savingRadio.attr('checked', false).checkboxradio("refresh");
		chequeRadio.attr('checked', false).checkboxradio("refresh");
	} else if (accountTypeId == '2') {
		cashRadio.attr('checked', false).checkboxradio("refresh");
		savingRadio.attr('checked', true).checkboxradio("refresh");
		chequeRadio.attr('checked', false).checkboxradio("refresh");
	} else if (accountTypeId == '3') {
		cashRadio.attr('checked', false).checkboxradio("refresh");
		savingRadio.attr('checked', false).checkboxradio("refresh");
		chequeRadio.attr('checked', true).checkboxradio("refresh");
	}
}

function queryAccountEditFormSuccess(tx, results) {
	AccountEdit = results.rows.item(0);
}

function errorSetAccountDetailForm(err) {
}

function queryAccountEditForm(tx){
	var sql = 'SELECT acc.AccountId, acc.AccountName, acc.AccountTypeId, acc.AccountIconName, acct.AccountTypeName, acct.AccountTypeUse, accb.AccountBalanceCurAmount ';
	sql += ' , acc.AccountOpenBalance , accb.AccountBalancePeriod, accb.AccountBalanceAccInAmount, accb.AccountBalanceAccOutAmount, acc.AccountOrderNo  ';
	sql += ' FROM Accounts acc , AccountTypes acct ,  AccountBalance accb ';
	sql += ' WHERE accb.AccountId = acc.AccountId AND acct.AccountTypeId = acc.AccountTypeId ';
	sql += ' AND acc.AccountId = ' + accountId;
	
	console.log(sql);
	
	tx.executeSql(sql, [], queryAccountEditFormSuccess, errorSetAccountDetailForm);
}

function setAccountDetailEditForm() {
	var db = getPhetbudAppDB();
	db.transaction(queryAccountEditForm, phetbudDefaultErrorCloseProgram);
	
	if (AccountEdit != null) {
		setRadioAccountType(AccountEdit.AccountTypeId);
		
		$('#accountDetailPage').find('#accountName').val(AccountEdit.AccountName);
		$('#accountDetailPage').find('#accountOpenBalance').val((Math.round((parseFloat(AccountEdit.AccountOpenBalance + '', 10)) * 100) / 100).toFixed(2));
		$('#accountDetailPage').find('#accountOpenBalance').textinput('disable');
		
		$('#accountDetailPage').find('#accountOrderNo').val(AccountEdit.AccountOrderNo + '');
		
		console.log('account imag ' + AccountEdit.AccountIconName);
		
		if (AccountEdit.AccountIconName == null || AccountEdit.AccountIconName === undefined || AccountEdit.AccountIconName == '') {
			$('#accountDetailPage').find('#accountIconImageButton').html('select picture ...');
			$('#accountDetailPage').find('#accountIconName').val('');
		} else {
			var imageHtml = '<img src="' + AccountEdit.AccountIconName + '" width="50" height="50" />';
			
			$('#accountDetailPage').find('#accountIconImageButton').html(imageHtml);
			$('#accountDetailPage').find('#accountIconName').val(AccountEdit.AccountIconName);
		}
		
		$('#accountDetailPage').find('#div-accountBalanceCurAmount').show();
		$('#accountDetailPage').find('#accountBalanceCurAmount').val((Math.round((parseFloat(AccountEdit.AccountBalanceCurAmount + '', 10)) * 100) / 100).toFixed(2));
		$('#accountDetailPage').find('#accountBalanceCurAmount').textinput('disable');
		
		$('#accountDetailPage').find('#div-accountBalancePeriodDateBox').show();
		var periodDate = Date.parseString(AccountEdit.AccountBalancePeriod, 'yyyy-MM-dd');
		var accBalPeriodDateBox = $('#accountDetailPage').find('#accountBalancePeriodDateBox');
		accBalPeriodDateBox.val(periodDate.format("yyyy-MM-dd"));
		accBalPeriodDateBox.data('datebox').theDate = new Date(periodDate);
		accBalPeriodDateBox.datebox('disable');
		accBalPeriodDateBox.datebox('refresh');
		
		$('#accountDetailPage').find('#div-accountBalanceAccuInAmount').show();
		$('#accountDetailPage').find('#accountBalanceAccuInAmount').val((Math.round((parseFloat(AccountEdit.AccountBalanceAccInAmount + '', 10)) * 100) / 100).toFixed(2));
		$('#accountDetailPage').find('#accountBalanceAccuInAmount').textinput('disable');
		
		$('#accountDetailPage').find('#div-accountBalanceAccuOutAmount').show();
		$('#accountDetailPage').find('#accountBalanceAccuOutAmount').val((Math.round((parseFloat(AccountEdit.AccountBalanceAccOutAmount + '', 10)) * 100) / 100).toFixed(2));
		$('#accountDetailPage').find('#accountBalanceAccuOutAmount').textinput('disable');
		
		$('#accountDetailPage').find('#div-buttonAddMode').hide();
		$('#accountDetailPage').find('#div-buttonEditMode').show();
	}
}

function validateAccountEditForm() {
	var errorMsg = '';
	
	if ($.trim($('#accountDetailPage').find('#accountName').val()) == '') {
		errorMsg += 'กรุณาระบุชื่อ \n';
	}
	
	if (errorMsg != '') {
		alert(errorMsg);
		return false;
	}
	
	return true;
}

function queryUpdateAccount(tx) {
	var accTypeId = $('#accountDetailPage').find('input[name=radio-accountType]:checked').val();
	var accName = $('#accountDetailPage').find('#accountName').val();
	var accOrderNo = 0;
	
	if ($.trim($('#accountDetailPage').find('#accountOrderNo')) != '') {
		accOrderNo = (Math.round((parseFloat($('#accountDetailPage').find('#accountOrderNo').val() + '', 10)) * 100) / 100);
	}
	
	var accIconName = $('#accountDetailPage').find('#accountIconName').val();
	
	var sqlUpdateAcc = 'UPDATE Accounts SET AccountName = "' + accName + '" , AccountTypeId = ' + accTypeId 
						+ ' , AccountOrderNo = ' + accOrderNo + ' , AccountIconName = "' + accIconName +'" WHERE AccountId = ' + AccountEdit.AccountId;
	
	tx.executeSql(sqlUpdateAcc, [], queryUpdateAccountSuccess, phetbudDefaultSuccess);
}

function editAccount() {
	
	if (validateAccountEditForm()) {
		phetbudPageShowLoading();
		
		var db =  getPhetbudAppDB();
		db.transaction(queryUpdateAccount, queryUpdateAccountError);
		db.transaction(querySetAccountItems, phetbudDefaultErrorCloseProgram);
	}
}

function queryUpdateAccountSuccess() {
	phetbudPageHideLoading();
	alert("บันทึกสำเร็จ");
	history.back();
}

function queryUpdateAccountError(err) {
	phetbudPageHideLoading();
	console.log(err);
	alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
	return true;
}

function validateAccountForm() {
	var errorMsg = '';
	
	if ($.trim($('#accountDetailPage').find('#accountName').val()) == '') {
		errorMsg += 'กรุณาระบุชื่อ \n';
	}
	
	if ($.trim($('#accountDetailPage').find('#accountOpenBalance').val()) == '') {
		errorMsg += 'กรุณาระบุเงินตั้งต้น \n';
	}
	
	if (errorMsg != '') {
		alert(errorMsg);
		return false;
	}
	
	return true;
}

function findNextAccountsIdSuccess(tx, results) {
	nextAccountId = null;
	for ( var i = 0; i < results.rows.length; i++) {
		nextAccountId = parseInt(results.rows.item(i).seq);
		nextAccountId = nextAccountId + 1;
	}
	 
}

function insertAccount(tx) {
	var accTypeId = $('#accountDetailPage').find('input[name=radio-accountType]:checked').val();
	var accName = $('#accountDetailPage').find('#accountName').val();
	var accOpenBal = (Math.round((parseFloat($('#accountDetailPage').find('#accountOpenBalance').val() + '', 10)) * 100) / 100);
	var accOrderNo = 0;
	
	if ($.trim($('#accountDetailPage').find('#accountOrderNo')) != '') {
		accOrderNo = (Math.round((parseFloat($('#accountDetailPage').find('#accountOrderNo').val() + '', 10)) * 100) / 100);
	}
	
	var accBal = accOpenBal;
	var accIconName = $('#accountDetailPage').find('#accountIconName').val();
	var accBalPeriod = $('#accountDetailPage').find('#accountBalancePeriodDateBox').data('datebox').theDate.format("yyyy-MM-dd");
	var accBalAccIn = 0.00;
	var accBalAccOut = 0.00;
	
	if (accOpenBal >= 0.00) {
		accBalAccIn = accOpenBal;
	} else {
		accBalAccOut = accOpenBal;
	}
	
	var sqlNextAccId = 'SELECT * FROM SQLITE_SEQUENCE WHERE name = "Accounts"';
	tx.executeSql(sqlNextAccId, [], findNextAccountsIdSuccess, phetbudDefaultError);
	
	if (nextAccountId != null) {
		var sqlAcc = 'INSERT INTO Accounts ( AccountTypeId, AccountName, AccountOpenBalance, AccountIconName, AccountOrderNo) VALUES ( ' 
			+ accTypeId 
			+ ', "' + accName + '" ' 
			+ ', ' + accOpenBal.toFixed(2) 
			+ ', "' + accIconName + '" ' 
			+ ', ' + accOrderNo + ')';
		
		var sqlAccBal = 'INSERT INTO AccountBalance (AccountId, AccountBalancePeriod, AccountBalanceCurAmount, AccountBalanceAccInAmount, AccountBalanceAccOutAmount) VALUES' 
			+ ' (' + nextAccountId 
			+ ', "' + accBalPeriod + '" ' 
			+ ', ' + accBal.toFixed(2) + ', ' + accBalAccIn.toFixed(2) + ', ' + accBalAccOut + ') ';
		
		console.log(sqlAcc);
		console.log(sqlAccBal);
		
		tx.executeSql(sqlAcc, [], phetbudDefaultSuccess, phetbudDefaultError);
		tx.executeSql(sqlAccBal, [], phetbudDefaultSuccess, phetbudDefaultError);
		
		insertAccountSuccess();
	} else {
		alert('เกิดข้อผิดพลาดในการบันทึก');
	}
	
	
}

function insertAccountSuccess() {
	phetbudPageHideLoading();

	history.back();
}

function insertAccountFailed(err) {
	alert('เกิดข้อผิดพลาดในการบันทึก');
	return true;
}

function saveAccount() {
	if (validateAccountForm())  {
		var db = getPhetbudAppDB();
		db.transaction(insertAccount, insertAccountFailed);
		db.transaction(querySetAccountItems, phetbudDefaultErrorCloseProgram);
	}
}

$('#accountDetailPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		
		console.log('unblock');
		
		clearAccountDetailForm();
		
		var query = $(this).data("url").split("?")[1];
		query = query.split("&");
		mode = query[0].replace("mode=", "");
		
		if (mode == 'add') {
			
			
			var accountTypeId = query[1].replace("AccountTypeId=", "");
			setRadioAccountType(accountTypeId);
			
			$('#accountDetailPage').find('#accountDetailStatus').html('Add Account');
			
			
		} else if (mode == 'edit') {
			
			$('#accountDetailPage').find('#accountDetailStatus').html('Edit Account');
			 
			accountId = query[1].replace("AccountId=", "");
			
			setAccountDetailEditForm();
			
		}
		
		phetbudPageHideLoading();
	} else {
		isBlock = false;
		
	}
});