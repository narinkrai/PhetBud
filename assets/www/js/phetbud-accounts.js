var isBlock = false;

function queryAccountDetailItemsSuccess(tx, results) {
	
	var prevAccountType = '';
	var prevAccountTypeId;
	var collapseDivHtml = '';
	
	for ( var i = 0; i < results.rows.length; i++) {
		
		if (prevAccountType != results.rows.item(i).AccountTypeName) {
			
			if (collapseDivHtml != '') {
				collapseDivHtml += ' <li data-icon="false"><a href="accountDetail.html?mode=add&AccountTypeId=' + prevAccountTypeId +'"> <h3 align="center">New</h3></a></li> '; // new at end of each account type
				collapseDivHtml += ' </ul> </div> '; // if not first collapse then close prev one
			}
				
			collapseDivHtml += ' <div data-role="collapsible"  data-theme="b" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-inset="false"> ';
			collapseDivHtml += ' <h2> ' + results.rows.item(i).AccountTypeName + ' </h2> ';
			collapseDivHtml += ' <ul data-role="listview" data-icon="gear" data-split-theme="d"> ';
		}
		
		collapseDivHtml += ' <li data-icon="gear"><a href="accountDetail.html?mode=edit&AccountId=' + results.rows.item(i).AccountId + '" > ';
		
		if ( results.rows.item(i).AccountIconName == null ||  results.rows.item(i).AccountIconName === undefined ||  results.rows.item(i).AccountIconName == '') {
			collapseDivHtml += ' <img src="img/cordova.png" /> '; // default picture
		} else {
			collapseDivHtml += ' <img src="' + results.rows.item(i).AccountIconName + '" />';
		}
		
		
		collapseDivHtml += ' <h3> ' + results.rows.item(i).AccountName + ' </h3> ';
		collapseDivHtml += ' <p>Balance : ' + (Math.round((parseFloat(results.rows.item(i).AccountBalanceCurAmount + '', 10)) * 100) / 100).toFixed(2) + '</p> ';
		collapseDivHtml += ' </a></li> ';
		
		prevAccountType = results.rows.item(i).AccountTypeName;
		prevAccountTypeId = results.rows.item(i).AccountTypeId;
	}
	
	if (collapseDivHtml != '') {
		collapseDivHtml += ' <li data-icon="false"><a href="accountDetail.html?mode=add&catTypeId=' + prevAccountTypeId +'"> <h3 align="center">New</h3></a></li> '; // new at end of each account type
		collapseDivHtml += ' </ul> </div> '; // if not first collapse then close prev one
	}
	
	console.log(collapseDivHtml);
	
	myClone1 = $(collapseDivHtml);
	var divAcc = $('#accountsPage').find("#div-accounts");
	divAcc.html('');
    myClone1.appendTo(divAcc).trigger('create');
    
    $('#accountsPage').find('div[data-role=collapsible]').each(function (){
    	console.log('555');
    	//$(this).trigger('create');
    	$(this).collapsible({refresh:true});
    });
}

function queryAccountDetailItems(tx) {
	var sql = 'SELECT acc.AccountId, acc.AccountName, acc.AccountTypeId, acc.AccountIconName, acct.AccountTypeName, acct.AccountTypeUse, accb.AccountBalanceCurAmount ';
	sql += ' FROM AccountTypes acct LEFT OUTER JOIN Accounts acc ON acct.AccountTypeId = acc.AccountTypeId LEFT OUTER JOIN AccountBalance accb ON acc.AccountId = accb.AccountId ';
	
	tx.executeSql(sql, [], queryAccountDetailItemsSuccess, queryAccountDetailItemsFail);
}

function queryAccountDetailItemsFail() {
	phetbudPageHideLoading();
	alert('เกิดข้อผิดพลาดในการเตรียมโปรแกรม');
	navigator.history();
}

function queryAccountDetail() {
	var db = getPhetbudAppDB();
	db.transaction(queryAccountDetailItems, queryAccountDetailItemsFail);
}

$('#accountsPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		queryAccountDetail();
		phetbudPageHideLoading();
	} else {
		isBlock = false;
		
	}
});