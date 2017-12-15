import moment from 'moment';
import picker from 'jquery-datepicker';
import $ from 'jquery';

var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('myCtrl', function ($scope, $http) {

    $scope.orderPredicate = 'name';
    $scope.orderReverse = true;
    $scope.orderSort = function (predicate) {
        $scope.orderReverse = ($scope.orderPredicate === predicate) ? !$scope.orderReverse : false;
        $scope.orderPredicate = predicate;
    };

    $scope.workPredicate = 'name';
    $scope.workReverse = true;
    $scope.workSort = function (predicate) {
        $scope.workReverse = ($scope.workPredicate === predicate) ? !$scope.workReverse : false;
        $scope.workPredicate = predicate;
    };

    $scope.from = new Date(2010, 10, 15);
    $scope.to = new Date(2020, 10, 15);

    $scope.getStats = function () {
        $http.post('/stats', {
            from: $scope.from,
            to: $scope.to
        }).success(function (data) {
            console.log(JSON.stringify(data.workSum));
            $scope.totalCount = data.totalCount;
            $scope.totalSum = data.totalSum;
            $scope.orders = data.orders;
            $scope.workSum = [];
            $scope.orderSum = [];
            for (var prop in data.workSum) {
                $scope.workSum.push({
                    name: prop,
                    count: data.workSum[prop].count,
                    sum: data.workSum[prop].sum,
                    time: data.workSum[prop].time

                })
            }
            for (var prop in data.orderSum) {
                $scope.orderSum.push({
                    name: prop,
                    count: data.orderSum[prop].count,
                    sum: data.orderSum[prop].sum,
                    time: data.orderSum[prop].time
                })
            }
        }).error(function (data) {
            console.log(JSON.stringify(data));
        })
    }

    $scope.getStats();

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

                $("#from-label").addClass("active");

                console.log('from', dateText);

                var dateParts = dateText.split('.');

                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);

                $scope.from = date;

                $scope.$apply();
            }
        });

        $("#to-date").datepicker({
            onSelect: function (dateText) {

                $("#to-label").addClass("active");

                console.log('to selected ', dateText);

                var dateParts = dateText.split('.');

                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]) + 1);

                $scope.to = date;

                $scope.$apply();
            }
        });

        $("#from-date").datepicker($.datepicker.regional["sk"]);

        $("#to-date").datepicker($.datepicker.regional["sk"]);
    })
});

function parseDate(time) {

    var days = moment(time).utc().format('D');
    var minutes = moment(time).utc().format('m');
    var hours = moment(time).utc().format('H');
    var string = hours + " hodín, " + minutes + " minút.";

    var daysNumber = parseInt(days) - 1;

    string = daysNumber + " dní, " + string;

    return string;
}

