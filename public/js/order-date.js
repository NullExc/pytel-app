
import * as $ from 'jquery';
import picker from 'jquery-datepicker';
import calendar from '../lib/calendar.js';
import STATE from './state.js';

var app = angular.module('OrderInput');

app.controller('DateInputCtrl', function ($scope) {

    $scope.arrivedDate = new Date();
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.pickupDate = new Date();

    $("#state-selector").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});

    $scope.checkDates = function (order) {

        var result = {
            check: true
        }

        if (order.state === STATE.working ||
            order.state === STATE.done ||
            order.state === STATE.pickUp) {
            if (order.arriveDate > order.startDate) {
                result.check = false;
                result.text = "Dátum prijatia musí byť menší."
            }
        }
        if (order.state === STATE.done ||
            order.state === STATE.pickUp) {
            if (order.startDate > order.endDate) {
                result.check = false;
                result.text = "Dátum začatia musí byť menší."
            }
        }
        if (order.state === STATE.pickUp) {
            if (order.endDate > order.pickDate) {
                result.check = false;
                result.text = "Dátum ukončenia musí byť menší."
            }
        }
        return result;
    }

    $scope.parseDate = function (dateObject, dateText) {

        var dateParts = dateText.split('.');

        dateObject.setFullYear(parseInt(dateParts[2]));
        dateObject.setMonth(parseInt(dateParts[1] - 1));
        dateObject.setDate(parseInt(dateParts[0]));

        //var parsedDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]), 1, 1);

        return dateObject;
    }

    $scope.inputDate = function (dateText, dateInputId, timeInputId) {

        var date = new Date(dateText);

        var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        $(dateInputId).val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
            + '.' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
            + '.' + utcDate.getFullYear());

        $(timeInputId).val((utcDate.getHours() >= 10 ? utcDate.getHours() : ('0' + utcDate.getHours()))
            + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

    }

    var parentScope = $scope.$parent;

    parentScope.stateChild = $scope;

    $(document).ready(function () {

        $.datepicker.regional['sk'] = calendar.calendarSettings;
        $.datepicker.setDefaults($.datepicker.regional['sk']);

        $("#arrived-date").datepicker({
            onSelect: function (dateText) {
                $("#arrived-label").addClass('active');
                $scope.arrivedDate = $scope.parseDate($scope.arrivedDate, dateText);
                $scope.$apply();
            }
        });
        $("#arrived-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#arrived-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                //time.setUTCHours(time.getUTCHours() + 1);
                $scope.arrivedDate.setHours(time.getHours());
                $scope.arrivedDate.setMinutes(time.getMinutes());

                console.log("arrived time change", $scope.arrivedDate);
            }
        });

        $("#start-date").datepicker({
            onSelect: function (dateText) {
                $("#start-label").addClass('active');
                $scope.startDate = $scope.parseDate($scope.startDate, dateText);
                $scope.$apply();
            }
        });

        $("#start-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#start-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                $scope.startDate.setHours(time.getHours());
                $scope.startDate.setMinutes(time.getMinutes());

                console.log('jquery start-time', $scope.startDate);
            }
        });

        $("#end-date").datepicker({
            onSelect: function (dateText) {
                $("#end-label").addClass('active');
                $scope.endDate = $scope.parseDate($scope.endDate, dateText);
                $scope.$apply();
            }
        });

        $("#end-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#end-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                $scope.endDate.setHours(time.getHours());
                $scope.endDate.setMinutes(time.getMinutes());

                console.log('jquery end-time', $scope.endDate);
            }
        });

        $("#pickup-date").datepicker({
            onSelect: function (dateText) {
                $("#pickup-label").addClass('active');
                $scope.pickupDate = $scope.parseDate($scope.pickupDate, dateText);
                $scope.$apply();
            }
        });

        $("#pickup-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#pickup-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                $scope.pickupDate.setHours(time.getHours());
                $scope.pickupDate.setMinutes(time.getMinutes());

                console.log('jquery pickup-time', $scope.pickupDate);
            }
        });

        var arrivedDateHelp = new Date($scope.$parent.order.arriveDate);
        $scope.arrivedDate = new Date(arrivedDateHelp.getUTCFullYear(), arrivedDateHelp.getUTCMonth(), arrivedDateHelp.getUTCDate(), arrivedDateHelp.getUTCHours(), arrivedDateHelp.getUTCMinutes(), arrivedDateHelp.getUTCSeconds());
        $scope.inputDate($scope.$parent.order.arriveDate, "#arrived-date", "#arrived-time");

        if ($scope.$parent.order.state === STATE.working ||
            $scope.$parent.order.state === STATE.done ||
            $scope.$parent.order.state === STATE.pickUp) {

            var startDateHelp = new Date($scope.$parent.order.startDate);
            $scope.startDate = new Date(startDateHelp.getUTCFullYear(), startDateHelp.getUTCMonth(), startDateHelp.getUTCDate(), startDateHelp.getUTCHours(), startDateHelp.getUTCMinutes(), startDateHelp.getUTCSeconds());
            $scope.inputDate($scope.$parent.order.startDate, "#start-date", "#start-time");

        }

        if ($scope.$parent.order.state === STATE.done ||
            $scope.$parent.order.state === STATE.pickUp) {

            var endDateHelp = new Date($scope.$parent.order.endDate);
            $scope.endDate = new Date(endDateHelp.getUTCFullYear(), endDateHelp.getUTCMonth(), endDateHelp.getUTCDate(), endDateHelp.getUTCHours(), endDateHelp.getUTCMinutes(), endDateHelp.getUTCSeconds());
            $scope.inputDate($scope.$parent.order.endDate, "#end-date", "#end-time");
        }

        if ($scope.$parent.order.state === STATE.pickUp) {

            var pickDateHelp = new Date($scope.$parent.order.pickDate);
            $scope.pickupDate = new Date(pickDateHelp.getUTCFullYear(), pickDateHelp.getUTCMonth(), pickDateHelp.getUTCDate(), pickDateHelp.getUTCHours(), pickDateHelp.getUTCMinutes(), pickDateHelp.getUTCSeconds());
            $scope.inputDate($scope.$parent.order.pickDate, "#pickup-date", "#pickup-time");
        }

        /*console.log("arrivedDate", $scope.arrivedDate);
        console.log("startDate", $scope.startDate);
        console.log("endDate", $scope.endDate);
        console.log("pickupDate", $scope.pickupDate);*/

        $("#arrived-label").addClass('active');
        $("#start-label").addClass('active');
        $("#end-label").addClass('active');
        $("#pickup-label").addClass('active');

        $(".time-label").addClass('active');

    })
})


