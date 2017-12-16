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

    $scope.typeChange = function () {
        console.log($scope.typeSelect.value);
        $scope.orders = window.orders;

        if ($scope.typeSelect.value == $scope.typeSelect.choices[1]) {
            $scope.orders = $filter('filter')($scope.orders, {state: STATE.arrived});

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[2]) {
            $scope.orders = $filter('filter')($scope.orders, {state: STATE.working});

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[3]) {
            $scope.orders = $filter('filter')($scope.orders, {state: STATE.done});

        } else if ($scope.typeSelect.value == $scope.typeSelect.choices[4]) {
            $scope.orders = $filter('filter')($scope.orders, {state: STATE.pickUp});

        }
    }

    $scope.fromChange = function () {

    }

    $scope.toChange = function () {

    }

    $scope.dateSelect = {
        value: '',
        choices: ['', 'Dátum prijatia', 'Dátum začatia', 'Dátum ukončenia', 'Dátum vyzvihnutia']
    }

    $scope.dateChange = function () {
        
    }

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

        $("#from-date").datepicker({
            onSelect: function (dateText) {
                
                var dateParts = dateText.split('.');
                
                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);
                
                var resultArray = [];

                $scope.orders.forEach(function (order) {
                    var orderDate = new Date(order.arriveDate);
                    var compareDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
                    console.log(order.description, compareDate, date);
                })

                console.log('from selected ', date.toDateString());
            }
        });

        $("#to-date").datepicker({
            onSelect: function (dateText) {
                console.log('to selected ', dateText);
            }
        });
    
        $("#from-date").datepicker($.datepicker.regional["sk"]);
    
        $("#to-date").datepicker($.datepicker.regional["sk"]);

        

    })

})