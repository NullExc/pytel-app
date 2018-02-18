import STATE from './state.js';
import moment from 'moment';


$(document).ready(function () {

    if (order) {

        var arriveDate = moment.utc(order.arriveDate);

        var id;

        $('#arrive-date').text(arriveDate.format('DD.MM.YYYY k:mm:ss'));

        if (order.state === STATE.working || order.state === STATE.done || order.state === STATE.pickUp) {
            $("#start-date").text(moment.utc(order.startDate).format('DD.MM.YYYY k:mm:ss'));
        }

        if (order.state === STATE.done || order.state === STATE.pickUp) {
            $("#work-progress").text("Práca na zákazke je ukončená.");
            $("#end-date").text(moment.utc(order.endDate).format('DD.MM.YYYY k:mm:ss'));
            $("#diff-time").text(getDiffTime(order.startDate, order.endDate));
        }

        if (order.sale) {

            $("#sale-date").text(moment.utc(order.pickDate).format('DD.MM.YYYY k:mm:ss'));

        } else {

            if (order.state === STATE.arrived) {

                id = "#arrive-body";

                $('.end-state').addClass('disabled');
                $('.pickup-state').addClass('disabled');

                $('#start-body').addClass('hide');
                $('#end-body').addClass('hide');
                $('#pick-body').addClass('hide');

            } else if (order.state === STATE.working) {

                id = "#start-body";

                $('.start-state').addClass('disabled');
                $('.pickup-state').addClass('disabled');

                $('#end-body').addClass('hide');
                $('#pick-body').addClass('hide');


                $("#diff-time").text(getDiffTime(order.startDate, null));

            } else if (order.state === STATE.done) {

                id = "#end-body";

                $('.start-state').addClass('disabled');
                $('.end-state').addClass('disabled');

                $('#pick-body').addClass('hide');
            } else if (order.state === STATE.pickUp) {

                id = "#pick-body";

                $('.start-state').addClass('disabled');
                $('.end-state').addClass('disabled');
                $('.pickup-state').addClass('disabled');

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

    var startDate = moment.utc(fromDate);

    var now = new Date();

    now.setHours(now.getHours() + 1);

    if (toDate) now = moment.utc(toDate);

    else now = moment.utc(now);

    console.log(now);

    var workingTime = now.diff(startDate);

    var days = moment(workingTime).utc().format('D');
    var minutes = moment(workingTime).utc().format('m');
    var hours = moment(workingTime).utc().format('H');
    var string = hours + " hodín, " + minutes + " minút.";

    var daysNumber = parseInt(days) - 1;

    if (daysNumber && daysNumber > 0) {
        string = daysNumber + " dní, " + string;
    }

    return string;
}