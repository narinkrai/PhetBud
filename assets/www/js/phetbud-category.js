var isBlock = false;
var whereCatTypeName = 'INCOME';

$('div#categoryDialogPage').bind('dialogclose', function(event) {
});

function setDivCategoryList (rows) {
	
}

function onClickIncome() {
	whereCatTypeName = 'INCOME';
	CategoryEditId = 0;
	phetbudPageShowLoading();
	queryCategoryDetail();
}

function onClickExpense() {
	whereCatTypeName = 'EXPENSE';
	CategoryEditId = 0;
	phetbudPageShowLoading();
	queryCategoryDetail();
}

function onClickTransfer() {
	whereCatTypeName = 'TRANSFER';
	CategoryEditId = 0;
	phetbudPageShowLoading();
	queryCategoryDetail();
}

function queryCategoryDetailEditItemsSuccess (tx, results) {
	CategoryEdit = results.rows.item(0);
	$('#categoryPage').find('#categoryDialog').click();
}

function queryCategoryDetailEditItems(tx) {
	var sql = getSqlDefaultCategoryDetailItem();
	sql += ' AND c.CategoryId = ' + CategoryEditId + ' ';
	
	console.log(sql);
	
	tx.executeSql(sql, [], queryCategoryDetailEditItemsSuccess, phetbudDefaultError);
}

function queryCategoryDetailEditItemsFail() {
	alert("เกิดข้อผิดพลาด");
	CategoryEdit = null;
	return true;
}

function queryCategoryEdit() {
	var db = getPhetbudAppDB();
	db.transaction(queryCategoryDetailEditItems, queryCategoryDetailEditItemsFail);
}

function onClickCategoryList(catEditId, budgetTarget) {
	
	CategoryEditId = catEditId;
	
	console.log(CategoryEditId);
	
	queryCategoryEdit();
	
}

function onClickNewCategoryList(categoryId) {
	$.mobile.changePage( "categoryDetail.html?mode=add&categoryId=" + categoryId, { transition: "slideup"} );
}

function queryCategoryDetailItemsSuccess(tx, results) {
	console.log("Returned rows = " + results.rows.length);
	var catListview = $("#categoryPage").find("#listview-cat");
	catListview.empty();
	
	var catTemplateHtml = '';
	for ( var i = 0; i < results.rows.length; i++) {
		
		catTemplateHtml += '<li>';
		catTemplateHtml += '<a href="javascript:onClickCategoryList(' + results.rows.item(i).CategoryId + ')">';
		
		if (results.rows.item(i).CategoryIconName == '' || results.rows.item(i).CategoryIconName == null || results.rows.item(i).CategoryIconName === undefined  ) {
			catTemplateHtml += '<img src="img/logo.png" />';
		} else {
			catTemplateHtml += '<img src="' + results.rows.item(i).CategoryIconName + '" />';
		}
		
		catTemplateHtml += '<h3>' + results.rows.item(i).CategoryName + '</h3>';
		catTemplateHtml += '</a></li>';
	}
	
	catTemplateHtml += '<li>';
	catTemplateHtml += '<a href="javascript:onClickNewCategoryList(\'' + whereCatTypeName +'\')">';
	catTemplateHtml += '<img src="img/logo.png" style="display: none;" />';
	catTemplateHtml += '<h3>เพิ่มหมวดหมู่หลัก...</h3>';
	catTemplateHtml += '</a></li>';
	
	console.log(catTemplateHtml);
	catListview.append(catTemplateHtml);
	
	catListview.listview("refresh");
	
    phetbudPageHideLoading();
}

function getSqlDefaultCategoryDetailItem() {
	var sql = 'SELECT ct.CategoryTypeName, ct.CategoryTypeUse, c.*, b.BudgetId, b.BudgetTarget ';
	sql += ' FROM Categories c LEFT OUTER JOIN Budgets b ON b.CategoryId = c.CategoryId, CategoryTypes ct ';
	sql += ' WHERE  ct.CategoryTypeId = c.CategoryTypeId ';
	
	return sql;
}

function queryCategoryDetailItems(tx) {
	
	var sql = getSqlDefaultCategoryDetailItem();
	sql += ' AND ct.CategoryTypeName = "' + whereCatTypeName + '" ';
	
	console.log(sql);
	
	tx.executeSql(sql, [], queryCategoryDetailItemsSuccess, queryCategoryDetailItemsFail);
}

function queryCategoryDetailItemsFail() {
	phetbudPageHideLoading();
	alert('เกิดข้อผิดพลาดในการเตรียมโปรแกรม');
	navigator.history();
	return true;
}

function queryCategoryDetail() {
	var db = getPhetbudAppDB();
	db.transaction(queryCategoryDetailItems, queryCategoryDetailItemsFail);
}

$('#categoryPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		CategoryEdit = null;
		queryCategoryDetail();
	} else {
		isBlock = false;
		
	}
});
