
window.gapi_onload = function(){
  console.log('gapi loaded.', gapi.auth, gapi.client);


  // Do things you want with gapi.auth and gapi.client.
}

//This is the background script. It is responsible for actually redirecting requests,
//as well as monitoring changes in the redirects and the disabled status and reacting to them.
function log(msg) {
	if (log.enabled) {
		console.log('BLOCK JOURNAL: ' + msg);
	}
}
log.enabled = false;
var enableNotifications=false;

var storageArea = chrome.storage.local;
//Redirects partitioned by request type, so we have to run through
//the minimum number of redirects for each request.
var partitionedRedirects = {};

//Cache of urls that have just been redirected to. They will not be redirected again, to
//stop recursive redirects, and endless redirect chains.
//Key is url, value is timestamp of redirect.
var ignoreNextRequest = {

};

//Cache of urls that are currently blocked and user has started to navigate
//towards.
//Key is tabID, value is dict:
//                  { "url":
//                    "timeRedirected":
//					  "blockDescription"
//                  }

var navigateHistory = {

}

//variables to check whether a new tab (probably) is opened from a link inside an existing tab 
var previousTabId = -1;
var nextTabId = -2;

function getRuleIndex(requestType, url) {
	var list = partitionedRedirects[requestType];
	var ruleIndex = -1;

	for (var i = 0; i < list.length; i++) {
		var r = list[i];
		result = r.getMatch(url);
		if (result.isMatch) {
			ruleIndex = i;
			break;
		}
	}
	return ruleIndex;
}


//url => { timestamp:ms, count:1...n};
var justRedirected = {

};
var redirectThreshold = 3;

function setIcon(image) {
	var data = {
		path: {
			19 : 'images/' + image + '-19.png',
			38 : 'images/' + image + '-38.png'
		}
	};

	chrome.browserAction.setIcon(data, function() {
		var err = chrome.runtime.lastError;
		if (err) {
			//If not checked we will get unchecked errors in the background page console...
			log('Error in SetIcon: ' + err.message);
		}
	});
}

//This is the function that gets called when the user wants to save the journal
//and continue to the original destination
function continueToBlockedSite(details) {
    destinationUrl = navigationHistory[details.tabId][url];
    delete navigationHistory[details.tabId];
}

function logClosedTab(tabId) {
	console.log("a tab was closed with tab " + tabId);

	if (navigateHistory[tabId]) {
		console.log("a tab " + tabId + " is just about to be deleted, since we closed it");
		delete navigateHistory[tabId];
	}
}

