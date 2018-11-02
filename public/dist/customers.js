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
/******/ 	return __webpack_require__(__webpack_require__.s = 159);
/******/ })
/************************************************************************/
/******/ ({

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__state__ = __webpack_require__(4);


var app = angular.module('Customers', ['angularUtils.directives.dirPagination']);

app.controller('CustomersCtrl', [ "$scope", "$http", "$filter", function ($scope, $http, $filter) {

    $scope.customers = []; // = window.customers;

    $scope.allCustomers = [];

    $scope.sortSelect = {
        value: "Vzostupne",
        choices: [ 'Vzostupne', 'Zostupne']
    };

    $scope.orderSelect = {
        value: 'Všetky',
        choices: ['Všetky', 'Prijaté', 'Prebiehajúce', 'Čakajúce na vyzdvihnutie', 'Vyzdvihnuté']
    }

    $scope.clickCustomer = function (id) {
        console.log('click', id, screen.width);
        if (screen.width < 600) {
            location.href = '/customer/' + id;
        }
    }

    $scope.newCustomer = function () {
        location.href = '/customer-new';
    }

    //ng-click="if (window.innerWidth <= 600) location.href='/customer/{{customer._id}}'"

    $scope.sortChange = function () {

        if ($scope.sortSelect.value == $scope.sortSelect.choices[0]) {

            $scope.customers = $filter('orderBy')($scope.customers, 'search', false);

        } else if ($scope.sortSelect.value == $scope.sortSelect.choices[1]) {

            $scope.customers = $filter('orderBy')($scope.customers, 'search', true);
        }
    }

    $scope.orderChange = function () {

        if ($scope.orderSelect.value == $scope.orderSelect.choices[0]) {
            $scope.customers = $scope.allCustomers;

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[1]) {

            orderRequest(__WEBPACK_IMPORTED_MODULE_0__state__["default"].arrived);

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[2]) {
            orderRequest(__WEBPACK_IMPORTED_MODULE_0__state__["default"].working);

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[3]) {
            orderRequest(__WEBPACK_IMPORTED_MODULE_0__state__["default"].done);

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[4]) {
            orderRequest(__WEBPACK_IMPORTED_MODULE_0__state__["default"].pickUp);

        }
    }

    var orderRequest = function (order) {

        $http.post('/customer/sort', {
            customers: $scope.allCustomers,
            order: order
        }).success(function (data) {
            //console.log('arrived', JSON.stringify(data));
            $scope.customers = data;
        })
    }

    $(document).ready(function () {

        var options = {
            url: '/customer/names',
            method: 'get'
        }

     //   var slider = document.getElementById('test-slider');

      /*  noUiSlider.create(slider, {
            start: [20, 80],
            connect: true,
            step: 1,
            orientation: 'horizontal', // 'horizontal' or 'vertical'
            range: {
                'min': 0,
                'max': 100
            },
            format: wNumb({
                decimals: 0
            })
        });

        slider.noUiSlider.on('change', function(){
            console.log('CHNAGE');
        });*/

        $http.get('/customer')
            .success(function (data) {
                $scope.customers = data.customers;
                $scope.allCustomers = data.customers;
                $scope.sortChange();
            })

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

}])

/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
    arrived: 'arrived',
    working: 'working',
    done: 'done',
    pickUp: 'pickUp',
    all: 'all'
});

/***/ })

/******/ });