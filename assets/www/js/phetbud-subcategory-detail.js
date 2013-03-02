var isBlock = false;
var mode = '';
$('#subCategoryDetailPage').find('#checkbox-defname1').bind( "change", function(event, ui) {
	if ($('#subCategoryDetailPage').find('#checkbox-defname1').is(":checked")) {
		$('#subCategoryDetailPage').find('#defname1').textinput('enable');
	} else {
		$('#subCategoryDetailPage').find('#defname1').val('');
		$('#subCategoryDetailPage').find('#defname1').textinput('disable');
	}
});

$('#subCategoryDetailPage').find('#checkbox-defname2').bind( "change", function(event, ui) {
	if ($('#subCategoryDetailPage').find('#checkbox-defname2').is(":checked")) {
		$('#subCategoryDetailPage').find('#defname2').textinput('enable');
	} else {
		$('#subCategoryDetailPage').find('#defname2').val('');
		$('#subCategoryDetailPage').find('#defname2').textinput('disable');
	}
});

function setRadioSubCategoryType(subCatType) {
	var normalRadio = $('#subCategoryDetailPage').find('#radio-subCategoryType1');
	var advanceRadio = $('#subCategoryDetailPage').find('#radio-subCategoryType2');
	
	if (subCatType == 'N') {
		normalRadio.attr('checked', true).checkboxradio("refresh");
		advanceRadio.attr('checked', false).checkboxradio("refresh");
	} else if (subCatType == 'D') {
		normalRadio.attr('checked', false).checkboxradio("refresh");
		advanceRadio.attr('checked', true).checkboxradio("refresh");
	}
}

function clearSubCategoryDetailForm() {
	$('#subCategoryDetailPage').find('#categoryName').val(CategoryEdit.CategoryName);
	$('#subCategoryDetailPage').find('#categoryName').textinput('disable');
	$('#subCategoryDetailPage').find('#subCategoryName').val('');
	setRadioSubCategoryType('N');
	$('#subCategoryDetailPage').find('#checkbox-necessary').attr("checked",false).checkboxradio("refresh");
	$('#subCategoryDetailPage').find('#checkbox-expensive').attr("checked",false).checkboxradio("refresh");
	$('#subCategoryDetailPage').find('#checkbox-defname1').attr("checked",false).checkboxradio("refresh");
	$('#subCategoryDetailPage').find('#defname1').val('');
	$('#subCategoryDetailPage').find('#defname1').textinput('disable');
	$('#subCategoryDetailPage').find('#checkbox-defname2').attr("checked",false).checkboxradio("refresh");
	$('#subCategoryDetailPage').find('#defname2').val('');
	$('#subCategoryDetailPage').find('#defname2').textinput('disable');
}

function setSubCategoryDetailEditForm() {
	$('#subCategoryDetailPage').find('#subCategoryName').val(SubCategoryEdit.SubCategoryName);
	setRadioSubCategoryType(SubCategoryEdit.SubCategoryType);
	
	if (SubCategoryEdit.IsNecessary == 1) {
		$('#subCategoryDetailPage').find('#checkbox-necessary').attr("checked",true).checkboxradio("refresh");
	}
	
	if (SubCategoryEdit.IsExpensive == 1) {
		$('#subCategoryDetailPage').find('#checkbox-expensive').attr("checked",true).checkboxradio("refresh");
	}
	
	if (!($.trim(SubCategoryEdit.SubCatUserDefName01) == '' || SubCategoryEdit.SubCatUserDefName01 === undefined || SubCategoryEdit.SubCatUserDefName01 == null)) {
		$('#subCategoryDetailPage').find('#checkbox-defname1').attr("checked",true).checkboxradio("refresh");
		$('#subCategoryDetailPage').find('#defname1').val(SubCategoryEdit.SubCatUserDefName01);
		$('#subCategoryDetailPage').find('#defname1').textinput('enable');
	}
	
	if (!($.trim(SubCategoryEdit.SubCatUserDefName02) == '' || SubCategoryEdit.SubCatUserDefName02 === undefined || SubCategoryEdit.SubCatUserDefName02 == null)) {
		$('#subCategoryDetailPage').find('#checkbox-defname2').attr("checked",true).checkboxradio("refresh");
		$('#subCategoryDetailPage').find('#defname2').val(SubCategoryEdit.SubCatUserDefName02);
		$('#subCategoryDetailPage').find('#defname2').textinput('enable');
	}
	
}

