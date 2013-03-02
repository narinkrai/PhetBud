var isBlock = false;
var mode = '';
var nextCategoryId;

$('#categoryDetailPage').find('#popupCategoryImage').bind({ popupafteropen: function(event, ui) { 
	isBlock = true;
}});

function onClickCategoryImage(urlImage) {
	var imageHtml = '<img src="' + urlImage + '" width="50" height="50" />';
	$('#categoryDetailPage').find('#categoryIconImageButton').html(imageHtml);
	$('#categoryDetailPage').find('#categoryIconName').val(urlImage);
	$('#categoryDetailPage').find('#popupCategoryImage').popup( "close" );
}

function setRadioCategoryType(catTypeId) {
	var incomeRadio = $('#categoryDetailPage').find('#radio-categoryType1');
	var expenseRadio = $('#categoryDetailPage').find('#radio-categoryType2');
	var transferRadio = $('#categoryDetailPage').find('#radio-categoryType3');
	
	if (catTypeId == 'INCOME') {
		incomeRadio.attr('checked', true).checkboxradio("refresh");
		expenseRadio.attr('checked', false).checkboxradio("refresh");
		transferRadio.attr('checked', false).checkboxradio("refresh");
		console.log('INCOME');
	} else if (catTypeId == 'EXPENSE') {
		incomeRadio.attr('checked', false).checkboxradio("refresh");
		expenseRadio.attr('checked', true).checkboxradio("refresh");
		transferRadio.attr('checked', false).checkboxradio("refresh");
		console.log('EXPENSE');
	} else if (catTypeId == 'TRANSFER') {
		incomeRadio.attr('checked', false).checkboxradio("refresh");
		expenseRadio.attr('checked', false).checkboxradio("refresh");
		transferRadio.attr('checked', true).checkboxradio("refresh");
		console.log('TRANSFER');
	}
}

function setCategoryDetailEditForm() {
	setRadioCategoryType(CategoryEdit.CategoryTypeName);
	$('#categoryDetailPage').find('#categoryName').val(CategoryEdit.CategoryName);
	if (CategoryEdit.BudgetTarget === undefined) {
		$('#categoryDetailPage').find('#budgetTarget').val('0.00');
	} else {
		$('#categoryDetailPage').find('#budgetTarget').val((Math.round((parseFloat(CategoryEdit.BudgetTarget + '', 10)) * 100) / 100).toFixed(2));
	}
	if (!(CategoryEdit.CategoryIconName == '' || CategoryEdit.CategoryIconName == null || CategoryEdit.CategoryIconName === undefined)) {
		$('#categoryDetailPage').find('#categoryIconImageButton').html('<img src="' + CategoryEdit.CategoryIconName + '" width="50" height="50" />');
		$('#categoryDetailPage').find('#categoryIconName').val(CategoryEdit.CategoryIconName);
	}
	
}

function clearCategoryDetailForm() {
	setRadioCategoryType('INCOME');
	$('#categoryDetailPage').find('#categoryName').val('');
	$('#categoryDetailPage').find('#budgetTarget').val('');
	$('#categoryDetailPage').find('#categoryIconImageButton').html('Select Picture . . .');
	$('#categoryDetailPage').find('#categoryIconName').val('');
	nextCategoryId = null;
}

function validateCategoryForm() {
	var errorMsg = '';
	
	if ($.trim($('#categoryDetailPage').find('#categoryName').val()) == '') {
		errorMsg += 'กรุณาระบุชื่อ \n';
	}
	
	if (errorMsg != '') {
		alert(errorMsg);
		return false;
	}
	
	return true;
}

function findNextCategoryIdSuccess(tx, results) {
	nextCategoryId = null;
	for ( var i = 0; i < results.rows.length; i++) {
		nextCategoryId = parseInt(results.rows.item(i).seq);
		nextCategoryId = nextCategoryId + 1;
	}
}

