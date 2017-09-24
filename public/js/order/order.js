$(document).ready(function () {

    $('.datepicker').pickadate({
        selectMonths: true,//Creates a dropdown to control month
        //The title label to use for the month nav buttons
        labelMonthNext: 'Ďalší mesiac',
        labelMonthPrev: 'Posledný mesiac',
        //The title label to use for the dropdown selectors
        labelMonthSelect: 'Vybrať mesiac',
        labelYearSelect: 'Vybrať rok',
        //Months and weekdays
        monthsFull: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Octóber', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        weekdaysFull: ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'],
        weekdaysShort: ['Ned', 'Pon', 'Uto', 'Str', 'Stv', 'Pia', 'Sob'],
        //Materialize modified
        weekdaysLetter: [ 'N', 'P', 'U', 'S', 'Š', 'P', 'S' ],
        //Today and clear
        today: 'Dnes',
        clear: 'Vynulovať',
        close: 'Zavrieť',

        format: 'dd/mm/yyyy'
    });

    $("#date-label").addClass('active');


    var names = {};
    var selectedCustomer = null;

    for (var i = 0; i < customers.length; i++) {
        names[customers[i].name] = null;
    }

    var fillCustomerData = function () {

        $("label").removeClass("active");

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

        var doneLabel = $("#done-customer");
        doneLabel.text(selectedCustomer.name);
        doneLabel.removeClass('orange');
        doneLabel.addClass('green');

        $('.collapsible').collapsible('close', 0);
    })

    $('input.autocomplete').autocomplete({
        data: names,
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function (val) {
            for (var i = 0; i < customers.length; i++) {
                if (val === customers[i].name) {
                    selectedCustomer = customers[i];
                    break;
                }
            }

            $("#autocomplete-input").val(null);

            fillCustomerData();

            var doneLabel = $("#done-customer");
            doneLabel.text(selectedCustomer.name);
            doneLabel.removeClass('orange');
            doneLabel.addClass('green');

        },
        minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
    });

    $('#create').click(function () {
        var order = {};

        order.name = $("#name").val();

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



    })
})