/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 39);
/******/ })
/************************************************************************/
/******/ ({

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__google_auth__ = __webpack_require__(8);



var GoogleApi;

function setGoogleApi(api) {
    GoogleApi = api;
}

function listUpcomingEvents() {
    GoogleApi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;

        if (events.length > 0) {
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                console.log(event.summary + ' (' + when + ')');
            }
        } else {
            console.log('No upcoming events found.');
        }
    });
}

/* harmony default export */ __webpack_exports__["a"] = ({ setGoogleApi, listUpcomingEvents });

/***/ }),

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_calendar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_google_auth__ = __webpack_require__(8);



//$(document).ready(function(){

    function startSignProcess() {
        __WEBPACK_IMPORTED_MODULE_1__lib_google_auth__["a" /* default */].handleClientLoad(function(GoogleApi) {
            
        });
        console.log('in start sign process', __WEBPACK_IMPORTED_MODULE_1__lib_google_auth__["a" /* default */].GoogleApi);
    }

    startSignProcess();
    //Code here
// });






/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var CLIENT_ID = '594621902662-b4e9v1girln9pv681qq6ropifl3isv8i.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCATpJdLXMjzH-IcDzAeCgxAk-ZC-agdhg';

var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

var SCOPES = "https://www.googleapis.com/auth/photos https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login";

var PROJECT_ID = "594621902662";


var TOKEN = null;
var GoogleAuth;
var GoogleApi;
var isClientSigned = false;

function handleClientLoad(callback) {
    if (GoogleApi) {
        console.log('client was loaded before');
        callback(GoogleApi, TOKEN);
    } else {
        console.log('client is loading ...');
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        
            GoogleApi = gapi;
        
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {
        
                GoogleAuth = gapi.auth2.getAuthInstance();
        
                GoogleAuth.isSignedIn.listen(updateSigninStatus);
        
                updateSigninStatus(GoogleAuth.isSignedIn.get());
        
                TOKEN = GoogleAuth.currentUser.get().getAuthResponse().access_token;

                if (!GoogleAuth.isSignedIn.get()) {
                    callback(null);
                } else {
                    callback(GoogleApi, TOKEN);
                }
        
                //console.log('token loaded from external file!', GoogleAuth.currentUser.get().getAuthResponse());
            });
        }
}

function updateSigninStatus(isSignedIn) {
    if (!isSignedIn) {
        isClientSigned = false;
        GoogleAuth.signIn();
    } else {
        isSignedIn = true;
    }
    console.log('status change', isSignedIn);
}

function handleAuthClick(event) {
    GoogleAuth.signIn();
}

function handleSignoutClick(event) {
    GoogleAuth.signOut();
}

/* harmony default export */ __webpack_exports__["a"] = ({ TOKEN, handleClientLoad, GoogleApi, isClientSigned, PROJECT_ID, API_KEY, CLIENT_ID });

/***/ })

/******/ });