function validateSubCategoryForm() {
	var errorMsg = '';
	
	if ($.trim($('#subCategoryDetailPage').find('#subCategoryName').val()) == '') {
		errorMsg += 'กรุณาระบุชื่อ \n';
	}
	
	if ($('#subCategoryDetailPage').find('#checkbox-defname1').is(":checked")) {
		if ($.trim($('#subCategoryDetailPage').find('#defname1').val()) == '') {
			errorMsg += 'กรุณาระบุข้อมูลเพิ่ม 1 \n';
		}
	}
	
	if ($('#subCategoryDetailPage').find('#checkbox-defname2').is(":checked")) {
		if ($.trim($('#subCategoryDetailPage').find('#defname2').val()) == '') {
			errorMsg += 'กรุณาระบุข้อมูลเพิ่ม2 \n';
		}
	}
	
	if (errorMsg != '') {
		alert(errorMsg);
		return false;
	}
	
	return true;
}

function insertSubCategory(tx) {
	var subCatName = $('#subCategoryDetailPage').find('#subCategoryName').val();
	var subCatType = $('#subCategoryDetailPage').find('input[name=radio-subCategoryType]:checked').val();
	var isNec = $('#subCategoryDetailPage').find('#checkbox-necessary').is(":checked") ? 1 : 0;
	var isExpen = $('#subCategoryDetailPage').find('#checkbox-expensive').is(":checked") ? 1 : 0;
	var defname1 = $('#subCategoryDetailPage').find('#defname1').val();
	var defname2 = $('#subCategoryDetailPage').find('#defname2').val();
	var catId = CategoryEdit.CategoryId;
	
	var sql = 'INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ' 
		+ ' ("' + subCatName + '" ' 
		+ ', '+ catId 
		+', "' + subCatType +'" ' 
		+ ', ' + isNec 
		+ ', ' + isExpen 
		+', "' + defname1 + '" ' 
		+ ', "' + defname2 + '")';
	
	tx.executeSql(sql, [], insertSubCategorySuccess, phetbudDefaultError);
}

function insertSubCategorySuccess() {
	alert('บันทึกสำเร็จ');
	clearSubCategoryDetailForm();
}

function insertSubCategoryFailed(err) {
	alert('เกิดข้อผิดพลาดในการบันทึก');
	return true;
}

function updateSubCategory(tx) {
	var subCatName = $('#subCategoryDetailPage').find('#subCategoryName').val();
	var subCatType = $('#subCategoryDetailPage').find('input[name=radio-subCategoryType]:checked').val();
	var isNec = $('#subCategoryDetailPage').find('#checkbox-necessary').is(":checked") ? 1 : 0;
	var isExpen = $('#subCategoryDetailPage').find('#checkbox-expensive').is(":checked") ? 1 : 0;
	var defname1 = $('#subCategoryDetailPage').find('#defname1').val();
	var defname2 = $('#subCategoryDetailPage').find('#defname2').val();
	var catId = CategoryEdit.CategoryId;
	
	var sql = 'UPDATE SubCategories SET '
			  + 'SubCategoryName = "' + subCatName + '" ' 
			  + ', CategoryId = ' + catId 
			  + ', SubCategoryType = "' + subCatType + '" ' 
			  + ', IsNecessary = ' + isNec 
			  + ', IsExpensive = ' + isExpen 
			  + ', SubCatUserDefName01 = "' + defname1 + '" ' 
			  + ', SubCatUserDefName02 = "' + defname2 + '" '
			  + ' WHERE SubCategoryId = ' + SubCategoryEdit.SubCategoryId;
	
	tx.executeSql(sql, [], updateSubCategorySuccess, phetbudDefaultError);
}

function updateSubCategorySuccess() {
	alert('บันทึกสำเร็จ');
}

function saveSubCategory() {
	phetbudPageShowLoading();
	if (validateSubCategoryForm()) {
		if (mode == 'add') {
			var db = getPhetbudAppDB();
			db.transaction(insertSubCategory, insertSubCategoryFailed);
			db.transaction(querySetSubCategoryItems, phetbudDefaultErrorCloseProgram);
		} else {
			var db = getPhetbudAppDB();
			db.transaction(updateSubCategory, insertSubCategoryFailed);
			db.transaction(querySetSubCategoryItems, phetbudDefaultErrorCloseProgram);
		}
	}
	phetbudPageHideLoading();
}

function canceSublCategory() {
	history.back();
	return false;
}

$('#subCategoryDetailPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		
		clearSubCategoryDetailForm();
		
		var query = $(this).data("url").split("?")[1];
		query = query.split("&");
		mode = query[0].replace("mode=", "");
		
		if (mode == 'add') {
			
			$('#subCategoryDetailPage').find('#h1-subCategoryDetailMode').html('หมวดหมู่ย่อย เพิ่ม');
			
			
		} else if (mode == 'edit') {
			
			$('#subCategoryDetailPage').find('#h1-subCategoryDetailMode').html('หมวดหมู่ย่อย แก้ไข');
			
			setSubCategoryDetailEditForm();
			
		}
		
		phetbudPageHideLoading();
	} else {
		isBlock = false;
		
	}	
});