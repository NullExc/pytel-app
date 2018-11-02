import moment from 'moment';
import picker from 'jquery-datepicker';
import $ from 'jquery';
import preloader from '../lib/preloader.js';

var app = angular.module('myApp', ['angularUtils.directives.dirPagination']);

app.controller('myCtrl', function ($scope, $http, $filter) {

    $scope.totalCount;
    $scope.totalSum;
    $scope.orders;
    $scope.workSum;
    $scope.orderSum;
    $scope.totalTime;

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

    $scope.clickOrder = function (id) {
        console.log('click', id, screen.width);
        if (screen.width < 600) {
            location.href = '/order/' + id;
        }
    }

    var date = new Date();

    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    var firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1, 1, 1);

    var lastDayDate = new Date(date.getFullYear(), date.getMonth(), lastDay, 24, 59);

    $scope.from = firstDayDate;
    $scope.to = lastDayDate;

    $scope.fromString = $filter('date')(lastDayDate, 'yyyy-MM-dd');

    console.log('from', firstDayDate.getUTCDate());

    $scope.getStats = function () {

        preloader.open('Pripravujú sa údaje ...');

        $http.post('/stats', {
            from: $scope.from,
            to: $scope.to
        }).success(function (data) {
            //console.log(JSON.stringify(data, 2, 2));
            $scope.totalTime = data.totalTime;
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
            preloader.close();
        }).error(function (data) {
            console.log(JSON.stringify(data));
            preloader.close();
        })
    }

    $scope.getStats();

    $scope.parseDate = function (time) {

        //time = parseInt(time);

        var days = moment(time).utc().format('D');
        var minutes = moment(time).utc().format('m');
        var hours = moment(time).utc().format('H');
        var string = hours + " hodín, " + minutes + " minút.";

        var daysNumber = parseInt(days) - 1;

        if (daysNumber > 0) string = daysNumber + " dní, " + string;

        console.log(time, minutes);

        return string;
    }

    $scope.timePercentage = function (time) {
        var value = 100 / ($scope.totalTime / time);
        return Math.round(value * 100) / 100;
    }

    $scope.countPercentage = function (count) {
        var value = 100 / ($scope.totalCount / count);
        return Math.round(value * 100) / 100;
    }

    $scope.pricePercentage = function (price) {
        var value = 100 / ($scope.totalSum / price);
        return Math.round(value * 100) / 100;
    }

    console.log('total time', $scope.parseDate(244724000));

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

        //$("#to-date").val($scope.from);

        console.log('to', $scope.to, 'from', $scope.from);

        $("#from-date").datepicker({
            onSelect: function (dateText) {

                console.log('from', dateText);

                var dateParts = dateText.split('.');

                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]), 1, 1);

                $scope.from = date;

                $scope.$apply();

                $scope.getStats();

            }
        });

        $("#to-date").datepicker({
            onSelect: function (dateText) {

                console.log('to selected ', dateText);

                var dateParts = dateText.split('.');

                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]), 24, 59);

                $scope.to = date;

                $scope.$apply();

                $scope.getStats();
            }
        });

        $("#from-date").datepicker($.datepicker.regional["sk"]);

        $("#to-date").datepicker($.datepicker.regional["sk"]);
    })
});

