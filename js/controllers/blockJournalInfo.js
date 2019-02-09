redirectorApp.controller('BlockJournalInfo', ['$scope', function($s) {
    $s.$parent.showBlockJournalInfo = function(index) {
        $s.redirect = $s.redirects[index];
    }

    function normalize(r) {
		return new Redirect(r).toObject(); //Cleans out any extra props, and adds default values for missing ones.
	}

    $s.redirects = [];

	//Need to proxy this through the background page, because Firefox gives us dead objects
	//nonsense when accessing chrome.storage directly.
	chrome.runtime.sendMessage({type: "getredirects"}, function(response) {
		console.log('Received redirects message in block journal, count=' + response.redirects.length);
 		for (var i=0; i < response.redirects.length; i++) {
			$s.redirects.push(normalize(response.redirects[i]));
		}
		$s.$apply();
	});

    chrome.runtime.sendMessage({type: 'getcurrentredirect'}, function(response) {
    	console.log('Recieved current redirect message, ' + response.blockedSite);
    	$s.blockedSite = response.blockedSite;
    	$s.blockedSiteDescription = response.blockedSiteDescription;
    	$s.blockedSitePattern = response.blockedSitePattern;

    })
}])
