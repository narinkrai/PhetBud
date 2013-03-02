var programVer = "1.0";
var isPGDBerror = false;
var isSYSDBerror = false;

function initialDb()
{
	console.log("initial system database...");
	
	// system database and program database are separate.
	// system database for checks program's version.
	var sysdb = window.openDatabase("PHETBudSysDB", "1.0", "PHETBud System DB", 500000);
	
	sysdb.transaction(initialDatabase, errorFirstCB);
}

function initialDatabase(tx)
{
	// try to select from table syss in system database to check program version.
	// if error because of not found table that means this program is first time installs. (goto errorToCreateDB function)
	// if its exists then goto checkVersion.
	console.log("select syss for check versions...");
	tx.executeSql('SELECT * FROM SYSS', [], checkVersion, errorToCreateDB);
}

function errorToCreateDB()
{
	checkVersion(null, null);
}

function checkVersion(tx, results)
{
	console.log("in check version function...");
	if (results == null)
	{
		// if first time install then go to createDatabase
		console.log("create database...");
		createDatabase();
	}
	else if (programVer != results.rows.item(0).SysDatabaseVersion)
	{
		// if not the first install then check current program's version with version from system database
		// if not equal then update database.
		console.log("update database...");
		console.log("database version : " + results.rows.item(i).SysDatabaseVersion);
		updateDatabase();
		alert('update database has success!!!');
	}
	else
	{
		// do nothings if program is up-to-date.
		console.log("correct version!!!");
		setAccountItems();
		setSubCategoryItems();
		setUnactiveTransaction();
		UpToDateVersion();
	}
}

function createDatabase()
{
	// create program database.
	console.log("creating program database...");
	var db = window.openDatabase("PHETBudDB", "1.0", "PHETBud DB", 2000000);
	db.transaction(createProgramDB, errorCB, successCB);
}

function updateDatabase(tx)
{

}

function deleteProgramDB()
{
	
}

