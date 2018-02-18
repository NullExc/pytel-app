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
/******/ 	return __webpack_require__(__webpack_require__.s = 158);
/******/ })
/************************************************************************/
/******/ ({

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__state_js__ = __webpack_require__(3);


var app = angular.module('Customer', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('CustomerCtrl', function ($scope, $http, $filter) {

    $scope.customer = window.customer;

    $scope.orders = window.orders;

    $scope.totalSum = window.totalSum;

    $scope.orderCount = window.orderCount;

    $scope.STATE = __WEBPACK_IMPORTED_MODULE_0__state_js__["default"];

    $scope.person = $scope.customer.person ? true : false;

    console.log('created', $scope.customer.date);

    $scope.deleteCustomer = function () {

        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];

        console.log(id);

        $http.delete('/customer/' + id)
            .success(function (data) {
                location.href = '/customer/all';
            })
    }

    $scope.editCustomer = function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/customer-edit/' + id;
    }

    $(document).ready(function () {

        var options = {
            url: '/customer/names',
            method: 'get'
        }

        $http.get('/customer/names')
            .success(function (data) {

                if (data.names) {
                    var names = {};
                    data.names.forEach(function (name) {
                        names[name] = null;
                    })
                    $('input.autocomplete').autocomplete({
                        data: names,
                        limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                        onAutocomplete: function (val) {
                            
                            console.log(val);

                            $http.get('/customer/name/' + val)
                                .success(function (data) {

                                    if (data.customer && data.customer._id) {
                                        console.log(data.customer._id);
                                        location.href = '/customer/' + data.customer._id;
                                    }
                                })
                        },
                        minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
                    });
                }
            })
    })
})

/*$(document).ready(function () {


    var orders = document.getElementsByClassName('collapsible-body');
    var allInfo = document.getElementById('all-info');

    for (var i = 0; i < orders.length; i++) {
        orders[i].style.maxHeight = $("#all-info").height() - (4 * ($(".collapsible-header").height()));
    }

    $("#deleteCustomer").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        console.log(id);
        $.ajax({
            url: '/customer/' + id,
            type: 'DELETE',
            success: function (result) {
                location.href = '/customer/all';
            }
        })
    });

    $("#edit").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/customer-edit/' + id;
    });

    $('.modal').modal();

    var options = {
        url: '/customer/names',
        method: 'get'
    }

    http.request(options, (err, response) => {
        if (response && response.data) {
            var names = {};
            response.data.names.forEach(function (name) {
                names[name] = null;
            })
            $('input.autocomplete').autocomplete({
                data: names,
                limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function (val) {
                    console.log(val);
                },
                minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            });
        }
    })
})*/

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
    arrived: 'arrived',
    working: 'working',
    done: 'done',
    pickUp: 'pickUp'
});

/***/ })

/******/ });