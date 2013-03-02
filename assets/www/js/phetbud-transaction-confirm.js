var isBlockPageshow = false;
var nextAutoTransId = 0;

$('#transactionConfirmPage').find('#select-tranRecurrType').on( "change", function(event, ui) {
	isBlockPageshow = true;
	
	checkShowDivBySelect();
});

$('#transactionConfirmPage').find('#select-tranRecurrType').on( "blur", function(event, ui) {
	isBlockPageshow = true;
});

function checkShowDivBySelect() {
	var selTranRecurr = $('#transactionConfirmPage').find('#select-tranRecurrType');
	
	if (selTranRecurr.val() == 'D') {
		clearDivByDate();
		
		clearDivByDay();
		
		$('#transactionConfirmPage').find('#div-recurrStartDate').show();
		$('#transactionConfirmPage').find('#div-recurrEndDate').show();
	} else if (selTranRecurr.val() == 'W') {
		clearDivByDay();
		$('#transactionConfirmPage').find('#div-ByDate').show();
		$('#transactionConfirmPage').find('#div-recurrStartDate').show();
		$('#transactionConfirmPage').find('#div-recurrEndDate').show();
	} else if (selTranRecurr.val() == 'M') {
		clearDivByDate();
		$('#transactionConfirmPage').find('#div-byDay').show();
		$('#transactionConfirmPage').find('#div-recurrStartDate').show();
		$('#transactionConfirmPage').find('#div-recurrEndDate').show();
	}
}

//$("#transactionConfirmPage").on("click","#lblCheckRecurr",function(eventObj) {
//	console.log('event fire');
//	console.log('value of label val : ' + $("#transactionConfirmPage").find('#lblCheckRecurr').val());
//	console.log('value of label is checked : ' + $("#transactionConfirmPage").find('#lblCheckRecurr').is(':checked'));
//	if ($('#transactionConfirmPage').find('#checkbox-recurr').is(':checked')) {
//		console.log('show');
//		$('#transactionConfirmPage').find('#div-tranRecurrType').show();
//	} else {
//		clearDivByDate();
//		console.log('hide');
//	}
//    //do code here. 
//    eventObj.preventDefault();
//});

$('#transactionConfirmPage').find('#checkbox-recurr').on( "change", function(event, ui) {
	if ($('#transactionConfirmPage').find('#checkbox-recurr').is(':checked')) {
		$('#transactionConfirmPage').find('#div-tranRecurrType').show();
		checkShowDivBySelect();
	} else {
		clearTranRecurrType();
	}
});


function clearDivByDate() {
	$('#transactionConfirmPage').find('#div-ByDate').hide();
	$('#transactionConfirmPage').find('#checkbox-monday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-tuesday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-wendesday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-thursday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-friday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-saturnday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-sunday').attr('checked',false);
	$('#transactionConfirmPage').find('#checkbox-monday').checkboxradio("refresh");
	$('#transactionConfirmPage').find('#checkbox-tuesday').checkboxradio("refresh");
	$('#transactionConfirmPage').find('#checkbox-wendesday').checkboxradio("refresh");
	$('#transactionConfirmPage').find('#checkbox-thursday').checkboxradio("refresh");
	$('#transactionConfirmPage').find('#checkbox-friday').checkboxradio("refresh");
	$('#transactionConfirmPage').find('#checkbox-saturnday').checkboxradio("refresh");
	$('#transactionConfirmPage').find('#checkbox-sunday').checkboxradio("refresh");
}

function clearDivByDay() {
	$('#transactionConfirmPage').find('#div-byDay').hide();
	$('#transactionConfirmPage').find('#txtByDay').val('');
}

function clearRecurrDate() {
	$('#transactionConfirmPage').find('#div-recurrStartDate').hide();
	$("#transactionConfirmPage").find("#transRecurrStartDateBox").val('');
	$('#transactionConfirmPage').find('#div-recurrEndDate').hide();
	$("#transactionConfirmPage").find("#transRecurrEndDateBox").val('');
}

