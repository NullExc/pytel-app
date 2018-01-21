import calendar from '../lib/calendar';
import googleAuth from '../lib/google-auth';
import $ from 'jquery';
import preloader from '../lib/preloader.js';

var app = angular.module('Settings', ['angularUtils.directives.dirPagination']);

app.controller('SettingsCtrl', function ($scope, $http, $filter) {

    $scope.orderTypes = window.orderTypes;

    $scope.workTypes = window.workTypes;

    $scope.selectWorkType;

    $scope.selectOrderType;

    $scope.newWork = false;

    $scope.newType = false;

    $scope.newWorkName = '';

    $scope.newOrderName = '';

    $scope.orderTypes = $filter('orderBy')($scope.orderTypes, 'name', false);

    $scope.workTypes = $filter('orderBy')($scope.workTypes, 'name', false);

    $scope.googleLogin = function () {

        googleAuth.handleClientLoad(function (GoogleApi, token) {

            console.log('googleapi', GoogleApi);

            console.log('token', token);

        })

        console.log('google login', googleAuth.isClientSigned);
    }

    $scope.googleLogout = function () {
    
        googleAuth.handleSignoutClick();
    }

    $scope.pickWorkType = function (name) {

        getWorkType(name);
    }

    $scope.deleteWorkType = function () {

        var id = $scope.selectWorkType._id;

        var index = $scope.workTypes.indexOf($scope.selectWorkType);

        console.log(id);

        $http.delete('/worktype/' + id).then(function success(data) {
            console.log(data);

            if (index > -1) {
                $scope.workTypes.splice(index, 1);
            }

        }, function error(err) {
            console.log(err);
        })

    }

    $scope.pickOrderType = function (name) {

        getOrderType(name);
    }

    $scope.deleteOrderType = function () {

        var id = $scope.selectOrderType._id;

        var index = $scope.orderTypes.indexOf($scope.selectOrderType);

        $http.delete('/ordertype/' + id).then(function success(data) {
            console.log(data);

            if (index > -1) {
                $scope.orderTypes.splice(index, 1);
            }

        }, function error(err) {
            console.log(err);
        })

    }

    var getOrderType = function (name) {

        var result;

        $scope.orderTypes.forEach(function (orderType) {

            if (orderType.name === name) {
                
                $scope.selectOrderType = orderType;
                
                $("#edit-ordertype").val(orderType.name);
                
                result = orderType;
            }
        })
        return result;
    }

    var getWorkType = function (name) {

        var result;

        $scope.workTypes.forEach(function (workType) {

            if (workType.name === name) {
                
                $scope.selectWorkType = workType;
                
                $("#edit-worktype").val(workType.name);
                
                result = workType;
            }
        })
        return result;
    }

    $scope.workInput = function () {
        if ($scope.newWork === true) {
            createWorkType();
        } else {
            $scope.newWork = true;
        }
    }

    $scope.typeInput = function () {
        if ($scope.newType === true) {
            createOrderType();
        } else {
            $scope.newType = true;
        }
    }

    var createOrderType = function () {

        preloader.open('Vytvára sa typ zákazky ...');

        $http.post('/ordertype', {
            name: $scope.newOrderName
        }).success(function (response) {

            $scope.newType = false;
            
            console.log(response);

            $scope.orderTypes.push(response);

            preloader.close();

        }).error(function (error) {
            console.log(error);

            preloader.close();
        })
    }

    var createWorkType = function () {

        preloader.open('Vytvára sa typ práce ...');

        $http.post('/worktype', {
            name: $scope.newWorkName
        }).success(function (response) {

            $scope.newWork = false;
           
            console.log(response);

            $scope.workTypes.push(response);

            preloader.close();

        }).error(function (error) {
            console.log(error);

            preloader.close();
        })
    }

    $scope.editOrderType = function () {

        preloader.open('Edituje sa typ zákazky ...');

        var id = $scope.selectOrderType._id;

        var name = $("#edit-ordertype").val();

        $http.post('/ordertype/' + id, { name: name}).then(function success(data) {

            $scope.orderTypes.forEach(function (orderType) {
                if (orderType.name == $scope.selectOrderType.name) {
                    orderType.name = name;
                }
            })

            window.closeOrderModal();

            preloader.close();

        }, function error(err) {
            console.log(err);

            preloader.close();
        })
    }

    $scope.editWorkType = function () {

        preloader.open('Edituje sa typ práce ...');

        var id = $scope.selectWorkType._id;

        var name = $("#edit-worktype").val();

        $http.post('/worktype/' + id, { name: name}).then(function success(data) {

            $scope.workTypes.forEach(function (workType) {
                if (workType.name == $scope.selectWorkType.name) {
                    workType.name = name;
                }
            })

            window.closeWorkModal();

            preloader.close();

        }, function error(err) {
            console.log(err);

            preloader.close();
        })
    }

})




