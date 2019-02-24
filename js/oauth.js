//'use strict';

/*
angular.module('redirectorApp', []).controller('GoogleOauthCtrl', ['$scope', function($s) {


// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


  $s.authGoogle=function(){
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log( $s.downloadOption );
        console.log( "hi" );
        console.log(token);
    });
  }
}]);

/* TODO: I don't remember where I got htis, but look at it later
  if (gapi.auth.getToken() != null && gapi.client != null && gapi.client.drive != null && gapi.client.drive.files != null) {
    callback()
    return
  }

  if (token == null)
      return
    gapi.auth.setToken({ 'access_token': token })
    gapi.client.load('drive', 'v3', callback)
*/