function clearTranRecurrType() {
	$('#transactionConfirmPage').find('#div-tranRecurrType').hide();
	var selTranCurrType = $('#transactionConfirmPage').find('#select-tranRecurrType');
	selTranCurrType.attr('selectedIndex', -1);
	selTranCurrType.selectmenu("refresh");
	
	clearDivByDate();
	
	clearDivByDay();
	
	clearRecurrDate();
}

function clearConfirmPage() {
	clearTranRecurrType();
}

function concatRecurrValue(str, dvalue) {
	return $.trim(str.length) > 0 ? (str +',' + dvalue) : dvalue;
}

function foundDatediffIndays(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2-t1)/(24*3600*1000));
}

function validateSave(TransactionTypeId, AccountId, AccountIdTo, TransRecurrStart, TransRecurrEnd, TransRecurrType) {
	var errValidMsg = '';
	
	if (TransactionTypeId == '2' || TransactionTypeId == '5') {
		if ($.trim(AccountIdTo) == '' || $.trim(AccountIdTo) == '0') errValidMsg += 'กรูณาระบุ AccountIdTo \n';
	}
	
	if (TransRecurrType == 'D' || TransRecurrType == 'W' || TransRecurrType == 'M') {
		if ($.trim(TransRecurrStart) == '') errValidMsg += 'กรูณาระบุวันที่เริ่มต้น \n';
		if ($.trim(TransRecurrEnd) == '') errValidMsg += 'กรูณาระบุวันที่สิ้นสุด \n';
		
		if (($.trim(TransRecurrStart) != '' && $.trim(TransRecurrEnd) != '')) {
			var stDate = Date.parseString(TransRecurrStart, 'yyyy-MM-dd');
			var enDate = Date.parseString(TransRecurrEnd, 'yyyy-MM-dd');
			
			if (stDate.isAfter(enDate)) {
				errValidMsg += 'กรูณาระบุวันที่เริ่มต้น กับ สิ้นสุดให้ถูกต้อง \n';
			}
		}
	}
	
	return errValidMsg;
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

	history.back();
}

function insertUpdateSuccess() {
	
}

function defaultError(err) {
	console.log("Error processing SQL program database : " + err);
	alert('Failed to insert transaction');
}

function findNextTransactionIdSuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);
	
	for ( var i = 0; i < results.rows.length; i++) {
		console.log('table name : ' + results.rows.item(i).name);
		console.log('Next Transaction Id = ' + results.rows.item(i).seq);
		nextAutoTransId = parseInt(results.rows.item(i).seq);
	}
}

