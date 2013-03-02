var isBlock = false;
var file_Browser_params;

$('#syssPage').find('#browseBtn').click(function(){
	
    //check if last selected folder was set
    if (typeof lastFolderSelected == 'undefined')
        lastFolderSelected = null;

    //create file chooser dialog parameters
    file_Browser_params = {
        directory_browser : true, //this is file browser. Default is false

        new_file_btn : false, //show new file button. Default is true

        new_folder_btn : true, //shoe new folder button. Default is true

        initial_folder : lastFolderSelected, //initial folder when dialog is displayed

        //callback function when file is selected
        on_file_select : function(fileEntry) {
            return false; //close dialog when any file is selected (tapped)
        },

        //callback function when folder is selected
        on_folder_select : function(dirEntry) {
            //don't do anything
        },

        //callback function when OK button is clicked
        on_ok : function (dirEntry) {
            //save the last folder path
            lastFolderSelected = dirEntry;
            $('#syssPage').find('#sysBackupPath').val(dirEntry.fullPath);
            isBlock = true;
        }
}});

function onClickGeneral() {
	phetbudPageShowLoading();
	$('#syssPage').find('#div-general').show();
	$('#syssPage').find('#div-other').hide();
	phetbudPageHideLoading();
}

function onClickOther() {
	phetbudPageShowLoading();
	$('#syssPage').find('#div-general').hide();
	$('#syssPage').find('#div-other').show();
	phetbudPageHideLoading();
}

function querySysSuccess(tx, results) {
	var sys = results.rows.item(0);
	
	if (sys.SysEnableSecurityMode == 'true') {
		$('#syssPage').find('#radio-enableSecureMode1').attr('checked', true).checkboxradio("refresh");
		$('#syssPage').find('#radio-enableSecureMode2').attr('checked', false).checkboxradio("refresh");
		$('#syssPage').find('#sysPassword').val(sys.SysPassword);
		$('#syssPage').find('#reSysPassword').val(sys.SysPassword);
	} else {
		$('#syssPage').find('#radio-enableSecureMode1').attr('checked', false).checkboxradio("refresh");
		$('#syssPage').find('#radio-enableSecureMode2').attr('checked', true).checkboxradio("refresh");
		$('#syssPage').find('#sysPassword').val('');
		$('#syssPage').find('#reSysPassword').val('');
	}
	
	$('#syssPage').find('#sysBackupPath').val(sys.SysBackupPath);
	$('#syssPage').find('#sysBackupPath').textinput('disable');
	
	$('#syssPage').find('#label-sysProgramVersion').html('เลขโปรแกรมเวอร์ชั่นที่ ' + sys.SysProgramVersion);
	$('#syssPage').find('#label-sysDatabaseVersion').html('เลจฐานข้อมูลเวอร์ชั่นที่ ' + sys.SysDatabaseVersion);
	$('#syssPage').find('#label-sysDatabaseCreateDate').html('ฐานข้อมูลสร้างเมื่อวันที่ ' + sys.SysDatabaseCreateDate);
	$('#syssPage').find('#label-sysDatabaseLatestDate').html('ฐานข้อมูลบันทึกล่าสุดเมื่อวันที่ ');
	
	if (sys.SysType == 'N') {
		$('#syssPage').find('#radio-sysType1').attr('checked', true).checkboxradio("refresh");
		$('#syssPage').find('#radio-sysType2').attr('checked', false).checkboxradio("refresh");
	} else {
		$('#syssPage').find('#radio-sysType1').attr('checked', false).checkboxradio("refresh");
		$('#syssPage').find('#radio-sysType2').attr('checked', true).checkboxradio("refresh");
	}
	
	if (sys.ShowMessageDlg == 0) {
		$('#syssPage').find('#radio-showMessageDlg1').attr('checked', true).checkboxradio("refresh");
		$('#syssPage').find('#radio-showMessageDlg2').attr('checked', false).checkboxradio("refresh");
	} else {
		$('#syssPage').find('#radio-showMessageDlg1').attr('checked', false).checkboxradio("refresh");
		$('#syssPage').find('#radio-showMessageDlg2').attr('checked', true).checkboxradio("refresh");
	}
	
	
	$('#syssPage').find('#sysSetupIncome').val(phetbudStrToFloat(sys.SysSetupIncome).toFixed(2));
	$('#syssPage').find('#sysSetupNecessary').val(phetbudStrToFloat(sys.SysSetupNecessary).toFixed(2));
	$('#syssPage').find('#sysSetupExpensive').val(phetbudStrToFloat(sys.SysSetupExpensive).toFixed(2));
	$('#syssPage').find('#sysSetupSaving').val(phetbudStrToFloat(sys.SysSetupSaving).toFixed(2));
	
	$('#syssPage').find('#div-general').show();
	$('#syssPage').find('#div-other').hide();
}

function querySys(tx) {
	var sql = 'SELECT * FROM SYSS ';
	
	tx.executeSql(sql, [], querySysSuccess);
}

function setSysForm() {
	var sysDb = getPhetbudSysDB();
	sysDb.transaction(querySys, setSysFormFailed);
}

