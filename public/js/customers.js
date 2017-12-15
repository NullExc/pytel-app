import STATE from './state';

var app = angular.module('Customers', ['ui.materialize']);

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
            orderRequest(STATE.arrived);

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[2]) {
            orderRequest(STATE.working);

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[3]) {
            orderRequest(STATE.done);

        } else if ($scope.orderSelect.value == $scope.orderSelect.choices[4]) {
            orderRequest(STATE.pickUp);

        }
    }

    var orderRequest = function (order) {
        console.log(order);

        $http.post('/customer/sort', {
            customers: window.customers,
            order: order
        }).success(function (data) {
            console.log('arrived', JSON.stringify(data));
            $scope.customers = data;
        })
    }

})