angular.module('redirectorApp', []).controller('StorageCtrl', ['$scope', function($s) {

	var storage = chrome.storage.local; //TODO: Change to sync when Firefox supports it...

	storage.get({downloadOption:false}, function(obj) {
		$s.downloadOption = obj.downloadOption;
		$s.$apply();
	});

	chrome.identity.getAuthToken({interactive: false}, function(token) {
		if (chrome.runtime.lastError) {
        	console.log("not signed in");
        	$s.signedIntoGoogle = false;
        	$s.$apply();
        	return;
      	} else {
      		console.log("signed in");
      		$s.signedIntoGoogle = true;
      		$s.$apply();
      		return;
      	}
		//console.log(token);
	});

	$s.toggleGoogleAuth = function() {
		if ($s.signedIntoGoogle) {
			$s.logoutGoogle();
		} else {
			$s.authGoogle();
		}
	}

	$s.authGoogle=function(){
    	chrome.identity.getAuthToken({interactive: true}, function(token) {
        	$s.signedIntoGoogle = true;
        	$s.$apply();
   		});
  	};

  	$s.logoutGoogle=function() {
  		chrome.identity.getAuthToken({interactive: true}, function(token) {
  			var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token;
			window.fetch(url);

			chrome.identity.removeCachedAuthToken({token: token}, function (){
  				alert('removed');
  				$s.signedIntoGoogle = false;
  				$s.$apply();
  				console.log("was removed and now signedIntoGoogle is " + $s.signedIntoGoogle);

  			});
		});
  	};

	$s.toggleDownloadOption = function() {
		storage.get({downloadOption:false}, function(obj) {
			storage.set({downloadOption:!obj.downloadOption});
		  	$s.downloadOption = !obj.downloadOption;
		  	$s.$apply();
	
			//if user is toggling on download option, disable the google docs option
			storage.get({googleDocsOption:false}, function(inner_obj) {
				console.log("hey");
				if (inner_obj.googleDocsOption && !obj.downloadOption) {
					//toggleGoogleDocsOption();
					//$s.toggleGoogleDocsOption(); 
					$s.googleDocsOption = !inner_obj.googleDocsOption;
		  			$s.$apply();
					console.log("google docs option was true...");
				} else {
					console.log("google docs option wasnt true...?");
				}
			});

		});

    };

	storage.get({googleDocsOption:false}, function(obj) {
		console.log("hey");
		$s.googleDocsOption = obj.googleDocsOption;
		$s.$apply();
	});

    $s.toggleGoogleDocsOption = function() {
		storage.get({googleDocsOption:false}, function(obj) {
			storage.set({googleDocsOption:!obj.googleDocsOption});
		  	$s.googleDocsOption = !obj.googleDocsOption;
		  	$s.$apply();

		  	//if user is toggling on google docs option, disable the download option
			storage.get({downloadOption:false}, function(inner_obj) {
				console.log("hey");
				if (inner_obj.downloadOption && !obj.googleDocsOption) {
					//toggleGoogleDocsOption();
					//$s.toggleDownloadOption(); 
					$s.downloadOption = !inner_obj.downloadOption;
		  			$s.$apply();
					console.log("download  option was true...");
				} else {
					console.log("download  option wasnt true...?");
				}
			});
		});
	};

	//Toggle Notifications by sending a notifications
	$s.enableNotifications = false;

	storage.get({enableNotifications:false},function(obj){
		$s.enableNotifications = obj.enableNotifications;
		$s.$apply();
	});

	$s.toggleNotifications=function(){
		storage.get({enableNotifications:false},function(obj){
		storage.set({enableNotifications:!obj.enableNotifications});
			$s.enableNotifications = !obj.enableNotifications;
			$s.$apply();
	});
	}
}]);