function setSysFormFailed(err) {
	alert('เกิดข้อผิดพลาดในการเตรียมข้อมูล');
	history.back();
}

function ExportSuccess() {
	alert('ดำเนินการเรียบร้อย');
}
function ImportSuccess() {
	alert('ดำเนินการเรียบร้อย ต้องทำการปิดโปรแกรม');
	navigator.app.exitApp();
}

function ImportExportFailed(err) {
	alert(err);
}

function onclickExport() {
	if ($.trim($('#syssPage').find('#sysBackupPath').val()) == '') {
		alert('กรุณาระบุ path');
		return true;
	}
	var pathBk = $('#syssPage').find('#sysBackupPath').val();
	cordova.exec(ExportSuccess, ImportExportFailed, "PhetbudDatabaseManagement", "export", pathBk);
}

function onclickImport() {
	if ($.trim($('#syssPage').find('#sysBackupPath').val()) == '') {
		alert('กรุณาระบุ path');
		return true;
	}
	var pathBk = $('#syssPage').find('#sysBackupPath').val();
	cordova.exec(ImportSuccess, ImportExportFailed, "PhetbudDatabaseManagement", "import", pathBk);
}

function updateSyss(tx) {
	var enaSecMode = $('#syssPage').find('input[name=radio-enableSecureMode]:checked').val();
	enaSecMode = enaSecMode == '1' ? 'true' : 'false';
	var sysPass = $('#syssPage').find('#sysPassword').val();
	if (enaSecMode == 'false') {
		sysPass = '';
	}
	var resysPass = $('#syssPage').find('#reSysPassword').val();
	var sysBkPath = $('#syssPage').find('#sysBackupPath').val();
	var sysType =  $('#syssPage').find('input[name=radio-sysType]:checked').val();
	var showMsgDlg = $('#syssPage').find('input[name=radio-showMessageDlg]:checked').val();
	
	var sysSetIncome = '0.00';
	if ($.trim($('#syssPage').find('#sysSetupIncome').val()) != '')
		sysSetIncome = phetbudStrToFloat($('#syssPage').find('#sysSetupIncome').val()).toFixed(2);
	
	var sysSetNec = '0.00';
	if ($.trim($('#syssPage').find('#sysSetupNecessary').val()) != '')
		sysSetNec = phetbudStrToFloat($('#syssPage').find('#sysSetupNecessary').val()).toFixed(2);
	
	var sysSetExp = '0.00';
	if ($.trim($('#syssPage').find('#sysSetupExpensive').val()) != '')
		sysSetExp = phetbudStrToFloat($('#syssPage').find('#sysSetupExpensive').val()).toFixed(2);
	
	var sysSetSaving = '0.00';
	if ($.trim($('#syssPage').find('#sysSetupSaving').val()) != '')
		sysSetSaving = phetbudStrToFloat($('#syssPage').find('#sysSetupSaving').val()).toFixed(2);
	
	var sql = 'UPDATE SYSS SET '
				+ 'SysEnableSecurityMode = "' + enaSecMode + '" '
				+ ', SysPassword = "' + sysPass + '" '
				+ ', SysBackupPath = "' + sysBkPath + '" '
				+ ', SysType = "' + sysType + '" '
				+ ', SysSetupIncome = ' + sysSetIncome
				+ ', SysSetupNecessary = ' + sysSetNec
				+ ', SysSetupExpensive = ' + sysSetExp
				+ ', SysSetupSaving = ' + sysSetSaving
				+ ', ShowMessageDlg = ' + showMsgDlg
				+ '  WHERE id = 1 ';
	 
	 console.log(sql);
	 tx.executeSql(sql, [], updateSyssSuccess);
}

function updateSyssSuccess() {
	alert('บันทึกสำเร็จ');
}

function updateSyssFailed() {
	alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
	return true;
}

function validateSaveSys() {
	var errorMsg = '';
	
	if ( $('#syssPage').find('input[name=radio-enableSecureMode]:checked').val() == '1') {
		if ($.trim($('#syssPage').find('#sysPassword').val()) == '' || $.trim($('#syssPage').find('#reSysPassword').val()) == '')
			errorMsg += 'กรุณาระบุ password \n';
		
		if ($.trim($('#syssPage').find('#sysPassword').val()) != $.trim($('#syssPage').find('#reSysPassword').val()))
			errorMsg += 'กรุณาระบุ password ให้ถูกต้องทั้งคู่ \n';
	}
	
	if (errorMsg != '') {
		alert(errorMsg);
		return false;
	}
	
	return true;
}

function saveSys() {
	phetbudPageShowLoading();
	if (validateSaveSys()) {
		var sysDb = getPhetbudSysDB();
		sysDb.transaction(updateSyss, updateSyssFailed);
	}
	phetbudPageHideLoading();
}

function cancelSys() {
	history.back();
}

$('#syssPage').live('pageshow',function(event, ui) {
	if (!isBlock) {
		phetbudPageShowLoading();
		console.log('page show');
		setSysForm();
		phetbudPageHideLoading();
	} else {
		isBlock = false;
	}
});

$('#syssPage').live('pagehide',function(event, ui) {
	isBlock = true;
});
