import STATE from './state.js';
import http from '../lib/http.js';

$(document).ready(function () {

    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Vynulovať', // text for clear-button
        canceltext: 'Zavrieť', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function () { } //Function for after opening timepicker
    });

    $('.datepicker').pickadate({
        selectMonths: true,
        labelMonthNext: 'Ďalší mesiac',
        labelMonthPrev: 'Posledný mesiac',
        labelMonthSelect: 'Vybrať mesiac',
        labelYearSelect: 'Vybrať rok',
        monthsFull: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Octóber', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        weekdaysFull: ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'],
        weekdaysShort: ['Ned', 'Pon', 'Uto', 'Str', 'Stv', 'Pia', 'Sob'],
        weekdaysLetter: ['N', 'P', 'U', 'S', 'Š', 'P', 'S'],
        today: 'Dnes',
        clear: 'Vynulovať',
        close: 'Zavrieť',
        format: 'dd/mm/yyyy'
    });

    var date;// = new Date(order.dates.arriveDate);

    if (order) {
        date = new Date('2018-10-14T22:05:01Z');
        var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        console.log('arrive', utcDate.getDate() );
    } else {
        date = new Date();
    }
    
    $("#date").val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
        + '/' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
        + '/' + utcDate.getFullYear());

    $("#time").val((utcDate.getHours() >= 10 ? utcDate.getHours() : ('0' + utcDate.getHours()))
        + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

    var names = {};
    var workNames = {};
    var orderNames = {};

    var selectedCustomer = null;
    var selectedWork = null;
    var selectedOrder = null;

    customers.forEach(function (customer) {
        names[customer.firstName + ' ' + customer.lastName] = null;
    })

    workTypes.forEach(function (worktype) {
        workNames[worktype.name] = null;
    })

    orderTypes.forEach(function (ordertype) {
        orderNames[ordertype.name] = null;
    })

    var fillCustomerData = function () {

        var doneLabel = $("#done-customer");
        doneLabel.text(selectedCustomer.firstName + ' ' + selectedCustomer.lastName);
        doneLabel.removeClass('orange');
        doneLabel.addClass('green');

        $(".customer-label").removeClass("active");

        if (selectedCustomer) {
            if (selectedCustomer.contact) {

                if (selectedCustomer.contact.email) {
                    $("#email").val(selectedCustomer.contact.email);
                    $("#email-label").addClass('active');
                } else $("#email").val('');

                if (selectedCustomer.contact.phone) {
                    $("#phone").val(selectedCustomer.contact.phone);
                    $("#phone-label").addClass('active');
                } else $("#phone").val('');
            }
            if (selectedCustomer.address) {

                if (selectedCustomer.address.street) {
                    $("#street").val(selectedCustomer.address.street);
                    $("#street-label").addClass('active');
                } else $("#street").val('');

                if (selectedCustomer.address.streetNumber) {
                    $("#num").val(selectedCustomer.address.streetNumber);
                    $("#num-label").addClass('active');
                } else $("#num").val('');

                if (selectedCustomer.address.city) {
                    $("#city").val(selectedCustomer.address.city);
                    $("#city-label").addClass('active');
                } else $("#city").val('');

                if (selectedCustomer.address.zipCode) {
                    $("#zip").val(selectedCustomer.address.zipCode);
                    $("#zip-label").addClass('active');
                } else $("#zip").val('');
            }
            if (selectedCustomer.billData) {

                if (selectedCustomer.billData.ICO) {
                    console.log('ICO', selectedCustomer.billData.ICO);
                    $("#ico").val(selectedCustomer.billData.ICO);
                    $("#ico-label").addClass('active');
                } else $("#ico").val(' ');

                if (selectedCustomer.billData.ICDPH) {
                    $("#icdph").val(selectedCustomer.billData.ICDPH);
                    $("#icdph-label").addClass('active');
                } else $("#icdph").val(' ');

                if (selectedCustomer.billData.DIC) {
                    $("#dic").val(selectedCustomer.billData.DIC);
                    $("#dic-label").addClass('active');
                } else $("#dic").val(' ');
            } else {
                $("#ico").val(null);
                $("#icdph").val(null);
                $("#dic").val(null);
            }
        }
    }

    $('.selected').click(function (event) {
        var id = event.target.id;
        for (var i = 0; i < customers.length; i++) {
            if (id === customers[i]._id) {
                selectedCustomer = customers[i];
                break;
            }
        }

        fillCustomerData();

        $('#select-customer').collapsible('close', 0);
    })

    $('#drop-up').click(function (event) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $('#address-data').collapsible('close', 0);
    })



    $('#work').autocomplete({
        data: workNames,
        onAutocomplete: function (val) {
            workTypes.forEach(function (worktype) {
                if (val === worktype.name) {
                    selectedWork = worktype;
                }
            })
            console.info(JSON.stringify(selectedWork));
        }
    })

    $('#order').autocomplete({
        data: orderNames,
        onAutocomplete: function (val) {
            orderTypes.forEach(function (ordertype) {
                if (val === ordertype.name) {
                    selectedOrder = ordertype;
                }
            })
            console.info(JSON.stringify(selectedOrder));
        }
    })

    $('#customer-search').autocomplete({
        data: names,
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function (val) {
            for (var i = 0; i < customers.length; i++) {
                if (val === customers[i].firstName + ' ' + customers[i].lastName) {
                    selectedCustomer = customers[i];
                    break;
                }
            }

            $("#customer-search").val(null);

            fillCustomerData();
        },
        minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
    });

    $('#create').click(function () {
        var order = {};

        order.description = $("#description").val();

        var email = $("#email").val();
        var phone = $("#phone").val();

        if (email || phone) {
            order.contact = {};
        }
        if (email) order.contact.email = email;
        if (phone) order.contact.phone = phone;

        var street = $("#street").val();
        var streetNumber = $("#num").val();
        var city = $("#city").val();
        var zipCode = $("#zip").val();

        if (street || streetNumber || city || zipCode) {
            order.address = {};
        }
        if (street) order.address.street = street;
        if (streetNumber) order.address.streetNumber = streetNumber;
        if (city) order.address.city = city;
        if (zipCode) order.address.zipCode = zipCode;

        var ico = $("#ico").val();
        var icdph = $("#icdph").val();
        var dic = $("#dic").val();

        if (ico || icdph || dic) {
            order.billData = {};
        }

        if (ico) order.billData.ICO = ico;
        if (icdph) order.billData.ICDPH = icdph;
        if (dic) order.billData.DIC = dic;

        if (selectedCustomer) order.customerId = selectedCustomer._id;
        if (selectedOrder) order.orderType = selectedOrder._id;
        if (selectedWork) order.workType = selectedWork._id;

        order.state = STATE.arrived;

        var options = {
            method: 'post',
            url: '/order',
            data: {
                order: order
            }
        }

        http.request(options, (err, response) => {
            if (err) console.log(err);
            else if (response) console.log(JSON.stringify(response.data));
        })
    })
})