function insertTransaction(tx) {
	var TransactionTypeId = $('#transactionPage').find(
			'input[name=radio-transactionType]:checked').val();
	var AccountId = $('#transactionPage').find('#selectAccountId').val();
	var AccountIdTo = $('#transactionPage').find('#selectAccountIdTo').val();
	var SubCategoryId = $('#transactionPage').find('#selectSubCategories').val();
	var TransactionDate = $.trim($("#transactionPage").find("#transactionDateBox").val());
	var TransactionAmount = $.trim($('#transactionPage').find('#transactionAmount').val());
	var TransactionRemark = $.trim($('#transactionPage').find('#transactionRemark').val());
	var TransActiveStatus = $('#transactionPage').find('input[name=radio-transActiveStatus]:checked').val();
	var TransActiveDate = $.trim($("#transactionPage").find("#transActiveDateBox").val());
	var TransRecurrStart = '';//$.trim($("#transactionConfirmPage").find("#transRecurrStartDateBox").val(''));
	var TransRecurrEnd = '';//$.trim($("#transactionConfirmPage").find("#transRecurrEndDateBox").val(''));
	var TransRecurrType = ''; // $('#transactionPage').find('#').val();
	var TransRecurrValue = ''; // $('#transactionPage').find('#').val();
	var TransRecurrOrgId = null; // $('#transactionPage').find('#').val();
	var TransRecurrNextId = null; // $('#transactionPage').find('#').val();
	
	var selTranRecurr = $('#transactionConfirmPage').find('#select-tranRecurrType');
	var systemCurrentDate = new Date();
	var mainTransActiveDate = Date.parseString(TransactionDate, 'yyyy-MM-dd');
	
	var transactionAmountAccum = 0.00;
	if (systemCurrentDate.isAfter(mainTransActiveDate) || systemCurrentDate.equalsIgnoreTime(mainTransActiveDate)) {
		TransActiveStatus = 'Y';
		transactionAmountAccum = Math.round((parseFloat(transactionAmountAccum + '', 10) + parseFloat(TransactionAmount + '', 10)) * 100) / 100;
	} else {
		TransActiveStatus = 'N';
	}
	
	
	var nextTransActiveStatus = '';
	
	var errValidMsg = '';
	
	if ($('#transactionConfirmPage').find('#checkbox-recurr').is(':checked')) {
		errValidMsg = validateSave(TransactionTypeId, AccountId, AccountIdTo, $("#transactionConfirmPage").find("#transRecurrStartDateBox").val(), $("#transactionConfirmPage").find("#transRecurrEndDateBox").val(), selTranRecurr.val());
		
	} else {
		errValidMsg = validateSave(TransactionTypeId, AccountId, AccountIdTo, '', '', '');
	}
	
	if ($.trim(errValidMsg) != '') {
		alert(errValidMsg);
		phetbudPageHideLoading();
		return;
	}
	
	
	var subSql = new Array();
	
	if ($('#transactionConfirmPage').find('#checkbox-recurr').is(':checked')) {
		
		TransactionTypeId = (parseInt(TransactionTypeId) + 3) + ''; // if select recurr then add 3 (recurrIncome = 3, recurrExpense = 4 ...)
		
		nextAutoTransId = 0;
		
		var sqlFindNextAutoTransId = 'SELECT * FROM SQLITE_SEQUENCE WHERE name = "Transactions"';
		tx.executeSql(sqlFindNextAutoTransId, [], findNextTransactionIdSuccess, defaultError);
		
		if (nextAutoTransId <= 0) {
			console.log('error find next id');
			return;
		}
		
		nextAutoTransId = nextAutoTransId + 1;
		
		
		var recurrStartD = $("#transactionConfirmPage").find("#transRecurrStartDateBox");
		var recurrEndD = $("#transactionConfirmPage").find("#transRecurrEndDateBox");
		
		TransRecurrStart = $.trim(recurrStartD.val());
		TransRecurrEnd = $.trim(recurrEndD.val());
		
		if (selTranRecurr.val() == 'D') {
			
			TransRecurrType = selTranRecurr.val();
			TransRecurrValue = '';
			
			var dateDiff = foundDatediffIndays(recurrStartD.data('datebox').theDate, recurrEndD.data('datebox').theDate);
			var calDate = new Date(recurrStartD.data('datebox').theDate);
			for ( var i = 0; i <= dateDiff; i++) {
				
				nextTransActiveStatus = 'N';
				if (systemCurrentDate.isAfter(calDate) || systemCurrentDate.equalsIgnoreTime(calDate)) {
					nextTransActiveStatus = 'Y';
					transactionAmountAccum = Math.round((parseFloat(transactionAmountAccum + '', 10) + parseFloat(TransactionAmount + '', 10)) * 100) / 100;
				}
				
				subSql[subSql.length] = getSQLInsertTransaction((parseInt(TransactionTypeId) + 1) + '', AccountId,
						AccountIdTo, SubCategoryId, systemCurrentDate.format("yyyy-MM-dd"), TransactionAmount,
						TransactionRemark, nextTransActiveStatus, calDate.format("yyyy-MM-dd"),
						TransRecurrStart, TransRecurrEnd, TransRecurrType,
						TransRecurrValue, nextAutoTransId, TransRecurrNextId);
				
				calDate = calDate.add('d', 1);
				
			}
			
		} else if (selTranRecurr.val() == 'W') {
			
			TransRecurrType = selTranRecurr.val();
			
			if ($('#transactionConfirmPage').find('#checkbox-monday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'M');
			}
			if ($('#transactionConfirmPage').find('#checkbox-tuesday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'T');
			}
			if ($('#transactionConfirmPage').find('#checkbox-wednesday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'W');
			}
			if ($('#transactionConfirmPage').find('#checkbox-thursday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'TH');
			}
			if ($('#transactionConfirmPage').find('#checkbox-friday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'F');
			}
			if ($('#transactionConfirmPage').find('#checkbox-saturnday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'S');
			}
			if ($('#transactionConfirmPage').find('#checkbox-sunday').is(':checked')) {
				TransRecurrValue = concatRecurrValue(TransRecurrValue, 'SU');
			}
			
			var dateDiff = foundDatediffIndays(recurrStartD.data('datebox').theDate, recurrEndD.data('datebox').theDate);
			var calDate = new Date(recurrStartD.data('datebox').theDate);
			
			console.log('date diff : ' +  dateDiff);
			
			var calDateName = '';
			var recurrDName = TransRecurrValue.split(',');
			
			for ( var i = 0; i < dateDiff; i++) {
				calDate = calDate.add('d', 1);
				
				if (calDate.getDayAbbreviation() == 'Mon') calDateName = 'M';
				if (calDate.getDayAbbreviation() == 'Tue') calDateName = 'T';
				if (calDate.getDayAbbreviation() == 'Wed') calDateName = 'W';
				if (calDate.getDayAbbreviation() == 'Thu') calDateName = 'TH';
				if (calDate.getDayAbbreviation() == 'Fri') calDateName = 'F';
				if (calDate.getDayAbbreviation() == 'Sat') calDateName = 'S';
				if (calDate.getDayAbbreviation() == 'Sun') calDateName = 'SU';
				
				if ($.inArray(calDateName, recurrDName) > -1) {
					var recurrDInsert = new Date(calDate);
					
					nextTransActiveStatus = 'N';
					if (systemCurrentDate.isAfter(recurrDInsert) || systemCurrentDate.equalsIgnoreTime(recurrDInsert)) {
						nextTransActiveStatus = 'Y';
						transactionAmountAccum = Math.round((parseFloat(transactionAmountAccum + '', 10) + parseFloat(TransactionAmount + '', 10)) * 100) / 100;
					}
					
					subSql[subSql.length] = ' ' + getSQLInsertTransaction((parseInt(TransactionTypeId) + 1) + '', AccountId,
							AccountIdTo, SubCategoryId, systemCurrentDate.format("yyyy-MM-dd"), TransactionAmount,
							TransactionRemark, nextTransActiveStatus, recurrDInsert.format("yyyy-MM-dd"),
							TransRecurrStart, TransRecurrEnd, TransRecurrType,
							TransRecurrValue, nextAutoTransId, TransRecurrNextId);
				}
				
			}
			
		} else if (selTranRecurr.val() == 'M') {
			
			TransRecurrType = selTranRecurr.val();
			TransRecurrValue = $('#transactionConfirmPage').find('#txtByDay').val();
			
			var recurrd = TransRecurrValue.split(',');
			
			var isExceed = false;
			var tempStartDate = new Date(recurrStartD.data('datebox').theDate);
			tempStartDate = Date.parseString(tempStartDate.format("yyyy-MM") + '-01', 'yyyy-MM-dd');
			var startRecurrDate = new Date(recurrStartD.data('datebox').theDate);
			var endRecurrDate = new Date(recurrEndD.data('datebox').theDate);
			
			
			
			while(!isExceed) {
				
				console.log('current run date : ' + tempStartDate.format("yyyy-MM-dd"));
				
				for ( var i = 0; i < recurrd.length; i++) {
					
					var ddValue = recurrd[i].length == 1 ? ('0' + recurrd[i]) : recurrd[i];
					
					if (Date.isValid(tempStartDate.format("yyyy-MM") + '-' + ddValue, 'yyyy-MM-dd')) {
						var insertDate = Date.parseString(tempStartDate.format("yyyy-MM") + '-' + ddValue, 'yyyy-MM-dd');
						
						console.log('before insert valid : ' + insertDate.format("yyyy-MM-dd"));
						
						if ((startRecurrDate.isBefore(insertDate) || startRecurrDate.equalsIgnoreTime(insertDate) ) 
								&& 
								(endRecurrDate.isAfter(insertDate) || endRecurrDate.equalsIgnoreTime(insertDate))) {
							console.log('insert date : ' + insertDate.format("yyyy-MM-dd"));
							
							nextTransActiveStatus = 'N';
							if (systemCurrentDate.isAfter(insertDate) || systemCurrentDate.equalsIgnoreTime(insertDate)) {
								nextTransActiveStatus = 'Y';
								transactionAmountAccum = Math.round((parseFloat(transactionAmountAccum + '', 10) + parseFloat(TransactionAmount + '', 10)) * 100) / 100;
							}
							
							subSql[subSql.length] = ' ' + getSQLInsertTransaction((parseInt(TransactionTypeId) + 1) + '', AccountId,
									AccountIdTo, SubCategoryId, systemCurrentDate.format("yyyy-MM-dd"), TransactionAmount,
									TransactionRemark, 'N', insertDate.format("yyyy-MM-dd"),
									TransRecurrStart, TransRecurrEnd, TransRecurrType,
									TransRecurrValue, nextAutoTransId, TransRecurrNextId);
							
						} else if (endRecurrDate.isBefore(insertDate)) {
							isExceed = true;
						}
						
						
						if (i > 100) isExceed = true;
						
					}
				}
				
				tempStartDate = tempStartDate.add('M', 1);
			}
		}
	}

	var sql = getSQLInsertTransaction((parseInt(TransactionTypeId) +1) + '', AccountId,
			AccountIdTo, SubCategoryId, systemCurrentDate.format("yyyy-MM-dd"), TransactionAmount,
			TransactionRemark, TransActiveStatus, TransactionDate,
			TransRecurrStart, TransRecurrEnd, TransRecurrType,
			TransRecurrValue, TransRecurrOrgId, TransRecurrNextId);
	
	tx.executeSql(sql, [], insertUpdateSuccess, defaultError);
	console.log('================================insert========================');
	console.log(sql);
	
	if (TransactionTypeId == '0' || TransactionTypeId == '3') {
		var upBalSql = getSQLUpdateAccountBalance(AccountId, '0', transactionAmountAccum); // utils
		console.log(upBalSql);
		tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
	} else if (TransactionTypeId == '1' || TransactionTypeId == '4') {
		var upBalSql = getSQLUpdateAccountBalance(AccountId, '1', transactionAmountAccum); // utils
		console.log(upBalSql);
		tx.executeSql(upBalSql, [], insertUpdateSuccess, defaultError);
	} else if (TransactionTypeId == '2' || TransactionTypeId == '5') {
		var upBalOutSql = getSQLUpdateAccountBalance(AccountId, '1', transactionAmountAccum); // utils
		console.log(upBalOutSql);
		tx.executeSql(upBalOutSql, [], insertUpdateSuccess, defaultError);
		var upBalInSql = getSQLUpdateAccountBalance(AccountIdTo, '0', transactionAmountAccum); // utils
		console.log(upBalInSql);
		tx.executeSql(upBalInSql, [], insertUpdateSuccess, defaultError);
	}
	
	for (var i = 0; i < subSql.length ; i++) {
		tx.executeSql(subSql[i], [], insertUpdateSuccess, defaultError);
		console.log(subSql[i]);
	}
	
	insertTransactionSuccess();
	
//	
//	var lastSplitIndex = subSql.lastIndexOf('@splitSql;');
//	subSql = subSql.substring(0, lastSplitIndex); // delete the last one so next step won't be error
//	var sqlList = subSql.split('@splitSql;');
//	
//	for (var i = 0; i < sqlList.length ; i++) {
//		tx.executeSql(sqlList[i], [], insertUpdateSuccess, defaultError);
//		console.log('sql sub : ' + sqlList[i]);
//	}
}

function ConfirmSave() {
	
	phetbudPageShowLoading();

	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);

	db.transaction(insertTransaction, errorInsertTransaction);
	
}

$('#transactionConfirmPage').live(
		'pageshow',
		function(event, ui) {
			
			if (!isBlockPageshow) {
				clearConfirmPage();
			} else {
				isBlockPageshow = false;
			}

		});