app.controller('SaleDateInputCtrl', function ($scope) {

    $scope.orderedDate = new Date();
    $scope.obtainedDate = new Date();
    $scope.leavedDate = new Date();

    $("#sale-selector").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});

    $scope.checkDates = function (order) {

        var result = {
            check: true
        }

        if (order.state === STATE.saleObtained ||
            order.state === STATE.saleLeaved) {
            if (order.orderedDate > order.obtainedDate) {
                result.check = false;
                result.text = "Dátum objednania musí byť menší."
            }
        }
        if (order.state === STATE.saleLeaved) {
            if (order.obtainedDate > order.leavedDate) {
                result.check = false;
                result.text = "Dátum vyzdvihnutia zákazníkom musí byť menší."
            }
        }
        return result;
    }

    $scope.parseDate = function (dateObject, dateText) {

        var dateParts = dateText.split('.');

        dateObject.setFullYear(parseInt(dateParts[2]));
        dateObject.setMonth(parseInt(dateParts[1] - 1));
        dateObject.setDate(parseInt(dateParts[0]));

        //var parsedDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]), 1, 1);

        return dateObject;
    }

    $scope.inputDate = function (dateText, dateInputId, timeInputId) {

        var date = new Date(dateText);

        var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        $(dateInputId).val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
            + '.' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
            + '.' + utcDate.getFullYear());

        $(timeInputId).val((utcDate.getHours() >= 10 ? utcDate.getHours() : ('0' + utcDate.getHours()))
            + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

    }

    var parentScope = $scope.$parent;

    parentScope.saleChild = $scope;

    $(document).ready(function () {

        $.datepicker.regional['sk'] = calendar.calendarSettings;
        $.datepicker.setDefaults($.datepicker.regional['sk']);

        console.log("****Preco nejde datepicker???? :() ****");

        $("#saleordered-date").datepicker({
            onSelect: function (dateText) {
                $("#saleOrdered-label").addClass('active');
                $scope.orderedDate = $scope.parseDate($scope.orderedDate, dateText);
                $scope.$apply();
            }
        });
        $("#saleordered-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#saleOrdered-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                //time.setUTCHours(time.getUTCHours() + 1);
                $scope.orderedDate.setHours(time.getHours());
                $scope.orderedDate.setMinutes(time.getMinutes());

                console.log("arrived time change", $scope.orderedDate);
            }
        });

        $("#saleObtained-date").datepicker({
            onSelect: function (dateText) {
                $("#saleObtained-label").addClass('active');
                $scope.obtainedDate = $scope.parseDate($scope.obtainedDate, dateText);
                $scope.$apply();
            }
        });

        $("#saleObtained-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#saleObtained-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                $scope.obtainedDate.setHours(time.getHours());
                $scope.obtainedDate.setMinutes(time.getMinutes());

                console.log('jquery start-time', $scope.obtainedDate);
            }
        });

        $("#saleLeaved-date").datepicker({
            onSelect: function (dateText) {
                $("#saleLeaved-label").addClass('active');
                $scope.leavedDate = $scope.parseDate($scope.leavedDate, dateText);
                $scope.$apply();
            }
        });

        $("#saleLeaved-date").datepicker($.datepicker.regional["sk"]);

        $scope.$parent.jquery('#saleLeaved-time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                $scope.leavedDate.setHours(time.getHours());
                $scope.leavedDate.setMinutes(time.getMinutes());

                console.log('jquery end-time', $scope.leavedDate);
            }
        });

        var orderedDateHelp = new Date($scope.$parent.order.orderedDate);
        $scope.orderedDate = new Date(orderedDateHelp.getUTCFullYear(), orderedDateHelp.getUTCMonth(), orderedDateHelp.getUTCDate(), orderedDateHelp.getUTCHours(), orderedDateHelp.getUTCMinutes(), orderedDateHelp.getUTCSeconds());
        $scope.inputDate($scope.$parent.order.orderedDate, "#saleordered-date", "#saleOrdered-time");

        if ($scope.$parent.order.state === STATE.saleObtained ||
            $scope.$parent.order.state === STATE.saleLeaved) {

            var obtainedDateHelp = new Date($scope.$parent.order.obtainedDate);
            $scope.obtainedDate = new Date(obtainedDateHelp.getUTCFullYear(), obtainedDateHelp.getUTCMonth(), obtainedDateHelp.getUTCDate(), obtainedDateHelp.getUTCHours(), obtainedDateHelp.getUTCMinutes(), obtainedDateHelp.getUTCSeconds());
            $scope.inputDate($scope.$parent.order.obtainedDate, "#saleObtained-date", "#saleObtained-time");
        }

        if ($scope.$parent.order.state === STATE.saleLeaved) {

            var leavedDateHelp = new Date($scope.$parent.order.leavedDate);
            $scope.leavedDate = new Date(leavedDateHelp.getUTCFullYear(), leavedDateHelp.getUTCMonth(), leavedDateHelp.getUTCDate(), leavedDateHelp.getUTCHours(), leavedDateHelp.getUTCMinutes(), leavedDateHelp.getUTCSeconds());
            $scope.inputDate($scope.$parent.order.leavedDate, "#saleLeaved-date", "#saleLeaved-time");
        }

        /*console.log("arrivedDate", $scope.orderedDate);
        console.log("startDate", $scope.obtainedDate);
        console.log("endDate", $scope.leavedDate);*/

        $("#saleOrdered-label").addClass('active');
        $("#saleObtained-label").addClass('active');
        $("#saleLeaved-label").addClass('active');

        $(".time-label").addClass('active');

    })



});