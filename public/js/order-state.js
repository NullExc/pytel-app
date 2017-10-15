import STATE from './state.js';


$(document).ready(function () {

    console.log('match', STATE.arrived, order.state);

    if (order && order.state == STATE.arrived) {
        $('#end-state').addClass('disabled');
        $('#pickup-state').addClass('disabled');

        console.log('match', STATE.arrived);
    }
});