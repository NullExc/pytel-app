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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

$(document).ready(function () {

    $("#create, #update").click(function (e) {

        var customer = {};

        customer.firstName = $("#first").val();
        customer.lastName = $("#last").val();

        var email = $("#email").val();
        var phone = $("#phone").val();

        if (email || phone) {
            customer.contact = {};
        }
        if (email) customer.contact.email = email;
        if (phone) customer.contact.phone = phone;

        var street = $("#street").val();
        var streetNumber = $("#num").val();
        var city = $("#city").val();
        var zipCode = $("#zip").val();

        if (street || streetNumber || city || zipCode) {
            customer.address = {};
        }
        if (street) customer.address.street = street;
        if (streetNumber) customer.address.streetNumber = streetNumber;
        if (city) customer.address.city = city;
        if (zipCode) customer.address.zipCode = zipCode;

        var ico = $("#ico").val();
        var icdph = $("#icdph").val();
        var dic = $("#dic").val();

        if (ico || icdph || dic) {
            customer.billData = {};
        }
        if (ico) customer.billData.ICO = ico;
        if (icdph) customer.billData.ICDPH = icdph;
        if (dic) customer.billData.DIC = dic;


        if (e.target.id === 'create') {
            console.log(JSON.stringify(customer));
            $.ajax({
                url: '/customer',
                type: 'POST',
                dataType: 'json',
                data: customer,
                success: function (result) {
                    location.href = '/customer/' + result.id;
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            })
        } else if (e.target.id === 'update') {

            $.ajax({
                url: '/customer/' + localStorage.getItem('updateId'),
                type: 'PUT',
                dataType: 'json',
                data: customer,
                success: function (result) {
                    console.log(JSON.stringify(result));
                    var id = localStorage.getItem('updateId');
                    localStorage.removeItem('updateId');
                    location.href = '/customer/' + id;
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                    localStorage.removeItem('updateId');
                }
            })
        }
    })
})

/***/ })

/******/ });