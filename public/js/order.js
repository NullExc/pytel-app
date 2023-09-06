import STATE from './state.js';
import http from '../lib/http.js';
import googleAuth from '../lib/google-auth';
import calendar from '../lib/calendar.js';
import picker from '../lib/picker.js';

var app = angular.module('Order', ['ui.materialize']);

app.controller('OrderCtrl', function ($scope, $http, $filter) {

    $scope.order = window.order;
    $scope.customer = window.customer;
    $scope.workType = window.workType;
    $scope.orderType = window.orderType;

    $scope.sale = $scope.order.sale;

    $scope.navName = $scope.order.description;

    $scope.facilitiesString = "";

    if (window.facilities) {

        if (window.facilities.length == 1) {
            $scope.facilitiesString = window.facilities[0].name;
        } else {
            window.facilities.forEach(function (facility) {
                $scope.facilitiesString += facility.name + ", ";
            });
            $scope.facilitiesString = $scope.facilitiesString.substring(0, $scope.facilitiesString.length - 2);
        }
    }

    $scope.hasPhotos = false;

    $scope.date = new Date();

    if (!$scope.order.photoUrls) {
        $scope.order.photoUrls = [];
    }

    if ($scope.order.photoUrls.length > 0) {
        $scope.hasPhotos = true;
    }

    console.log('customer', $scope.customer);

    $scope.contact = {};
    $scope.address = {};

    if ($scope.customer.company) {

        if ($scope.customer.company.contactPerson) {
            $scope.contact.phone = $scope.customer.company.contactPerson.phone;
            $scope.contact.email = $scope.customer.company.contactPerson.email;
        }
        if ($scope.customer.company.address) {
            $scope.address.street =  $scope.customer.company.address.street;
            $scope.address.streetNumber = $scope.customer.company.address.streetNumber;
            $scope.address.city = $scope.customer.company.address.city;
            $scope.address.zipCode = $scope.customer.company.address.zipCode;
        }

    } else if ($scope.customer.person) {

        $scope.contact.phone = $scope.customer.person.phone;
        $scope.contact.email = $scope.customer.person.email;

        if ($scope.customer.person.address) {
            $scope.address.street =  $scope.customer.person.address.street;
            $scope.address.streetNumber = $scope.customer.person.address.streetNumber;
            $scope.address.city = $scope.customer.person.address.city;
            $scope.address.zipCode = $scope.customer.person.address.zipCode;
        }
    }



    /*if ($scope.order && $scope.order.photoUrl) {
        $('#photo-pic').attr('src', $scope.order.photoUrl);
    } else {
        $('.show-photo').addClass("disabled");
    }*/

    $scope.deleteOrder = function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];

        $http.delete('/order/' + id).then(function success(data) {
            location.href = '/order/all';
        }, function error(err) {
            console.log(err);
        })

    }

    $scope.editOrder = function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/order-edit/' + id;
    }

    $scope.showCustomer = function () {
        location.href = '/customer/' + $scope.customer._id;
    }

    $scope.printOrder = function () {

        var pathname = window.location.pathname.split("/");

        var id = pathname[pathname.length - 1];

        if (!$scope.printFrame) {

            $scope.printFrame = document.createElement("iframe");
            $scope.printFrame.src = location.origin + "/order/print/" + id;
            $scope.printFrame.name = "print_frame";
            $scope.printFrame.style.display = "none";

            window.document.body.appendChild($scope.printFrame);
        }

        if (document["print_frame"]) {
            document["print_frame"].print();
        } else if (window["print_frame"]) {
            window["print_frame"].print();
        }
    }

   $(document).ready(function () {

        console.log("jquery loaded", facilities);

        /*if ($scope.sale) {
            $("#regular-order-state").addClass("hide");
            $("#sale-order-state").removeClass("hide");
        } else {
            $("#regular-order-state").removeClass("hide");
            $("#sale-order-state").addClass("hide");
        }*/

        $('.carousel').carousel({indicators: true});
        $('.materialboxed').materialbox();

        var data = [];

        facilities.forEach(function (facility) {
            data.push({ tag: facility.name });
        })

        $('.chips').chips();

        $('#photo-chips').chips({
            data: $scope.order.photoUrls,
            onChipSelect: function (chips, elem, selected) {

                var chipsData = chips[0].M_Chips.chipsData;
                var chipText = $(elem).clone().children().remove().end().text();

                chipsData.forEach(function (chip) {
                    if (chip.tag === chipText) {
                        console.log("there is a match", chip);

                        $('#photo-pic').attr('src', chip.url);

                        var instance = M.Modal.getInstance($('#photo-modal'));
                        instance.open();
                    }
                })
            }
          });

        $('.chips-initial').chips({
            data: data
          });
    
          $('#photo-chips input').remove(); 
          $('#photo-chips .close').remove();
          $('#facility-chips input').remove(); 
          $('#facility-chips .close').remove(); 
    })
})