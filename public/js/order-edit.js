import STATE from './state.js';
import http from '../lib/http.js';
import googleAuth from '../lib/google-auth';
import calendar from '../lib/calendar.js';
import picker from '../lib/picker.js';

var app = angular.module('OrderInput', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('OrderInputCtrl', function ($scope, $http, $filter) {

    var testToken;

    googleAuth.handleClientLoad(function (GoogleApi, TOKEN) {
        testToken = TOKEN;
        console.log('token', TOKEN);

    });

    $scope.token = "nothing";

    $scope.customers = window.customers;

    $scope.newWork = false;

    $scope.newType = false;

    $scope.newWorkName = '';

    $scope.newOrderName = '';

    $scope.sale = edit ? order.sale : false;

    var selectedCustomer = edit ? customer : null;

    var selectedWork = edit ? workType : null;

    var selectedOrder = edit ? orderType : null;

    console.log(selectedCustomer);

    $scope.pickCustomer = function (event) {
        var id = event.target.id;
        for (var i = 0; i < $scope.customers.length; i++) {
            if (id === $scope.customers[i]._id) {
                selectedCustomer = $scope.customers[i];
                break;
            }
        }
        fillCustomerData();
        $('#select-customer').collapsible('close', 0);
    }

    $scope.workInput = function () {
        if ($scope.newWork === true) {
            createWorkType();
        } else {
            $scope.newWork = true;
        }
    }

    $scope.typeInput = function () {
        if ($scope.newType === true) {
            createOrderType();
        } else {
            $scope.newType = true;
        }
    }

    var createWorkType = function () {

        $http.post('/worktype', {
            name: $scope.newWorkName
        }).success(function (response) {
            $scope.newWork = false;
            selectedWork = response;
            $("#work").val(response.name);
            $("#work-label").addClass('active');
            console.log(response);
        }).error(function (error) {
            console.log(error);
        })
    }

    var createOrderType = function () {

        $http.post('/ordertype', {
            name: $scope.newOrderName
        }).success(function (response) {
            $scope.newType = false;
            selectedOrder = response;
            $("#order").val(response.name);
            $("#order-label").addClass('active');
            console.log(response);
        }).error(function (error) {
            console.log(error);
        })
    }

    var fillCustomerData = function () {

        var doneLabel = $("#done-customer");
        doneLabel.text(selectedCustomer.fullName);
        doneLabel.removeClass('orange');
        doneLabel.addClass('green');

        $(".customer-label").removeClass("active");

        var email, phone, street, number, city, zipCode, ico, icdph, dic;

        if (selectedCustomer) {

            if (selectedCustomer.person) {
                var person = selectedCustomer.person;

                if (person.phone) phone = person.phone;
                if (person.email) email = person.email;

                if (person.address) {
                    var address = person.address;
                    if (address.street) street = address.street;
                    if (address.streetNumber) number = address.streetNumber;
                    if (address.city) city = address.city;
                    if (address.zipCode) zipCode = address.zipCode;
                }

                ico = "neuvedené (FO)";
                icdph = "neuvedené (FO)";
                dic = "neuvedené (FO)";

            }

            if (selectedCustomer.company) {
                var company = selectedCustomer.company;

                if (company.contactPerson) {
                    var contactPerson = company.contactPerson;

                    if (contactPerson.phone) phone = contactPerson.phone;
                    if (contactPerson.email) email = contactPerson.email;
                }
                if (company.address) {
                    var address = company.address;

                    if (address.street) street = address.street;
                    if (address.streetNumber) number = address.streetNumber;
                    if (address.city) city = address.city;
                    if (address.zipCode) zipCode = address.zipCode;
                }
                if (company.billData) {
                    var billData = company.billData;

                    if (billData.ICO) ico = billData.ICO;
                    if (billData.ICDPH) icdph = billData.ICDPH;
                    if (billData.DIC) dic = billData.DIC;
                }
            }

            if (email) {
                $("#email").val(email);
                $("#email-label").addClass('active');
            }
            if (phone) {
                $("#phone").val(phone);
                $("#phone-label").addClass('active');
            }
            if (street) {
                $("#street").val(street);
                $("#street-label").addClass('active');
            }
            if (number) {
                $("#num").val(number);
                $("#num-label").addClass('active');
            }
            if (city) {
                $("#city").val(city);
                $("#city-label").addClass('active');
            }
            if (zipCode) {
                $("#zip").val(zipCode);
                $("#zip-label").addClass('active');
            }
            if (ico) {
                $("#ico").val(ico);
                $("#ico-label").addClass('active');
            }
            if (icdph) {
                $("#icdph").val(icdph);
                $("#icdph-label").addClass('active');
            }
            if (dic) {
                $("#dic").val(dic);
                $("#dic-label").addClass('active');
            }
        }
    }



    $(document).ready(function () {

        $('#date-label').addClass('active');
        $('#time-label').addClass('active');

        if (edit) {
            $('#date').attr('disabled', true);
            $('#time').attr('disabled', true);
            $('#check-sale').attr('disabled', 'disabled');
            $('#check-sale').removeClass('checkbox-blue');

            if ($scope.sale) {
                $("#state-div").addClass('hide');
            }
        }

        var utcDate = new Date();

        $.datepicker.regional['sk'] = {
            closeText: 'Zavrieť',
            prevText: '&lt; Predchádzajúci',
            nextText: 'Nasledujúci &gt;',
            currentText: 'Dnes',
            monthNames: [
                'Január',
                'Február',
                'Marec',
                'Apríl',
                'Máj',
                'Jún',
                'Júl',
                'August',
                'September',
                'Október',
                'November',
                'December'
            ],
            monthNamesShort: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'Máj',
                'Jún',
                'Júl',
                'Aug',
                'Sep',
                'Okt',
                'Nov',
                'Dec'
            ],
            dayNames: [
                'Nedeľa',
                'Pondelok',
                'Utorok',
                'Streda',
                'Štvrtok',
                'Piatok',
                'Sobota'
            ],
            dayNamesShort: [
                'Ned',
                'Pon',
                'Uto',
                'Str',
                'Štv',
                'Pia',
                'Sob'
            ],
            dayNamesMin: [
                'Ne',
                'Po',
                'Ut',
                'St',
                'Št',
                'Pia',
                'So'
            ],
            dateFormat: 'd.m.yy',
            firstDay: 0,
            isRTL: false
        };
        $.datepicker.setDefaults($.datepicker.regional['sk']);

        $("#date").datepicker({
            onSelect: function (dateText) {
                console.log('to selected ', dateText);

                var dateParts = dateText.split('.');

                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]));

                var resultArray = [];

                utcDate.setFullYear(date.getFullYear());

                utcDate.setMonth(date.getMonth());

                utcDate.setDate(date.getDate());

                console.log('from selected ', utcDate);
            }
        });

        $("#date").datepicker($.datepicker.regional["sk"]);

        $('input.timepicker').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                console.log('check', $scope.sale);

                if (utcDate) {
                
                    time.setUTCHours(time.getUTCHours() + 1);

                    utcDate.setHours(time.getHours());

                    utcDate.setMinutes(time.getMinutes());

                    console.log('hm', utcDate);
                }
            }
        });

        var names = {};
        var workNames = {};
        var orderNames = {};

        var state = STATE.arrived;

        var date = new Date();

        if (edit) {
            date = new Date(order.arriveDate);
            state = order.state;
        }
        utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours() + 1, date.getUTCMinutes(), date.getUTCSeconds());

        $("#date").val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
            + '/' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
            + '/' + utcDate.getFullYear());

        // $("#time").val((utcDate.getHours() >= 10 ? utcDate.getHours() + 1 : ('0' + utcDate.getHours()))
        //     + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

        customers.forEach(function (customer) {
            names[customer.fullName] = null;
        })

        workTypes.forEach(function (worktype) {
            workNames[worktype.name] = null;
        })

        orderTypes.forEach(function (ordertype) {
            orderNames[ordertype.name] = null;
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
                    if (val === customers[i].fullName) {
                        selectedCustomer = customers[i];
                        break;
                    }
                }

                $("#customer-search").val(null);
                fillCustomerData();
            },
            minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
        });

        $('#load-photo').click(function () {

            $scope.token = 'loading picker ' + testToken;
            $scope.$apply();
            
            console.log('loading picker');
            googleAuth.handleClientLoad(function (GoogleApi, TOKEN) {

                $scope.token = TOKEN;

                $scope.$apply();

                console.log('picker ready to open', GoogleApi, TOKEN);

                if (GoogleApi && TOKEN) {
                    picker.setGoogleApi(GoogleApi, TOKEN);
                    picker.loadPicker();
                } else {
                    $('#load-photo').addClass('disabled');
                }
            });
        })

        $('#create, #update').click(function (e) {

            var order = {};

            order.description = $("#description").val();

            if (!order.description) {

                $('#description').addClass('invalid');

                $('#description-label').addClass('active');

            }

            if (!selectedCustomer) {

                $("#done-customer").removeClass('orange');
                $("#done-customer").addClass('red');

            }

            if (!order.description || !selectedCustomer) {
                return;
            }

            var email = $("#email").val();
            var phone = $("#phone").val();
            var price = $("#price").val();
            var notes = $("#notes").val();
            var facilities = $("#facilities").val();


            if (notes) {

                var temp = notes.replace(/[\\]/g, '\\\\')
                    .replace(/[\"]/g, '\\\"')
                    .replace(/[\/]/g, '\\/')
                    .replace(/[\b]/g, '\\b')
                    .replace(/[\f]/g, '\\f')
                    .replace(/[\n]/g, '\\n')
                    .replace(/[\r]/g, '\\r')
                    .replace(/[\t]/g, '\\t');

                order.notes = temp;

                console.log('notes', order.notes);
            }
            if (facilities) {

                var temp = facilities.replace(/[\\]/g, '\\\\')
                    .replace(/[\"]/g, '\\\"')
                    .replace(/[\/]/g, '\\/')
                    .replace(/[\b]/g, '\\b')
                    .replace(/[\f]/g, '\\f')
                    .replace(/[\n]/g, '\\n')
                    .replace(/[\r]/g, '\\r')
                    .replace(/[\t]/g, '\\t');

                order.facilities = temp;
            }

            if (price) order.price = price;
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

            order.state = state;

            var help = new Date();

            date = new Date(Date.UTC(help.getUTCFullYear(), help.getUTCMonth(), help.getUTCDate(), help.getUTCHours() + 1, help.getUTCMinutes(), help.getUTCSeconds()));

            //date.setUTCMonth(date.getMonth() + 1);

            if (state === STATE.working) {
                order.startDate = date;
                //    order.startDate.
            } else if (state === STATE.done) {
                order.endDate = date;
            } else if (state === STATE.pickUp) {
                order.pickDate = date;
            }
            order.photoUrl = picker.getPhotoUrl();

            var options = {
                url: '/order',
                data: {
                    order
                }
            }

            if (e.target.id === 'create') {

                if ($scope.sale) {
                    order.state = STATE.pickUp;

                    if (order.orderType) delete order.orderType;
                    if (order.workType) delete order.workType;

                    order.sale = true;

                    order.state = STATE.pickUp;

                    order.pickDate = utcDate;

                }

                options.method = 'post';

                googleAuth.handleClientLoad(function (GoogleApi, TOKEN) {
                    console.log('token', TOKEN);
                    calendar.setGoogleApi(GoogleApi);
                    calendar.insertEvent(order, selectedCustomer);
                });

                options.data.order.arriveDate = utcDate;
            }
            else {

                var pathname = window.location.pathname.split("/");
                var id = pathname[pathname.length - 1];
                options.method = 'put';
                options.url = '/order/' + id
            }

            http.request(options, (err, response) => {
                if (err) console.log("error", err);
                else if (response) {
                    console.log("response", response.data);
                    if (response.data.id) {
                        location.href = "/order/" + response.data.id;
                    } else {
                        var pathname = window.location.pathname.split("/");
                        var id = pathname[pathname.length - 1];
                        location.href = "/order/" + id;
                    }
                }
            })
        })

        $('.start-state').click(function () {
            console.log("start");
            $('.start-state').removeClass('light-blue');
            $('.start-state').addClass('light-green');
            state = STATE.working;
        })

        $('.end-state').click(function () {
            console.log("done");
            $('.end-state').removeClass('light-blue');
            $('.end-state').addClass('light-green');
            state = STATE.done;
        })

        $('.pickup-state').click(function () {
            console.log("picked up");
            $('.pickup-state').removeClass('light-blue');
            $('.pickup-state').addClass('light-green');
            state = STATE.pickUp;
        })
    })

})
