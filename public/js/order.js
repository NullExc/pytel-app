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

    $scope.hasPhotos = false;

    $scope.date = new Date();

    if (!$scope.order.photoUrls) {
        $scope.order.photoUrls = [];
    }

    if ($scope.order.photoUrls.length > 0) {
        $scope.hasPhotos = true;
    }

    console.log('photos', $scope.order.photoUrls);

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

        //var printWin = window.open(location.origin + "/order/print/" + id);

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

/*
$(document).ready(function () {

    var state = STATE.arrived;

    //console.log(JSON.stringify(selectedCustomer), JSON.stringify(selectedWork), JSON.stringify(selectedOrder), state);

    var date = new Date();
    var utcDate;

    $('.modal').modal();

    if (order && order.photoUrl) {
        $('#photo-pic').attr('src', order.photoUrl);
    } else {
        $('.show-photo').addClass("disabled");
    }

    $('.start-state, .end-state, .pickup-state').click(function () {
        $(this).removeClass("light-blue");
        $(this).addClass("green");
    })

    $('.start-state').click(function () {
        console.log("start");
        state = STATE.working;
    })

    $('.end-state').click(function () {
        console.log("done");
        state = STATE.done;
    })

    $('.pickup-state').click(function () {
        console.log("picked up");
        state = STATE.pickUp;
    })

    $("#deleteOrder").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        console.log(id);

        http.request({
            url: '/order/' + id,
            method: 'delete'
        }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                location.href = '/order/all';
            }
        })
    });

    $("#edit").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/order-edit/' + id;
    });
})*/