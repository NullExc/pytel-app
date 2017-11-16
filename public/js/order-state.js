import STATE from './state.js';
import moment from 'moment';

$(document).ready(function () {


    if (order) {

        var arriveDate = moment.utc(order.arriveDate);

        $('#arrive-date').text(arriveDate.format('DD.MM.YYYY h:mm:ss'));

        if (order.state === STATE.working || order.state === STATE.done || order.state === STATE.pickUp) {
            $("#start-date").text(moment.utc(order.startDate).format('DD.MM.YYYY h:mm:ss'));
        }

        if (order.state === STATE.arrived) {

            $('.end-state').addClass('disabled');
            $('.pickup-state').addClass('disabled');

            $('#start-body').addClass('hide');
            $('#end-body').addClass('hide');
            $('#pick-body').addClass('hide');

        } else if (order.state === STATE.working) {
            $('.start-state').addClass('disabled');
            $('.pickup-state').addClass('disabled');

            $('#end-body').addClass('hide');
            $('#pick-body').addClass('hide');

            var startDate = moment.utc(order.startDate);

            var now = moment.utc(Date.now());               

            var workingTime = now.diff(startDate);

            var days = moment(workingTime).utc().format('D');
            var minutes = moment(workingTime).utc().format('m');
            var hours = moment(workingTime).utc().format('H');
            var string = hours + " hodín, " + minutes + " minút.";

            var daysNumber = parseInt(days);

            string = daysNumber + " dní, " + string;
            
            $("#diff-time").text(string);

        } else if (order.state === STATE.done) {
            $('.start-state').addClass('disabled');
            $('.end-state').addClass('disabled');

            $('#pick-body').addClass('hide');
        } else if (order.state === STATE.pickUp) {
            $('.start-state').addClass('disabled');
            $('.end-state').addClass('disabled');
            $('.pickup-state').addClass('disabled');
        }
    }
});