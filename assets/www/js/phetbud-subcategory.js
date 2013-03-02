var isBlock = false;
var subCatEditId;

$('#subCategoryPage').find('#popupSubCategory').bind({ popupafteropen: function(event, ui) { 
	isBlock = true;
}});

function backToPrevPage() {
	history.back();
	return false;
}

function onClickEditSubCategory() {
	isBlock = false;
	$.mobile.changePage( "subCategoryDetail.html?mode=edit", { transition: "slideup"} );
}

function querySubCategoryDetailEditItemsSuccess(tx, results) {
	SubCategoryEdit = results.rows.item(0);
	$('#subCategoryPage').find('#h1-popupSubCategoryName').html(SubCategoryEdit.SubCategoryName);
	$('#subCategoryPage').find('#popupSubCategory').popup('open');
}

function querySubCategoryDetailEditItems(tx) {
	var sql = getSqlSubCategoryDetailItem() + ' AND scat.SubCategoryId = ' + subCatEditId;
	
	tx.executeSql(sql, [], querySubCategoryDetailEditItemsSuccess, phetbudDefaultError);
}

function querySubCategoryDetailEditItemsFail(err) {
	alert('เกิดข้อผิดพลาด');
	return true;
}

function onClickSubCategoryList(subCatId) {
	subCatEditId = subCatId;
	
	var db = getPhetbudAppDB();
	db.transaction(querySubCategoryDetailEditItems, querySubCategoryDetailEditItemsFail);
}

function onClickNewSubCategoryList(catId) {
	$.mobile.changePage( "subCategoryDetail.html?mode=add", { transition: "slideup"} );
}

function querySubCategoryDetailItemsSuccess(tx, results) {
	var catListview = $("#subCategoryPage").find("#listview-subcat");
	catListview.empty();
	
	var catTemplateHtml = '';
	for ( var i = 0; i < results.rows.length; i++) {
		
		catTemplateHtml += '<li>';
		catTemplateHtml += '<a href="javascript:onClickSubCategoryList(' + results.rows.item(i).SubCategoryId + ')">';
		catTemplateHtml += '<h3>' + results.rows.item(i).SubCategoryName + '</h3>';
		catTemplateHtml += '</a></li>';
	}
	
	catTemplateHtml += '<li>';
	catTemplateHtml += '<a href="javascript:onClickNewSubCategoryList(' +  CategoryEdit.CategoryId +')">';
	catTemplateHtml += '<h3>เพิ่มหมวดหมู่หลัก...</h3>';
	catTemplateHtml += '</a></li>';
	
	console.log(catTemplateHtml);
	catListview.append(catTemplateHtml);
	
	catListview.listview("refresh");
	
    phetbudPageHideLoading();
}

function getSqlSubCategoryDetailItem() {
	var sql = 'SELECT scat.*, cat.CategoryName, cat.CategoryTypeId, cat.CategoryIconName ' 
		+ ' FROM SubCategories scat, Categories cat WHERE scat.CategoryId = cat.CategoryId ';
	
	return sql;
}

function querySubCategoryDetailItems(tx) {
	var sql = getSqlSubCategoryDetailItem() + ' AND cat.CategoryId = ' + CategoryEdit.CategoryId;
	
	tx.executeSql(sql, [], querySubCategoryDetailItemsSuccess, phetbudDefaultError);
}

function querySubCategoryDetailItemsFail() {
	phetbudPageHideLoading();
	alert('เกิดข้อผิดพลาดในการเตรียมโปรแกรม');
	history.back();
	return true;
}

function setSubCategoryForm() {
	$("#subCategoryPage").find("#h4-subcategoryName").html(CategoryEdit.CategoryTypeName + ' \> ' + CategoryEdit.CategoryName);
	
	var db = getPhetbudAppDB();
	db.transaction(querySubCategoryDetailItems, querySubCategoryDetailItemsFail);
}

$('#subCategoryPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		setSubCategoryForm();
	} else {
		isBlock = false;
	}
});