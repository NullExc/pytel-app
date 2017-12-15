import http from '../lib/http.js';
import STATE from './state.js';
import $ from 'jquery';

var app = angular.module('Customer', ['ui.materialize']);

app.controller('CustomerCtrl', function ($scope, $http, $filter) {

    $scope.customer = window.customer;

    $scope.orders = window.orders;

    $scope.STATE = STATE;

    $scope.person = $scope.customer.person ? true : false;

    $scope.deleteCustomer = function () {

        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];

        console.log(id);

        $http.delete('/customer/' + id)
            .success(function (data) {
                location.href = '/customer/all';
            })
    }

    $scope.editCustomer = function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/customer-edit/' + id;
    }

    



})

/*$(document).ready(function () {


    var orders = document.getElementsByClassName('collapsible-body');
    var allInfo = document.getElementById('all-info');

    for (var i = 0; i < orders.length; i++) {
        orders[i].style.maxHeight = $("#all-info").height() - (4 * ($(".collapsible-header").height()));
    }

    $("#deleteCustomer").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        console.log(id);
        $.ajax({
            url: '/customer/' + id,
            type: 'DELETE',
            success: function (result) {
                location.href = '/customer/all';
            }
        })
    });

    $("#edit").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/customer-edit/' + id;
    });

    $('.modal').modal();

    var options = {
        url: '/customer/names',
        method: 'get'
    }

    http.request(options, (err, response) => {
        if (response && response.data) {
            var names = {};
            response.data.names.forEach(function (name) {
                names[name] = null;
            })
            $('input.autocomplete').autocomplete({
                data: names,
                limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function (val) {
                    console.log(val);
                },
                minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            });
        }
    })
})*/