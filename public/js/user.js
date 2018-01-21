import http from '../lib/http.js';
import preloader from '../lib/preloader.js';

//import angularCookies from 'angular-cookies';

var app = angular.module('User', []);

app.controller('UserCtrl', function ($scope, $http) {

   // $scope.info = 'Prebieha prihlasovanie ...';

    $scope.loginEmail = "";

    $scope.loginPassword = "";

    $scope.registerEmail = "";

    $scope.registerPassword = "";

    $scope.repeatPassword = "";

    $scope.loginError = false;

    $scope.registerEmailError = false;

    $scope.registerPasswordError = false;

    $scope.registerMatchError = false;

    $scope.registerSuccess = false;

   // console.log('cookies', $cookies);

    $scope.login = function () {

        preloader.open('Prebieha prihlasovanie ...');

        $http.post('/login', {
            email: $scope.loginEmail,
            password: $scope.loginPassword
        })
        .success(function (data) {
            console.log('data', data);

            location.href = '/order-new';

            preloader.close();
        })
        .error(function (error) {

            if (error) {
                $scope.loginError = true;
            }

            preloader.close();

            console.log('error', error);
        })
        

       // console.log('login', $scope.loginEmail, $scope.loginPassword);

    }

    $scope.register = function () {

        $scope.registerEmailError = false;

        $scope.registerPasswordError = false;

        $http.post('/register', {
            email: $scope.registerEmail,
            password: $scope.registerPassword,
            passwordConf: $scope.repeatPassword
        })
        .success(function (data) {
            console.log('data', data);

            $scope.registerSuccess = true;
        })
        .error(function (error) {
            console.log('error', error);

            if (error.status === 402) {
                $scope.registerEmailError = true;

            } else if (error.status === 403) {
                $scope.registerPasswordError = true;

            } else if (error.status === 400) {
                $scope.registerMatchError = true;

            }
        })

        console.log('register', $scope.registerEmail, $scope.registerPassword, $scope.repeatPassword);

    }



})