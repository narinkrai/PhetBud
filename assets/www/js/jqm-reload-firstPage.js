// guarantee fresh data on the first-loaded page (stays cached in DOM)
// see https://github.com/jquery/jquery-mobile/issues/4050
$(document).on('pagebeforechange', function(event, data) {
	var $all_pages = $.mobile.pageContainer.find(':jqmData(role="page")'),
	    $cur_page = $.mobile.activePage,
	    $first_page, // unenhanced if fresh load of URL w/ hash in browser w/o pushSate support
	    first_page_data,
	    toPage_type,
	    root_url,
	    nav_urls;

	// exit early if fix is unnecessary
	if (!$.mobile.ajaxEnabled // no ajax nav, so no problem to fix...
		// ...or a fresh non-ajax page load...
			|| $cur_page === undefined
		// ...or a multi-page document
			|| $all_pages.length > 1 && !$all_pages.filter(':jqmData(external-page="true")').length) {
		return;
	}

	toPage_type = typeof data.toPage;

	// pagebeforechange fires both before and after the request; data.toPage is
	// only a string before. BUT, in IE when using the back button to return to
	// the first page it's only ever a jQuery collection so also run on hash changes.
	if (toPage_type === 'string' || data.options.fromHashChange) {
		$first_page = $.mobile.firstPage;
		first_page_data = $first_page.jqmData('page');
		root_url = window.location.protocol + '//' + window.location.host;
		nav_urls = {
			dest: $.mobile.path.makeUrlAbsolute(toPage_type === 'string'
				? data.toPage
				: data.toPage.jqmData('url'), root_url),
			first: root_url + $first_page.jqmData('url')
		};

		// for when initial pg data-url & return link disagree on trailing "/"...
		$.each(nav_urls, function(key, value) {
			nav_urls[key] = value.charAt(value.length - 1) === '/' ? value.slice(0, -1) : value;
		});

		if ($first_page !== $cur_page
				&& nav_urls.dest === nav_urls.first
				&& !(first_page_data && first_page_data.options.domCache)) {
			// work around Android Browser giving blank or stale page w/ back button use, IE 8 & 9 giving stale page
			if (data.options.fromHashChange) {
				window.location.replace(nav_urls.first);
				return;
			}

			data.options.reloadPage = true;

			$(document).one('pageshow', function(event) {
				var $new_first_page = $(event.target);
				// clean up dup DOM node from any trailing slash disagreement
				$first_page.remove();
				// keep new version of the page around
				$new_first_page.removeAttr('data-' + $.mobile.ns + 'external-page').off('pagehide.remove');
				$.mobile.firstPage = $new_first_page;
			});
		}
	}
});