function createProgramDB(tx)
{
	// create all table and initial some value.
	console.log('delete all table...');
	tx.executeSql('DROP TABLE IF EXISTS AccountBalance');
	tx.executeSql('DROP TABLE IF EXISTS Accounts');
	tx.executeSql('DROP TABLE IF EXISTS AccountTypes');
	tx.executeSql('DROP TABLE IF EXISTS Transactions');
	tx.executeSql('DROP TABLE IF EXISTS TransactionTypes');
	tx.executeSql('DROP TABLE IF EXISTS Categories');
	tx.executeSql('DROP TABLE IF EXISTS SubCategories');
	tx.executeSql('DROP TABLE IF EXISTS CategoryTypes');
	tx.executeSql('DROP TABLE IF EXISTS Budgets');
	tx.executeSql('DROP TABLE IF EXISTS SecuredAccountInfos');
	tx.executeSql('DROP TABLE IF EXISTS Messages');
	
	
	console.log('create table AccountBalance...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS AccountBalance (AccountBalanceId INTEGER PRIMARY KEY AUTOINCREMENT, AccountId INTEGER, AccountBalancePeriod DATETIME, AccountBalanceCurAmount NUMERIC(14,2), AccountBalanceAccInAmount NUMERIC(14,2), AccountBalanceAccOutAmount NUMERIC(14,2)) ');
	
	console.log('create table Accounts...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Accounts (AccountId INTEGER PRIMARY KEY AUTOINCREMENT, AccountTypeId INTEGER, AccountName TEXT, AccountOpenBalance NUMERIC(14,2), AccountIconName TEXT, AccountOrderNo INTEGER)');
	
	console.log('create table AccountTypes...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS AccountTypes (AccountTypeId INTEGER PRIMARY KEY AUTOINCREMENT, AccountTypeName TEXT, AccountTypeUse INTEGER)');
	
	console.log('create table Transactions...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Transactions (TransactionId INTEGER PRIMARY KEY AUTOINCREMENT, TransactionTypeId INTEGER, AccountId INTEGER, AccountIdTo INTEGER, SubCategoryId INTEGER, TransactionDate DATETIME, TransactionAmount NUMERIC(14,2), TransactionRemark TEXT, TransActiveStatus TEXT, TransActiveDate DATETIME, TransRecurrStart DATETIME, TransRecurrEnd DATETIME, TransRecurrType TEXT, TransRecurrValue TEXT, TransRecurrOrgId INTEGER, TransRecurrNextId INTEGER, TransUserDefValue01 TEXT(50), TransUserDefValue02 TEXT(50))');
	
	console.log('create table TransactionTypes...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS TransactionTypes (TransactionTypeId INTEGER  PRIMARY KEY AUTOINCREMENT, TransactionName TEXT, TransactionTypeUse INTEGER)');
	
	console.log('create table Categories...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Categories (CategoryId INTEGER PRIMARY KEY AUTOINCREMENT, CategoryName TEXT, CategoryTypeId INTEGER, CategoryIconName TEXT)');
	
	console.log('create table SubCategories...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS SubCategories (SubCategoryId INTEGER PRIMARY KEY AUTOINCREMENT, SubCategoryName TEXT, CategoryId INTEGER, SubCategoryType TEXT(1), IsNecessary INTEGER, IsExpensive INTEGER, SubCatUserDefName01 TEXT(50), SubCatUserDefName02 TEXT(50))');
	
	console.log('create table CategoryTypes...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS CategoryTypes (CategoryTypeId INTEGER PRIMARY KEY AUTOINCREMENT, CategoryTypeName TEXT, CategoryTypeUse INTEGER)');
	
	console.log('create table Budgets...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Budgets (BudgetId INTEGER PRIMARY KEY AUTOINCREMENT, CategoryId INTEGER, BudgetTarget NUMERIC(14,2))');
	
	console.log('create table SecuredAccountInfos...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS SecuredAccountInfos (AccountId INTEGER, AccountBankAccNo TEXT, AccountBankPin TEXT, AccountBankPin2 TEXT, AccountBankUserLogin TEXT, AccountBankUserPwd TEXT, AccountCreditLimit NUMERIC(14,2), AccountCycleDayCut INTEGER)');
	
	console.log('create table Messages...');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Messages (MessageId INTEGER PRIMARY KEY AUTOINCREMENT, AccountId INTEGER, CategoryId INTEGER, MessageDate DATETIME, MessageExpireDate DATETIME, MessageName TEXT, MessageDesc TEXT, MessageLevel INTEGER)');
	
	console.log('insert table AccountTypes...');
	tx.executeSql('INSERT INTO AccountTypes ( AccountTypeName , AccountTypeUse) VALUES ( "CASH", 1)');
	tx.executeSql('INSERT INTO AccountTypes ( AccountTypeName , AccountTypeUse) VALUES ( "SAVING", 1)');
	tx.executeSql('INSERT INTO AccountTypes ( AccountTypeName , AccountTypeUse) VALUES ( "CHEQUE", 1)');
	
	console.log('insert table Accounts...');
	tx.executeSql('INSERT INTO Accounts ( AccountTypeId, AccountName, AccountOpenBalance, AccountIconName, AccountOrderNo) VALUES ( 2, "TMB", 1000, "", 1)');
	tx.executeSql('INSERT INTO Accounts ( AccountTypeId, AccountName, AccountOpenBalance, AccountIconName, AccountOrderNo) VALUES ( 3, "TMB", 500, "", 2)');
	tx.executeSql('INSERT INTO Accounts ( AccountTypeId, AccountName, AccountOpenBalance, AccountIconName, AccountOrderNo) VALUES ( 1, "My Pocket", 750, "", 3)');
	
	console.log('insert table AccountBalance...');
	tx.executeSql('INSERT INTO AccountBalance (AccountId, AccountBalancePeriod, AccountBalanceCurAmount, AccountBalanceAccInAmount, AccountBalanceAccOutAmount) VALUES (1, "2012-12-21", 1000.00, 0.00, 0.00) ');
	tx.executeSql('INSERT INTO AccountBalance (AccountId, AccountBalancePeriod, AccountBalanceCurAmount, AccountBalanceAccInAmount, AccountBalanceAccOutAmount) VALUES (2, "2012-12-21", 500.00, 0.00, 0.00) ');
	tx.executeSql('INSERT INTO AccountBalance (AccountId, AccountBalancePeriod, AccountBalanceCurAmount, AccountBalanceAccInAmount, AccountBalanceAccOutAmount) VALUES (3, "2012-12-21", 750.00, 0.00, 0.00) ');
	
	console.log("insert table Messages...");
	tx.executeSql('INSERT INTO Messages ( AccountId, CategoryId, MessageDate, MessageExpireDate, MessageName, MessageDesc, MessageLevel) VALUES ( 2, 0, "2012-12-20", "2012-12-21", "Open new account", "TMB Saving has open with 1000 baht", 1)');
	
	console.log("insert table CategoryTypes...");
//	tx.executeSql('INSERT INTO CategoryTypes ( CategoryName, CategoryTypeUse) VALUES ( "Foods", "")');
//	tx.executeSql('INSERT INTO CategoryTypes ( CategoryName, CategoryTypeUse) VALUES ( "Electricity", "")');
//	tx.executeSql('INSERT INTO CategoryTypes ( CategoryName, CategoryTypeUse) VALUES ( "Phone bills", "")');
//	
//	console.log("insert table Categories...");
//	tx.executeSql('INSERT INTO Categories ( CategoryName, CategoryTypeId, CategoryIconName) VALUES ( "breakfast", 1, "")');
//	tx.executeSql('INSERT INTO Categories ( CategoryName, CategoryTypeId, CategoryIconName) VALUES ( "lunch", 1, "")');
//	tx.executeSql('INSERT INTO Categories ( CategoryName, CategoryTypeId, CategoryIconName) VALUES ( "DTAC", 3, "")');
//	
//	console.log("insert table SubCategories...");
//	tx.executeSql('INSERT INTO SubCategories ( SubCategoryName, CategoryId) VALUES ( "Fried American Rice", 1)');
//	tx.executeSql('INSERT INTO SubCategories ( SubCategoryName, CategoryId) VALUES ( "Spaghetti", 1)');
//	tx.executeSql('INSERT INTO SubCategories ( SubCategoryName, CategoryId) VALUES ( "Internet", 3)');
	
	tx.executeSql('INSERT INTO CategoryTypes (CategoryTypeName, CategoryTypeUse) VALUES ("INCOME", 0)');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("main income", 1, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Salary", 1, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Bonus", 1, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("extra income", 1, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Commission", 2, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("rent", 2, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("special", 2, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Others", 2, "N", 0, 0, "", "")');
	//--------------------------------------------------
	tx.executeSql('INSERT INTO CategoryTypes (CategoryTypeName, CategoryTypeUse) VALUES ("EXPENSE", 1)');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("Daily", 2, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("FOOD/BEVERAGE", 3, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Breakfast", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("lunch", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Dinner", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Beverage", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Snacks", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("TRANSPORTATION", 3, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("BUS/BTS/MRT/BRT", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("TAXI", 3, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Oils", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Car Rent", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Express Way", 3, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("HOME", 3, "N", 0, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Fresh and Dry food", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Furniture", 3, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("Personal", 2, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("CLOTHES", 4, "N", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Shirts", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("shoes", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Perfume", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("hair dresses", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("TRAVEL", 4, "N", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("SOCIAL", 4, "N", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("ENTERTAIN/SPORT", 4, "N", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("MOVIES", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("BOOKS", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("FITNESS", 4, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("LOTTERY/GAMBLE", 4, "N", 0, 1, "", "")');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("Home", 2, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Telephone/Water/Electricity", 5, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("buy new one", 5, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Monthly Telephone bills", 5, "D", 1, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("INTERNET", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Water", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Electricity", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("FURNITURE", 5, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("House decorate/fix", 5, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Fire insurance", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Fixed house", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Decorate house", 5, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("VEHICLE", 5, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("lubricant/Gear", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Wash", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("AirConditioner", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Car Insurance", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Decorate Car", 5, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Car Perfume", 5, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Clean Water", 5, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Wash Car", 5, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("Stable", 2, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("House installment/rent", 6, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Car installment", 6, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Others installment", 6, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Life Insurance", 6, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO Categories (CategoryName, CategoryTypeId, CategoryIconName) VALUES ("Family&Others", 2, "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Childs", 7, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Parents", 7, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Hospital", 7, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Medicine", 7, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Doctor", 7, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Dental", 7, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Beauty", 7, "D", 0, 1, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Charity/Social", 7, "N", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Merits school/temple", 7, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Present", 7, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Wedding", 7, "D", 1, 0, "", "")');
	tx.executeSql('INSERT INTO SubCategories (SubCategoryName, CategoryId, SubCategoryType, IsNecessary, IsExpensive, SubCatUserDefName01, SubCatUserDefName02) VALUES ("Merits", 7, "D", 1, 0, "", "")');
	//---------------------------------------------------
	tx.executeSql('INSERT INTO CategoryTypes (CategoryTypeId, CategoryTypeName, CategoryTypeUse) VALUES (3, "TRANSFER", 2)');
	tx.executeSql('INSERT INTO Categories (CategoryId, CategoryName, CategoryTypeId, CategoryIconName) VALUES (8, "TRANSFER EXCHANGE", 3, "")');
	
	console.log("insert table TransactionTypes...");
	tx.executeSql('INSERT INTO TransactionTypes ( TransactionName, TransactionTypeUse) VALUES ( "Income", 0)');
	tx.executeSql('INSERT INTO TransactionTypes ( TransactionName, TransactionTypeUse) VALUES ( "Expense", 1)');
	tx.executeSql('INSERT INTO TransactionTypes ( TransactionName, TransactionTypeUse) VALUES ( "Transfer", 2)');
	tx.executeSql('INSERT INTO TransactionTypes ( TransactionName, TransactionTypeUse) VALUES ( "Recurr.Income", 3)');
	tx.executeSql('INSERT INTO TransactionTypes ( TransactionName, TransactionTypeUse) VALUES ( "Recurr.Expense", 4)');
	tx.executeSql('INSERT INTO TransactionTypes ( TransactionName, TransactionTypeUse) VALUES ( "Recurr.Transfer", 5)');
	
	console.log("insert table Transactions...");
	tx.executeSql('INSERT INTO Transactions ( TransactionTypeId, AccountId, AccountIdTo, SubCategoryId, TransactionDate, TransactionAmount, TransactionRemark, TransActiveStatus, TransActiveDate, TransRecurrStart, TransRecurrEnd, TransRecurrType, TransRecurrValue, TransRecurrOrgId, TransRecurrNextId, TransUserDefValue01, TransUserDefValue02 ) VALUES ( 2, 3, 0, 1, "2012-12-21", 40, "not delicious OwO", "GO", "2012-12-21", "2012-12-21", "2013-12-21", "EN", "nothings", 0, 2, "", "")');
	
	createSysDB();
}

function createSysDB()
{
	// check if first time install and creating program database is success then create system database.
	if (!isPGDBerror)
	{
		console.log("reopen system database for insert...");
		var sysdb = window.openDatabase("PHETBudSysDB", "1.0", "PHETBud System DB", 500000);
		sysdb.transaction(createSystemDB, errorCB2, successAllCB);
	}
	else
	{
		successAllCB();
	}
}

function createSystemDB(tx)
{
	// create syss table for save current program's version of user
	console.log("delete syss table...");
	tx.executeSql('DROP TABLE IF EXISTS SYSS');
	
	console.log("create and insert syss table...");
	tx.executeSql('CREATE TABLE IF NOT EXISTS SYSS (id INTEGER unique, SysEnableSecurityMode TEXT, SysPassword TEXT, SysProgramVersion TEXT, SysDatabaseVersion TEXT, SysDatabaseCreateDate TEXT, SysBackupPath TEXT, SysType TEXT(1), SysSetupIncome NUMERIC(14,2),  SysSetupNecessary NUMERIC(14,2),  SysSetupExpensive NUMERIC(14,2),  SysSetupSaving NUMERIC(14,2), ShowMessageDlg INTEGER)');
	tx.executeSql('INSERT INTO SYSS (id , SysEnableSecurityMode, SysPassword, SysProgramVersion, SysDatabaseVersion, SysDatabaseCreateDate, SysBackupPath, SysType, SysSetupIncome,  SysSetupNecessary,  SysSetupExpensive,  SysSetupSaving, ShowMessageDlg) VALUES (1, "true", "1234", "1.0", "1.0", "2012-12-21 12:21:00.000", "", "N", 0.00, 0.00, 0.00, 0.00, 0)');
}

function errorFirstCB(err)
{
	console.log("Error processing SQL program database : " + err);
	return true;
}

function errorCB(err) {
	isPGDBerror = true;
	console.log("Error processing SQL program database : " + err);
	return true; // return true for rollbacks.
}

function errorCB2(err){
	isSYSDBerror = true;
	console.log("Error processing SQL system database : " + err);
	return true; // return true for rollbacks.
}

function successCB() {
	console.log("default successCB");
    //alert("success!");
}

function successAllCB() {
	
	// check if program database and system database has success all then go to nextpage(must override sucessCB2() in your own html)
	if (!isPGDBerror && !isSYSDBerror)
	{
		setAccountItems();
		setSubCategoryItems();
		successCB2();
	} 
	else 
	{
		alert("initial database failed");
		navigator.app.exitApp(); // if initial database failed then exit app (android , ios can't exit)
	}
}

function successCB2() {
	console.log("default successCB2");
}

