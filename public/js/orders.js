import * as $ from 'jquery';
import picker from 'jquery-datepicker';
import STATE from './state';
import preloader from '../lib/preloader.js';
import calendar from '../lib/calendar.js';
import moment from 'moment';

var app = angular.module('Orders', ['angularUtils.directives.dirPagination']);

app.controller('OrdersCtrl', function ($scope, $http, $filter) {

    $scope.today = false;

    $scope.orders;

    $scope.orderByDate = 'arriveDate';

    $scope.typeSelect = {
        value: 'Všetky',
        choices: ['Všetky', 'Prijaté', 'Prebiehajúce', 'Čakajúce na vyzdvihnutie', 'Vyzdvihnuté']
    }

    $scope.dateSelect = {
        value: 'Dátum prijatia',
        choices: ['Dátum prijatia', 'Dátum začatia', 'Dátum ukončenia', 'Dátum vyzvihnutia']
    }

    var filter = function (jquery) {

        console.log("filtering");

        var dateType = "";

        var stateType = "";

        if ($scope.dateSelect.value == $scope.dateSelect.choices[0]) {
            dateType = "arriveDate";

        } else if ($scope.dateSelect.value == $scope.dateSelect.choices[1]) {
            dateType = "startDate"

        } else if ($scope.dateSelect.value == $scope.dateSelect.choices[2]) {
            dateType = "endDate"

        } else if ($scope.dateSelect.value == $scope.dateSelect.choices[3]) {
            dateType = "pickDate";
        }

        if ($scope.typeSelect.value == $scope.typeSelect.choices[1]) {
            stateType = STATE.arrived;

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[2]) {
            stateType = STATE.working;

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[3]) {
            stateType = STATE.done;

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[4]) {
            stateType = STATE.pickUp;

        } else {
            stateType = "all";
        }

        var from = $scope.from;
        var to = $scope.to;

        if ($scope.today) {

            var now = new Date();

            from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 1);

            to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 59);

            console.log('today', from, to);

        }

        preloader.open("Načítavajú sa zákazky ...");

        $http.post('/order/date', {
            from: from,
            to: to,
            dateType: dateType,
            stateType: stateType
        })
            .success(function (data) {

                console.log('collection', data.orders.length, data.orders);

                $scope.orders = data.orders;

                if ($scope.dateSelect.value == $scope.dateSelect.choices[0]) {
                    $scope.orders = $filter('orderBy')($scope.orders, 'arriveDate', false); $scope.orderByDate = 'arriveDate';
                } else if ($scope.dateSelect.value == $scope.dateSelect.choices[1]) {
                    $scope.orders = $filter('orderBy')($scope.orders, 'startDate', false); $scope.orderByDate = 'startDate';
                } else if ($scope.dateSelect.value == $scope.dateSelect.choices[2]) {
                    $scope.orders = $filter('orderBy')($scope.orders, 'endDate', false); $scope.orderByDate = 'endDate';
                } else if ($scope.dateSelect.value == $scope.dateSelect.choices[3]) {
                    $scope.orders = $filter('orderBy')($scope.orders, 'pickDate', false); $scope.orderByDate = 'pickDate';
                }

                preloader.close();
            })
            .error(function (data) {
                console.log('error', data);
                preloader.close();
            })

        $scope.userSettings.orders.dateType = dateType;

        $scope.userSettings.orders.stateType = stateType;

        $http.post('/user-settings', $scope.userSettings)
            .success(function (data) {
                console.log('user setting saved', data);
            })
            .error(function (data) {
                console.log('error', data);
            })
    }

    console.log('user settings from window', window.userSettings);

    $scope.userSettings = window.userSettings;

    if ($scope.userSettings.orders.dateType == "arriveDate") {
        $scope.dateSelect.value = $scope.dateSelect.choices[0];

    } else if ($scope.userSettings.orders.dateType == "startDate") {
        $scope.dateSelect.value = $scope.dateSelect.choices[1];

    } else if ($scope.userSettings.orders.dateType == "endDate") {
        $scope.dateSelect.value = $scope.dateSelect.choices[2];

    } else if ($scope.userSettings.orders.dateType == "pickDate") {
        $scope.dateSelect.value = $scope.dateSelect.choices[3];

    }

    if ($scope.userSettings.orders.stateType == STATE.arrived) {
        $scope.typeSelect.value = $scope.typeSelect.choices[1];

    } else if ($scope.userSettings.orders.stateType == STATE.working) {
        $scope.typeSelect.value = $scope.typeSelect.choices[2];

    } else if ($scope.userSettings.orders.stateType == STATE.done) {
        $scope.typeSelect.value = $scope.typeSelect.choices[3];

    } else if ($scope.userSettings.orders.stateType == STATE.pickUp) {
        $scope.typeSelect.value = $scope.typeSelect.choices[4];

    } else if ($scope.userSettings.orders.stateType == STATE.all) {
        $scope.typeSelect.value = $scope.typeSelect.choices[0];

    }

    var dateFromParts = $scope.userSettings.orders.dateFrom.split('.');

    var dateToParts = $scope.userSettings.orders.dateTo.split('.');

    $scope.from = new Date(parseInt(dateFromParts[2]), parseInt(dateFromParts[1] - 1), parseInt(dateFromParts[0]), 1, 1);

    $scope.to = new Date(parseInt(dateToParts[2]), parseInt(dateToParts[1] - 1), parseInt(dateToParts[0]), 24, 59);

    setTimeout(function () {
        window.updateSelectors();
    }, 300);

    filter(false);

    $scope.newOrder = function () {
        location.href = '/order-new';
    }

    $scope.formatDate = function (val) {

        var date = new Date(val);

        //date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours(), date.getUTCMinutes(), date.getUTCSeconds());

        /*var string = (date.getDate() >= 10 ? date.getDate() : ('0' + (date.getDate())))
            + '.' + (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : ('0' + (date.getMonth() + 1)))
            + '.' + date.getFullYear() + ' '
            + (date.getHours() >= 10 ? date.getHours() : ('0' + (date.getHours()))) + ':'
            + (date.getMinutes() >= 10 ? date.getMinutes() : ('0' + (date.getMinutes())));*/

        var string = moment.utc(date).format('DD.MM.YYYY k:mm');

        return string;
    }

    $scope.todayChange = function () {
        filter(false);
    }

    $scope.typeChange = function () {
        filter(false);
    }

    $scope.dateChange = function () {
        filter(false);
    }

    $scope.clickOrder = function (id) {
        if (screen.width < 600) {
            location.href = '/order/' + id;
        }
    }

    /*var date = new Date();

    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    var firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1, 1, 1);

    var lastDayDate = new Date(date.getFullYear(), date.getMonth(), lastDay, 24, 59);

    $scope.from = firstDayDate;
    $scope.to = lastDayDate;

    $scope.fromString = $filter('date')(lastDayDate, 'yyyy-MM-dd');*/

    $(document).ready(function () {

        $.datepicker.regional['sk'] = calendar.calendarSettings;

        $.datepicker.setDefaults($.datepicker.regional['sk']);

        $("#from-label").addClass("active");

        $("#from-date").val(($scope.from.getDate()) + '.' + ($scope.from.getMonth() + 1) + '.' + $scope.from.getFullYear());

        $("#to-label").addClass("active");

        $("#to-date").val(($scope.to.getUTCDate()) + '.' + ($scope.to.getUTCMonth() + 1) + '.' + $scope.to.getUTCFullYear());

        $("#from-date").datepicker({
            onSelect: function (dateText) {

                var dateParts = dateText.split('.');

                $scope.from = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]), 1, 1);

                $scope.$apply();

                filter(true);

                $scope.userSettings.orders.dateFrom = dateText;
            }
        });

        $("#to-date").datepicker({
            onSelect: function (dateText) {

                var dateParts = dateText.split('.');

                $scope.to = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]), 24, 59);

                $scope.$apply();

                filter(true);

                $scope.userSettings.orders.dateTo = dateText;
            }
        });

        $("#from-date").datepicker($.datepicker.regional["sk"]);

        $("#to-date").datepicker($.datepicker.regional["sk"]);

    })

    var getByDate = function () {

    }
})