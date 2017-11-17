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
/******/ 	return __webpack_require__(__webpack_require__.s = 162);
/******/ })
/************************************************************************/
/******/ ({

/***/ 162:
/***/ (function(module, exports) {

$(document).ready(function () {

    $('select').material_select();

    $('.caret').each(function (caret) {
        $(this).text(' ');
    })

    $.datepicker.regional['sk'] = {
        closeText: 'Zavrieť',
        prevText: '&lt; Predchádzajúci',
        nextText: 'Nasledujúci &gt;',
        currentText: 'Dnes',
        monthNames: [
            'Január',
            'Február',
            'Marec',
            'Apríl',
            'Máj',
            'Jún',
            'Júl',
            'August',
            'September',
            'Október',
            'November',
            'December'
        ],
        monthNamesShort: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Máj',
            'Jún',
            'Júl',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dec'
        ],
        dayNames: [
            'Nedeľa',
            'Pondelok',
            'Utorok',
            'Streda',
            'Štvrtok',
            'Piatok',
            'Sobota'
        ],
        dayNamesShort: [
            'Ned',
            'Pon',
            'Uto',
            'Str',
            'Štv',
            'Pia',
            'Sob'
        ],
        dayNamesMin: [
            'Ne',
            'Po',
            'Ut',
            'St',
            'Št',
            'Pia',
            'So'
        ],
        dateFormat: 'd.m.yy',
        firstDay: 0,
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['sk']);

    $("#from-date").datepicker($.datepicker.regional["sk"]);

    $("#to-date").datepicker($.datepicker.regional["sk"]);

})

/***/ })

/******/ });