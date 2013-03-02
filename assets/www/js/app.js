var startApp = function() {
	document.addEventListener("backbutton", backKeyDown, true);
	OnPHETBudPageLoaded();
  // alert('started');
};

function backKeyDown()
{
	console.log($.mobile.activePage.attr("id"));
	if ($.mobile.activePage.attr("id") == "mainPage")
	{
		if (confirm('do you want to exit?')){
			navigator.app.exitApp();
		}
		e.preventDefault();
	}
		
}