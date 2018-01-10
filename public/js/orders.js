import $ from 'jquery';
import picker from 'jquery-datepicker';
import STATE from './state';

var app = angular.module('Orders', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('OrdersCtrl', function ($scope, $http, $filter) {

    $scope.orders = window.orders;

    $scope.typeSelect = {
        value: 'Všetky',
        choices: ['Všetky', 'Prijaté', 'Prebiehajúce', 'Čakajúce na vyzdvihnutie', 'Vyzdvihnuté']
    }

    $scope.dateSelect = {
        value: 'Dátum prijatia',
        choices: ['Dátum prijatia', 'Dátum začatia', 'Dátum ukončenia', 'Dátum vyzvihnutia']
    }

    $scope.typeChange = function () {


        filter(false);

        /*console.log($scope.typeSelect.value);
        $scope.orders = window.orders;

        if ($scope.typeSelect.value == $scope.typeSelect.choices[1]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.arrived });

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[2]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.working });

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[3]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.done });

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[4]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.pickUp });

        }*/
    }

    $scope.dateChange = function () {
        console.log('date change');

        filter(false);
    }

    var date = new Date();

    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    var firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1, 1, 1);

    var lastDayDate = new Date(date.getFullYear(), date.getMonth(), lastDay, 24, 59);

    $scope.from = firstDayDate;
    $scope.to = lastDayDate;

    $scope.fromString = $filter('date')(lastDayDate, 'yyyy-MM-dd');

    $(document).ready(function () {

        console.log("jquery loaded ");

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



        $("#from-label").addClass("active");

        $("#from-date").val(($scope.from.getDate()) + '.' + ($scope.from.getMonth() + 1) + '.' + $scope.from.getFullYear());

        $("#to-label").addClass("active");

        $("#to-date").val(($scope.to.getUTCDate()) + '.' + ($scope.to.getUTCMonth() + 1) + '.' + $scope.to.getUTCFullYear());

        $("#from-date").datepicker({
            onSelect: function (dateText) {

                console.log('date type', $scope.dateSelect.value);

                var dateParts = dateText.split('.');

                //var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);

                $scope.from = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);

                $scope.$apply();

                filter(true);
            }
        });

        $("#to-date").datepicker({
            onSelect: function (dateText) {
                console.log('date type', $scope.dateSelect.value);

                var dateParts = dateText.split('.');

                //var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);

                $scope.to = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);

                $scope.$apply();

                filter(true);
            }
        });

        $("#from-date").datepicker($.datepicker.regional["sk"]);

        $("#to-date").datepicker($.datepicker.regional["sk"]);

    })

    var filter = function (jquery) {
        var resultArray = [];

        $scope.orders = window.orders;

        if ($scope.typeSelect.value == $scope.typeSelect.choices[1]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.arrived });

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[2]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.working });

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[3]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.done });

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[4]) {
            $scope.orders = $filter('filter')($scope.orders, { state: STATE.pickUp });

        }

        $scope.orders.forEach(function (order) {

            var orderDate;

            var compare = false;

            if ($scope.dateSelect.value == $scope.dateSelect.choices[0]) {
                orderDate = new Date(order.arriveDate);
                compare = true;
            } else if ($scope.dateSelect.value == $scope.dateSelect.choices[1] && (order.state == STATE.working || order.state == STATE.done || order.state == STATE.pickUp)) {
                orderDate = new Date(order.startDate);
                compare = true;
            } else if ($scope.dateSelect.value == $scope.dateSelect.choices[2] && (order.state == STATE.done || order.state == STATE.pickUp)) {
                orderDate = new Date(order.endDate);
                compare = true;
            } else if ($scope.typeSelect.value == $scope.typeSelect.choices[3] && order.state == STATE.pickUp) {
                orderDate = new Date(order.pickDate);
                compare = true;
            }

            if (compare) {
                var compareDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate() + 1);

                if (compareDate.getTime() >= $scope.from.getTime() && compareDate.getTime() <= $scope.to.getTime()) {
                    console.log('add', order.description, compareDate, date);
                    resultArray.push(order);
                } else {
                    console.log('remove', order.description, compareDate, date);
                }
            }
        })

        $scope.orders = resultArray;

        if (jquery) {
            $scope.$apply();
        }
    }

    filter(false);

})