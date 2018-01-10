import http from '../lib/http.js';

var app = angular.module('User', []);

app.controller('UserCtrl', function ($scope, $http) {

    $scope.loginEmail = "";

    $scope.loginPassword = "";

    $scope.registerEmail = "";

    $scope.registerPassword = "";

    $scope.repeatPassword = "";

    $scope.login = function () {

        $http.post('/login', {
            email: $scope.loginEmail,
            password: $scope.loginPassword
        })
        .success(function (data) {
            console.log('data', data);
        })
        .error(function (error) {
            console.log('error', error);
        })
        

       // console.log('login', $scope.loginEmail, $scope.loginPassword);

    }

    $scope.register = function () {

        $http.post('/register', {
            email: $scope.registerEmail,
            password: $scope.registerPassword,
            passwordConf: $scope.repeatPassword
        })
        .success(function (data) {
            console.log('data', data);
        })
        .error(function (error) {
            console.log('error', error);
        })

        console.log('register', $scope.registerEmail, $scope.registerPassword, $scope.repeatPassword);

    }



})