//This is the actual function that gets called for each request and must
//decide whether or not we want to redirect.
function checkRedirects(details) {
	console.log("checking a new re-direct, url is " + details.url + " and id is " + details.tabId);
	console.log(navigateHistory);
	var newBlockSameTab = false;

	//We only allow GET request to be redirected, don't want to accidentally redirect
	//sensitive POST parameters
	if (details.method != 'GET') {
		return {};
	}
	log('Checking: ' + details.type + ': ' + details.url);

	var list = partitionedRedirects[details.type];
	if (!list) {
		log('No list for type: ' + details.type);
		return {};
	}

	var timestamp = ignoreNextRequest[details.url];
	if (timestamp) {
		log('Ignoring ' + details.url + ', was just redirected ' + (new Date().getTime()-timestamp) + 'ms ago');
		delete ignoreNextRequest[details.url];
		return {};
	}

	//get tabIds of previous and upcoming tab, in case the user has opened a new
	//tab from within an existing one
	if (details.tabId != previousTabId) {
		previousTabId = nextTabId;
		nextTabId = details.tabId;
	}

	if (navigateHistory[previousTabId]) {
		log("last page was blocked");
		var previousBlockIndex;
		var nextBlockIndex;
		//check what rule list index is associated with this block
		previousBlockIndex = getRuleIndex(details.type, navigateHistory[previousTabId]['url'])

		//check if and what rule list index is associated with the current url
		nextBlockIndex = getRuleIndex(details.type, details.url)

		//if it's the same index, then they're both blocked for the same reason and the user has 
		//already seen the block screen for this visit

			console.log(previousTabId);
			console.log(nextTabId);
			console.log(previousBlockIndex);
			console.log(nextBlockIndex);
			console.log(details.tabId);
			console.log(details.url);

		if (previousBlockIndex == nextBlockIndex) {
			console.log("it's the same rule, so lets not block it");
			var r = list[nextBlockIndex];
			var result = r.getMatch(details.url);
			if (result.isMatch) {
				navigateHistory[nextTabId] = {
	            	"url": details.url, 
	           		"timeRedirected": new Date().getTime(),
	           		"blockDescription": result.description,
	           		"urlPattern": result.includePattern
	           	};
	           	return { };

           }
		}

		else if (navigateHistory[previousTabId] && previousBlockIndex != nextBlockIndex && details.url && nextBlockIndex >= 0) {
			console.log(previousTabId);
			console.log(nextTabId);
			console.log(details.tabId);
			console.log(details.url);

			console.log("last rule we saw is different from new rule, so let's re-do this block");
			var r = list[nextBlockIndex];
			var result = r.getMatch(details.url);
			if (result.isMatch) {
				navigateHistory[nextTabId] = {
	            	"url": details.url, 
	           		"timeRedirected": new Date().getTime(),
	           		"blockDescription": result.description,
	           		"urlPattern": result.includePattern
	           	};
           }
           	newBlockSameTab = true;
		} else if (previousBlockIndex != nextBlockIndex && previousBlockIndex != -1 && previousTabId == nextTabId) {
			//erases the navHist key if a tab is moving to a different
			//block rule
			log("we're moving away from a blocked site on this tab, so let's start fresh");
			//delete navigateHistory[previousTabId];
		}
	}

	//previousTabId = details.tabId;

	for (var i = 0; i < list.length; i++) {
		var r = list[i];
		var result = r.getMatch(details.url);

		if (result.isMatch) {

            //BLOCK JOURNAL addition
            //check whether we've already gone through the journal page on the
            //way to this blocked page for this tab
            if (navigateHistory[details.tabId]) {
            	//loop through the list again, looking for which one matches our new url
                for (var j = 0; j < list.length; j++) {
                	//get the blockUrl item for this index
                    var r2 = list[j];
                    //check if it matches our current url
                    var result2 = r2.getMatch(navigateHistory[details.tabId]["url"]);
                    //if it matches our current url and it's the same index that ... ?
                    if (result2.isMatch && i == j && !newBlockSameTab) {
                        return {};
                    } 
                }
            } 

			//Check if we're stuck in a loop where we keep redirecting this, in that
			//case ignore!
			var data = justRedirected[details.url];

			var threshold = 3000;
			if(!data || ((new Date().getTime()-data.timestamp) > threshold)) { //Obsolete after 3 seconds
				justRedirected[details.url] = { timestamp : new Date().getTime(), count: 1};
			} else {
				data.count++;
				justRedirected[details.url] = data;
				if (data.count >= redirectThreshold) {
					log('Ignoring ' + details.url + ' because we have redirected it ' + data.count + ' times in the last ' + threshold + 'ms');
					return {};
				}
			}

			log('Redirecting ' + details.url + ' ===> ' + result.redirectTo + ', type: ' + details.type + ', pattern: ' + r.includePattern + ' which is in Rule : ' + r.description);
			if(enableNotifications){
				sendNotifications(r, details.url, result.redirectTo);
			}
			ignoreNextRequest[result.redirectTo] = new Date().getTime();

            navigateHistory[details.tabId] = { 
            	"url": details.url, 
           		"timeRedirected": new Date().getTime(),
           		"blockDescription": result.description,
           		"urlPattern": result.includePattern
           	};


			return { redirectUrl: chrome.extension.getURL('block-journal.html') + '?url=' + encodeURIComponent(details.url) };
		} 
	}


  	return {};
}

//Monitor changes in data, and setup everything again.
//This could probably be optimized to not do everything on every change
//but why bother?
function monitorChanges(changes, namespace) {
	if (changes.disabled) {
		updateIcon();

		if (changes.disabled.newValue == true) {
			log('Disabling Redirector, removing listener');
			chrome.webRequest.onBeforeRequest.removeListener(checkRedirects);
		} else {
			log('Enabling Redirector, setting up listener');
			setUpRedirectListener();
		}
	}

	if (changes.redirects) {
		log('Redirects have changed, setting up listener again');
		setUpRedirectListener();
    }

    if (changes.logging) {
        log('Logging settings have changed, updating...');
        updateLogging();
	}
	if (changes.enableNotifications){
		log('notifications setting changed');
		enableNotifications=changes.enableNotifications.newValue;
	}
}
chrome.storage.onChanged.addListener(monitorChanges);

//Creates a filter to pass to the listener so we don't have to run through
//all the redirects for all the request types we don't have any redirects for anyway.
function createFilter(redirects) {
	var types = [];
	for (var i = 0; i < redirects.length; i++) {
		redirects[i].appliesTo.forEach(function(type) {
			// Added this condition below as part of fix for issue 115 https://github.com/einaregilsson/Redirector/issues/115
			// Firefox considers responsive web images request as imageset. Chrome doesn't.
			// Chrome throws an error for imageset type, so let's add to 'types' only for the values that chrome or firefox supports
			if(chrome.webRequest.ResourceType[type.toUpperCase()]!== undefined){
			if (types.indexOf(type) == -1) {
				types.push(type);
			}
		}
		});
	}
	types.sort();

	return {
		urls: ["https://*/*", "http://*/*"],
		types : types
	};
}

