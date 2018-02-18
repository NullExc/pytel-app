import STATE from './state';

var app = angular.module('Customers', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('CustomersCtrl', function ($scope, $http, $filter) {

    $scope.customers = []; // = window.customers;



    $scope.sortSelect = {
        value: 'Vzostupne',
        choices: ['Vzostupne', 'Zostupne']
    };

    $scope.orderSelect = {
        value: 'Všetky',
        choices: ['Všetky', 'Prijaté', 'Prebiehajúce', 'Čakajúce na vyzdvihnutie', 'Vyzdvihnuté']
    }

    $scope.clickCustomer = function (id) {
        console.log('click', id, screen.width);
        if (screen.width < 600) {
            location.href = '/customer/' + id;
        }
    }

    $scope.newCustomer = function () {
        location.href = '/customer-new';
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
        //console.log(order);

        $http.post('/customer/sort', {
            customers: window.customers,
            order: order
        }).success(function (data) {
            //console.log('arrived', JSON.stringify(data));
            $scope.customers = data;
        })
    }

    $(document).ready(function () {

        var options = {
            url: '/customer/names',
            method: 'get'
        }

     //   var slider = document.getElementById('test-slider');

      /*  noUiSlider.create(slider, {
            start: [20, 80],
            connect: true,
            step: 1,
            orientation: 'horizontal', // 'horizontal' or 'vertical'
            range: {
                'min': 0,
                'max': 100
            },
            format: wNumb({
                decimals: 0
            })
        });

        slider.noUiSlider.on('change', function(){
            console.log('CHNAGE');
        });*/

        $http.get('/customer')
            .success(function (data) {
                $scope.customers = data.customers;
                $scope.sortChange();
            })

        $http.get('/customer/names')
            .success(function (data) {

                if (data.names) {
                    var names = {};
                    data.names.forEach(function (name) {
                        names[name] = null;
                    })
                    $('input.autocomplete').autocomplete({
                        data: names,
                        limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                        onAutocomplete: function (val) {

                            console.log(val);

                            $http.get('/customer/name/' + val)
                                .success(function (data) {

                                    if (data.customer && data.customer._id) {
                                        console.log(data.customer._id);
                                        location.href = '/customer/' + data.customer._id;
                                    }
                                })
                        },
                        minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
                    });
                }
            })
    })

})