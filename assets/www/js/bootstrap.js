(function() {
  var device_ready = false;
  var jqm_mobile_init = false;

  var initApp = function() {
    if ((device_ready && jqm_mobile_init) || (jqm_mobile_init && !mobile_system)) {
      startApp();
    }
  };

  var onDeviceReady = function() {
    device_ready = true;
    //alert('dev ready');
    initApp();
  };

  var onMobileInit = function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.page.prototype.options.degradeInputs.date = 'text'; // jqm-datebox-fixed
    jqm_mobile_init = true;
    
    //alert('jqm ready');
    initApp();
  };

  $(document).bind('mobileinit', onMobileInit);
  document.addEventListener("deviceready", onDeviceReady, false);
})();