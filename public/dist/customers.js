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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__state__ = __webpack_require__(9);


var app = angular.module('Customers', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('CustomersCtrl', function ($scope, $http, $filter) {

    $scope.customers = window.customers;

    $scope.sortSelect = {
        value: 'Vzostupne',
        choices: ['Vzostupne', 'Zostupne']
    };

    $scope.orderSelect = {
        value: 'Všetky',
        choices: ['Všetky', 'Prijaté', 'Prebiehajúce', 'Čakajúce na vyzdvihnutie', 'Vyzdvihnuté']
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
            $scope.customers = window.customers;

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
        //console.log(order);

        $http.post('/customer/sort', {
            customers: window.customers,
            order: order
        }).success(function (data) {
            //console.log('arrived', JSON.stringify(data));
            $scope.customers = data;
        })
    }

})

/***/ }),

/***/ 9:
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