function createPartitionedRedirects(redirects) {
	var partitioned = {};

	for (var i = 0; i < redirects.length; i++) {
		var redirect = new Redirect(redirects[i]);
		redirect.compile();
		for (var j=0; j<redirect.appliesTo.length;j++) {
			var requestType = redirect.appliesTo[j];
			if (partitioned[requestType]) {
				partitioned[requestType].push(redirect);
			} else {
				partitioned[requestType] = [redirect];
			}
		}
	}
	return partitioned;
}

function setUpClosedTabListener() {
	console.log("setting up closed tab listener");
	chrome.tabs.onRemoved.addListener(logClosedTab);
}

//Sets up the listener, partitions the redirects, creates the appropriate filters etc.
function setUpRedirectListener() {

	chrome.webRequest.onBeforeRequest.removeListener(checkRedirects); //Unsubscribe first, in case there are changes...

	storageArea.get({redirects:[]}, function(obj) {
		var redirects = obj.redirects;
		if (redirects.length == 0) {
			log('No redirects defined, not setting up listener');
			return;
		}

		partitionedRedirects = createPartitionedRedirects(redirects);
		var filter = createFilter(redirects);

		log('Setting filter for listener: ' + JSON.stringify(filter));
		chrome.webRequest.onBeforeRequest.addListener(checkRedirects, filter, ["blocking"]);
	});
}

//Sets up listener for when the user submits a journal entry and wants to
//submit and continue to the next page, cancel and go back, or skip and
//continue

function setUpUserActionListeners() {
    //find buttons
    var submitButton = document.getElementById("submitBtn").addEventListener("click", function() {
        console.log("submit button was clicked 1");
    })

}

function saveJournalEntryAndContinue() {
    navigateHistory[tabId]

}

function updateIcon() {
	chrome.storage.local.get({disabled:false}, function(obj) {
		setIcon(obj.disabled ? 'icon-disabled' : 'icon-active');
	});
}


//Firefox doesn't allow the "content script" which is actually privileged
//to access the objects it gets from chrome.storage directly, so we
//proxy it through here.
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		log('Received background message: ' + JSON.stringify(request));
		if (request.type == 'getredirects') {
			log('Getting redirects from storage');
			storageArea.get({
				redirects: []
			}, function (obj) {
				log('Got redirects from storage: ' + JSON.stringify(obj));
				sendResponse(obj);
				log('Sent redirects to content page');
			});
		} else if (request.type == 'saveredirects') {
			delete request.type;
			storageArea.set(request, function (a) {
				if(chrome.runtime.lastError) {
				 if(chrome.runtime.lastError.message.indexOf("QUOTA_BYTES_PER_ITEM quota exceeded")>-1){
					log("Redirects failed to save as size of redirects larger than allowed limit per item by Sync");
					sendResponse({
						message: "Redirects failed to save as size of redirects larger than what's allowed by Sync. Refer Help Page"
					});
				 }
				} else {
				log('Finished saving redirects to storage');
				sendResponse({
					message: "Redirects saved"
				});
			}
			});
		} else if (request.type == 'getcurrentredirect') {
			var blockedSite = navigateHistory[sender.tab.id]['url'];
			var blockedSiteDescription = navigateHistory[sender.tab.id]['blockDescription'];
			var blockedSitePattern = navigateHistory[sender.tab.id]["urlPattern"];
			sendResponse(
				{
					blockedSite: blockedSite,	
					blockedSiteDescription: blockedSiteDescription,
					blockedSitePattern: blockedSitePattern

				}
		)
		} else if (request.type == 'ToggleSync') {
			// Notes on Toggle Sync feature here https://github.com/einaregilsson/Redirector/issues/86#issuecomment-389943854
			// This provides for feature request - issue 86
			delete request.type;
			log('toggling sync to ' + request.isSyncEnabled);
			// Setting for Sync enabled or not, resides in Local.
			chrome.storage.local.set({
					isSyncEnabled: request.isSyncEnabled
				},
				function () {
					if (request.isSyncEnabled) {
						storageArea = chrome.storage.sync;
						log('storageArea size for sync is 5 MB but one object (redirects) is allowed to hold only ' + storageArea.QUOTA_BYTES_PER_ITEM  / 1000000 + ' MB, that is .. ' + storageArea.QUOTA_BYTES_PER_ITEM  + " bytes");
						chrome.storage.local.getBytesInUse("redirects",
							function (size) {
								log("size of redirects is " + size + " bytes");
								if (size > storageArea.QUOTA_BYTES_PER_ITEM) {
									log("size of redirects " + size + " is greater than allowed for Sync which is " + storageArea.QUOTA_BYTES_PER_ITEM);
									// Setting storageArea back to Local.
									storageArea = chrome.storage.local;
									sendResponse({
										message: "Sync Not Possible - size of Redirects larger than what's allowed by Sync. Refer Help page"
									});
								} else {
									chrome.storage.local.get({
										redirects: []
									}, function (obj) {
										//check if at least one rule is there.
										if (obj.redirects.length>0) {
											chrome.storage.sync.set(obj, function (a) {
												log('redirects moved from Local to Sync Storage Area');
												//Remove Redirects from Local storage
												chrome.storage.local.remove("redirects");
												// Call setupRedirectListener to setup the redirects
												setUpRedirectListener();
												sendResponse({
													message: "syncEnabled"
												});
											});
										} else {
											log('No redirects are setup currently in Local, just enabling Sync');
											sendResponse({
												message: "syncEnabled"
											});
										}
									});
								}
							});
						} else {
						storageArea = chrome.storage.local;
						log('storageArea size for local is ' + storageArea.QUOTA_BYTES / 1000000 + ' MB, that is .. ' + storageArea.QUOTA_BYTES + " bytes");
						chrome.storage.sync.get({
							redirects: []
						}, function (obj) {
							if (obj.redirects.length>0) {
								chrome.storage.local.set(obj, function (a) {
									log('redirects moved from Sync to Local Storage Area');
									//Remove Redirects from sync storage
									chrome.storage.sync.remove("redirects");
									// Call setupRedirectListener to setup the redirects
									setUpRedirectListener();
									sendResponse({
										message: "syncDisabled"
									});
								});
							} else {
								sendResponse({
									message: "syncDisabled"
								});
							}
						});
					}
				});

		} else {
			log('Unexpected message: ' + JSON.stringify(request));
			return false;
		}

		return true; //This tells the browser to keep sendResponse alive because
		//we're sending the response asynchronously.
	}
);