function insertCategory(tx) {
	var catTypeId = parseInt($('#categoryDetailPage').find('input[name=radio-categoryType]:checked').val()) + 1;
	var catName = $('#categoryDetailPage').find('#categoryName').val();
	var budget = 0.00;
	if ($.trim($('#categoryDetailPage').find('#budgetTarget').val()) != '') {
		budget = (Math.round((parseFloat($('#categoryDetailPage').find('#budgetTarget').val() + '', 10)) * 100) / 100);
	}
	var catIconName = $('#categoryDetailPage').find('#categoryIconName').val();
	nextCategoryId = null;
	
	var sqlNextCatId = 'SELECT * FROM SQLITE_SEQUENCE WHERE name = "Categories"';
	tx.executeSql(sqlNextCatId, [], findNextCategoryIdSuccess, phetbudDefaultError);
	
	if (nextCategoryId != null) {
		phetbudPageShowLoading();
		
		var sqlCat = 'INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName)' 
			+ ' VALUES ("' + catName + '", ' + catTypeId + ', "' + catIconName + '")';
		
		var sqlBudget = 'INSERT INTO Budgets (CategoryId, BudgetTarget) SELECT CategoryId, ' + budget.toFixed(2) 
			+ ' FROM Categories WHERE CategoryId = ' + nextCategoryId;
		
		console.log(sqlCat);
		console.log(sqlBudget);
		
		tx.executeSql(sqlCat, [], phetbudDefaultSuccess, phetbudDefaultError);
		tx.executeSql(sqlBudget, [], phetbudDefaultSuccess, phetbudDefaultError);
		
		phetbudPageHideLoading();

		history.back();
	}
}

function updateCategory(tx) {
	phetbudPageShowLoading();
	
	var catTypeId = parseInt($('#categoryDetailPage').find('input[name=radio-categoryType]:checked').val()) + 1;
	var catName = $('#categoryDetailPage').find('#categoryName').val();
	var budget = 0.00;
	if ($.trim($('#categoryDetailPage').find('#budgetTarget').val()) != '') {
		budget = (Math.round((parseFloat($('#categoryDetailPage').find('#budgetTarget').val() + '', 10)) * 100) / 100);
	}
	var catIconName = $('#categoryDetailPage').find('#categoryIconName').val();
	
	var upCat = 'UPDATE Categories SET CategoryName = "' + catName + '", CategoryTypeId = ' + catTypeId 
				+ ', CategoryIconName = "'  + catIconName + '" WHERE CategoryId = ' + CategoryEdit.CategoryId;
	
	var upBudget = 'UPDATE Budgets SET BudgetTarget = ' + budget.toFixed(2) + ' WHERE CategoryId = ' + CategoryEdit.CategoryId;
	
	tx.executeSql(upCat, [], phetbudDefaultSuccess, phetbudDefaultError);
	tx.executeSql(upBudget, [], phetbudDefaultSuccess, phetbudDefaultError);
	
	alert("บันทึกสำเร็จ");
	phetbudPageHideLoading();
}

function insertCategoryFailed(err) {
	console.log(err);
	alert('เกิดข้อผิดพลาดในการบันทึก');
	return true;
}

function saveCategory() {
	if (validateCategoryForm())  {
		if (mode == 'add') {
			var db = getPhetbudAppDB();
			db.transaction(insertCategory, insertCategoryFailed);
			db.transaction(querySetSubCategoryItems, phetbudDefaultErrorCloseProgram);
		} else {
			var db = getPhetbudAppDB();
			db.transaction(updateCategory, insertCategoryFailed);
			db.transaction(querySetSubCategoryItems, phetbudDefaultErrorCloseProgram);
		}
		
	}
}

function cancelCategory() {
	history.back();
}

$('#categoryDetailPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		
		clearCategoryDetailForm();
		
		var query = $(this).data("url").split("?")[1];
		query = query.split("&");
		mode = query[0].replace("mode=", "");
		
		if (mode == 'add') {
			
			
			var catTypeId = query[1].replace("categoryId=", "");
			
			console.log('cat type : ' + catTypeId);
			
			setRadioCategoryType(catTypeId);
			
			$('#categoryDetailPage').find('#h1-categoryDetailMode').html('หมวดหมู่หลัก เพิ่ม');
			
			
		} else if (mode == 'edit') {
			
			$('#categoryDetailPage').find('#h1-categoryDetailMode').html('หมวดหมู่หลัก แก้ไข');
			
			setCategoryDetailEditForm();
			
		}
		
		phetbudPageHideLoading();
	} else {
		isBlock = false;
		
	}	
});