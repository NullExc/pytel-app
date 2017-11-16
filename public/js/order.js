import STATE from './state.js';
import http from '../lib/http.js';
import googleAuth from '../lib/google-auth';
import calendar from '../lib/calendar.js';
import picker from '../lib/picker.js';

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
})