//First time setup
updateIcon();

function updateLogging() {
    chrome.storage.local.get({logging:false}, function(obj) {
        log.enabled = obj.logging;
    });
}
updateLogging();

chrome.storage.local.get({
	isSyncEnabled: false
}, function (obj) {
	if (obj.isSyncEnabled) {
		storageArea = chrome.storage.sync;
	} else {
		storageArea = chrome.storage.local;
	}
	// Now we know which storageArea to use, call setupInitial function
	setupInitial();
});

//wrapped the below inside a function so that we can call this once we know the value of storageArea from above.

function setupInitial() {
	chrome.storage.local.get({enableNotifications:false},function(obj){
		enableNotifications = obj.enableNotifications;
	});

	chrome.storage.local.get({
		disabled: false
	}, function (obj) {
		if (!obj.disabled) {
			setUpClosedTabListener();
			setUpRedirectListener();
		} else {
			log('Redirector is disabled');
		}
	});
}
log('Redirector starting up...');

// Below is a feature request by an user who wished to see visual indication for an Redirect rule being applied on URL
// https://github.com/einaregilsson/Redirector/issues/72
// By default, we will have it as false. If user wishes to enable it from settings page, we can make it true until user disables it (or browser is restarted)

// Upon browser startup, just set enableNotifications to false.
// Listen to a message from Settings page to change this to true.
function sendNotifications(redirect, originalUrl, redirectedUrl ){
	//var message = "Applied rule : " + redirect.description + " and redirected original page " + originalUrl + " to " + redirectedUrl;
	log("Showing redirect success notification");
	//Firefox and other browsers does not yet support "list" type notification like in Chrome.
	// Console.log(JSON.stringify(chrome.notifications)); -- This will still show "list" as one option but it just won't work as it's not implemented by Firefox yet
	// Can't check if "chrome" typeof either, as Firefox supports both chrome and browser namespace.
	// So let's use useragent.
	// Opera UA has both chrome and OPR. So check against that ( Only chrome which supports list) - other browsers to get BASIC type notifications.

	if(navigator.userAgent.toLowerCase().indexOf("chrome") > -1 && navigator.userAgent.toLowerCase().indexOf("opr")<0){
		var items = [{title:"Original page: ", message: originalUrl},{title:"Redirected to: ",message:redirectedUrl}];
		var head = "Redirector - Applied rule : " + redirect.description;
		chrome.notifications.create({
			"type": "list",
			"items": items,
			"title": head,
			"message": head,
			"iconUrl": "images/icon-active-38.png"
		  });	}
	else{
		var message = "Applied rule : " + redirect.description + " and redirected original page " + originalUrl + " to " + redirectedUrl;

		chrome.notifications.create({
        	"type": "basic",
        	"title": "Redirector",
			"message": message,
			"iconUrl": "images/icon-active-38.png"
		});
	}
}

chrome.runtime.onStartup.addListener(handleStartup);
function handleStartup(){
	enableNotifications=false;
	chrome.storage.local.set({
		enableNotifications: false,
		googleDocsOption: false,
		downloadOption: true
	});
}

