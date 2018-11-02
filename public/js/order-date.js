
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

    $scope.currentInputData = function (dateInputId, timeInputId) {

        var date = new Date();

        var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours(), date.getUTCMinutes(), date.getUTCSeconds());

        $(dateInputId).val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
            + '.' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
            + '.' + utcDate.getFullYear());

        $(timeInputId).val((utcDate.getHours() >= 10 ? utcDate.getHours() : ('0' + utcDate.getHours()))
            + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

        console.log("current", utcDate);

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

    parentScope.child = $scope;

    $(document).ready(function () {

        $.datepicker.regional['sk'] = calendar.calendarSettings;
        $.datepicker.setDefaults($.datepicker.regional['sk']);

        $("#arrived-date").datepicker({
            onSelect: function (dateText) {
                $("#arrived-label").addClass('active');
                $scope.arrivedDate = $scope.parseDate($scope.arrivedDate, dateText);
                $scope.$apply();

                /*console.log("arrivedDate", $scope.arrivedDate);
                console.log("startDate", $scope.startDate);
                console.log("endDate", $scope.endDate);
                console.log("pickupDate", $scope.pickupDate);*/
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

        console.log("arrivedDate", $scope.arrivedDate);
        console.log("startDate", $scope.startDate);
        console.log("endDate", $scope.endDate);
        console.log("pickupDate", $scope.pickupDate);

        $("#arrived-label").addClass('active');
        $("#start-label").addClass('active');
        $("#end-label").addClass('active');
        $("#pickup-label").addClass('active');

        $(".time-label").addClass('active');

    })
})