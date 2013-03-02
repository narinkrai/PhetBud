function onClickEditCategory() {
	$.mobile.changePage( "categoryDetail.html?mode=edit", { transition: "slideup"} );
}

function onClickDeleteCategory() {
	
}

function onClickSubCategory() {
	$.mobile.changePage( "subCategory.html", { transition: "slideup"} );
}

function onClickCloseDialog() {
	$('#categoryDialogPage').dialog("close");
}

function setCategoryDialogForm() {
	
	if (CategoryEdit.BudgetTarget === undefined) {
		$('#categoryDialogPage').find('#budgetTarget').val('0.00');
	} else {
		$('#categoryDialogPage').find('#budgetTarget').val((Math.round((parseFloat(CategoryEdit.BudgetTarget + '', 10)) * 100) / 100).toFixed(2));
	}
	
	$('#categoryDialogPage').find('#budgetTarget').textinput('disable');
	$('#categoryDialogPage').find('#h1-categoryName').html(CategoryEdit.CategoryName);
	
}

$('#categoryDialogPage').live('pageshow',function(event, ui) {
	phetbudPageShowLoading();
	setCategoryDialogForm();
	phetbudPageHideLoading();
});