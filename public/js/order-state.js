import STATE from './state.js';
import moment from 'moment';


$(document).ready(function () {

    if (order) {

        //var arriveDate = moment.utc(order.arriveDate).add(1, "hours");
        var arriveDate = moment.utc(order.arriveDate);

        var id;

        $('#arrive-date').text(arriveDate.format('DD.MM.YYYY k:mm:ss'));

        if (order.state === STATE.working || order.state === STATE.done || order.state === STATE.pickUp) {

            console.log("start date", order.startDate, order.state);

            //$("#start-date").text(moment.utc(order.startDate).add(1, "hours").format('DD.MM.YYYY k:mm:ss'));
            $("#start-date").text(moment.utc(order.startDate).format('DD.MM.YYYY k:mm:ss'));
        }

        if (order.state === STATE.done || order.state === STATE.pickUp) {
            $("#work-progress").text("Práca na zákazke je ukončená.");
            $("#end-date").text(moment.utc(order.endDate).format('DD.MM.YYYY k:mm:ss'));
            //$("#end-date").text(moment.utc(order.endDate).add(1, "hours").format('DD.MM.YYYY k:mm:ss'));
            $("#diff-time").text(getDiffTime(order.startDate, order.endDate));
        }

        if (order.sale) {

            $("#sale-date").text(moment.utc(order.pickDate).format('DD.MM.YYYY k:mm:ss'));
            //$("#sale-date").text(moment.utc(order.pickDate).add(1, "hours").format('DD.MM.YYYY k:mm:ss'));

        } else {

            if (order.state === STATE.arrived) {

                id = "#arrive-body";

                $('.end-state').addClass('disabled');
                $('.pickup-state').addClass('disabled');

                $("#end-option").attr("disabled", true);
                $("#pickup-option").attr("disabled", true);

                $('#start-date-div').addClass('hide');
                $('#end-date-div').addClass('hide');
                $('#pickup-date-div').addClass('hide');

                $('#start-body').addClass('hide');
                $('#end-body').addClass('hide');
                $('#pick-body').addClass('hide');

            } else if (order.state === STATE.working) {

                id = "#start-body";

                $('.start-state').addClass('disabled');
                $('.pickup-state').addClass('disabled');

                $("#pickup-option").attr("disabled", true);

                $('#end-date-div').addClass('hide');
                $('#pickup-date-div').addClass('hide');

                $('#end-body').addClass('hide');
                $('#pick-body').addClass('hide');


                $("#diff-time").text(getDiffTime(order.startDate, null));

            } else if (order.state === STATE.done) {

                id = "#end-body";

                $('.start-state').addClass('disabled');
                $('.end-state').addClass('disabled');

                $('#pickup-date-div').addClass('hide');

                $('#pick-body').addClass('hide');
            } else if (order.state === STATE.pickUp) {

                id = "#pick-body";

                $('.start-state').addClass('disabled');
                $('.end-state').addClass('disabled');
                $('.pickup-state').addClass('disabled');

                //$("#pickup-date").text(moment.utc(order.pickDate).add(1, "hours").format('DD.MM.YYYY k:mm:ss'));
                $("#pickup-date").text(moment.utc(order.pickDate).format('DD.MM.YYYY k:mm:ss'));
            }

            $(id).removeClass("grey");
            $(id).removeClass("lighten-2");
            $(id).addClass("green");
            $(id).addClass("lighten-1");

        }
    }
});

function getDiffTime(fromDate, toDate) {

    var now = new Date();

    var startDate = moment.utc(fromDate);

    //now.setHours(now.getHours() + 1);
    //var now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getHours(), now.getUTCMinutes(), now.getUTCSeconds());

    if (toDate) now = moment.utc(toDate);

    else now = moment.utc(now).add((now.getTimezoneOffset() / 60) * -1, 'h');

    var workingTime = now.diff(startDate);

    console.log("work time", now.diff(startDate, 'days'));

    var days = moment(workingTime).utc().format('D');
    var minutes = moment(workingTime).utc().format('m');
    var hours = moment(workingTime).utc().format('H');
    var string = hours + " hodín, " + minutes + " minút.";

    var daysNumber = parseInt(days) - 1;

    var totalDays = now.diff(startDate, 'days') - 1;

    if (totalDays > 30) {
        daysNumber = totalDays;
    }

    if (daysNumber && daysNumber > 0) {
        string = daysNumber + " dní, " + string;
    }

    return string;
}