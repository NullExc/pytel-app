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
/******/ 	return __webpack_require__(__webpack_require__.s = 156);
/******/ })
/************************************************************************/
/******/ ({

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_google_auth__ = __webpack_require__(2);


console.log(document.readyState);

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});

$(document).ready(function () {

  $(".dropdown-trigger").dropdown();

  //$('select').formSelect();

  $('.fixed-action-btn').floatingActionButton();

  //$('.tabs').tabs();

  M.Tabs.init($('.tabs'), {});

  window.addEventListener('load', function () {
    console.log('document was not ready, place code here!!');
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'up',
      hoverEnabled: false
    });
  });

  $('.sidenav').sidenav({
    menuWidth: 200, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true,
    onClose: function (el) {
      console.log('sidenav is closed');

      function showpanel() {
        $("#sidenav-overlay").remove();
        $(".drag-target").each(function (el) {
          if (!$(this).hasClass('ng-isolate-scope')) {
            $(this).remove();
          }
          //console.log('target', $(this).hasClass('ng-isolate-scope'));
        })
      }

      // use setTimeout() to execute
      setTimeout(showpanel, 500);
    }
  }
  );

  var updateSigninStatus = function (isSignedIn) {

    if (isSignedIn) {
      var email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
  
      $(".google-login-text").text(email);
    }

    console.log("hehe2", isSignedIn);

  }

  __WEBPACK_IMPORTED_MODULE_0__lib_google_auth__["a" /* default */].handleClientLoad(updateSigninStatus, function (GoogleApi, TOKEN) {
  });

  window.googleSignIn = function () {

    __WEBPACK_IMPORTED_MODULE_0__lib_google_auth__["a" /* default */].handleAuthClick(updateSigninStatus);
  
  }

})

/*$(document).ready(function () {
  
  $(".dropdown-trigger").dropdown();
        
  $('.button-collapse').sidenav();
})*/

/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var CLIENT_ID = '594621902662-b4e9v1girln9pv681qq6ropifl3isv8i.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCATpJdLXMjzH-IcDzAeCgxAk-ZC-agdhg';

var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

var SCOPES = "https://www.googleapis.com/auth/admin.directory.device.mobile https://www.googleapis.com/auth/photos https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login";

var PROJECT_ID = "594621902662";


var TOKEN = null;
var GoogleApi;
var isClientSigned = false;

var clientCallback;

function handleClientLoad(updateSigninStatus, callback) {

    if (GoogleApi && TOKEN) {
        callback(GoogleApi, TOKEN);
    } else {
        gapi.load('client', initClient);
    }

    function initClient() {

        GoogleApi = gapi;

        if (gapi.client.init) {

            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                prompt: 'select_account',
                authuser: -1
            }).then(function () {

                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

                TOKEN = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

                if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    callback(null);
                } else {
                    callback(GoogleApi, TOKEN);
                }

                //console.log('token loaded from external file!', GoogleAuth.currentUser.get().getAuthResponse());
            });
            
        } else {

            gapi.load('auth', { 'callback': mobileApiLoad });

            function mobileApiLoad() {

                gapi.auth.authorize(
                    {
                        'client_id': CLIENT_ID,
                        'scope': SCOPES,
                        'immediate': false
                    },
                    function (authResult) {

                    });

            }
        }
    }
}

function login() { }

function handleAuthClick(updateSigninStatus) {
    gapi.auth2.getAuthInstance().signIn().then(function () {
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();

    GoogleApi = null;
}

function isClientLogged() {
    gapi.auth2.getAuthInstance().isSignedIn.get();
}



/* harmony default export */ __webpack_exports__["a"] = ({ TOKEN, handleClientLoad, GoogleApi, isClientSigned, PROJECT_ID, API_KEY, CLIENT_ID, handleSignoutClick, handleAuthClick, clientCallback });

/***/ })

/******/ });