import STATE from './state.js';


$(document).ready(function () {

    console.log('match', STATE.arrived, order.state);

    if (order) {
        if (order.state === STATE.arrived) {
            $('#end-state').addClass('disabled');
            $('#pickup-state').addClass('disabled');
        } else if (order.state === STATE.working) {
            $('#start-state').addClass('disabled');
            $('#pickup-state').addClass('disabled');
        } else if (order.state === STATE.done) {
            $('#start-state').addClass('disabled');
            $('#end-state').addClass('disabled');
        } else if (order.state === STATE.pickUp) {
            $('#start-state').addClass('disabled');
            $('#end-state').addClass('disabled');
            $('#pickup-state').addClass('disabled');
        }
    }
});