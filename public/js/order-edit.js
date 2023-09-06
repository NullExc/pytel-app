import STATE from './state.js';
import http from '../lib/http.js';
import googleAuth from '../lib/google-auth';
import calendar from '../lib/calendar.js';
import picker from '../lib/picker.js';
import preloader from '../lib/preloader.js';

var app = angular.module('OrderInput', ['angularUtils.directives.dirPagination', 'ui.materialize']);

app.controller('OrderInputCtrl', function ($scope, $http, $filter) {

    if (edit) {
        $scope.navName = "Upraviť zákazku";
    } else {
        $scope.navName = "Vytvoriť zákazku";
    }

    $scope.token = "nothing";
    $scope.customers = window.customers;

    $scope.newWork = false;
    $scope.newType = false;
    $scope.newFacility = false;
    $scope.newWorkName = '';
    $scope.newOrderName = '';
    $scope.newFacilityName = '';

    $scope.order = edit ? order : false;
    $scope.sale = edit ? order.sale : false;
    $scope.stateName = "";

    var selectedCustomer = edit ? customer : null;
    var selectedWork = edit ? workType : null;
    var selectedOrder = edit ? orderType : null;
    var selectedFacilities = edit ? customerFacilities : [];
    var selectedPhotoUrls = edit ? order.photoUrls : [];

    $scope.originState = edit ? order.state : STATE.arrived;
    $scope.saveState = edit ? order.state : STATE.arrived;
    $scope.saleOriginState = edit ? order.state : STATE.saleOrdered;
    $scope.saleSaveState = edit ? order.state : STATE.saleOrdered;

    $scope.stateChild = {};
    $scope.saleChild = {};
    $scope.jquery = $;

    console.log("$scope.order", $scope.order);

    if (!selectedPhotoUrls) selectedPhotoUrls = [];

    console.log("selectedFacilities", selectedFacilities);

    if (edit && order) {
        if (order.state === STATE.arrived) {
            $scope.stateName = "Prijatá";
        } else if (order.state === STATE.working) {
            $scope.stateName = "Prebieha práca";
        } else if (order.state === STATE.done) {
            $scope.stateName = "Dokončená";
        } else if (order.state === STATE.pickUp) {
            $scope.stateName = "Vyzdvihnuta";
        }
    }

    $scope.stateSelect = {
        value: 'Vybrať nový stav',
        choices: ['Vybrať nový stav', 'Prijať', 'Začať', 'Dokončiť', 'Odovzdať']
    }

    $scope.saleSelect = {
        value: 'Vybrať nový stav predaja',
        choices: ['Vybrať nový stav predaja', 'Objednané', 'Obdržané', 'Vyzdvihnuté']
    }

    $scope.saleChange = function (e) {
        console.log("Zemna predaja", $scope.sale);
        if ($scope.sale) {
            $scope.state = STATE.saleOrdered;
        } else {
            $scope.state = STATE.arrived;
        }
    }

    $scope.fillDate = function (utcDate, dateInputId, timeInputId) {

        $(dateInputId).val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
            + '.' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
            + '.' + utcDate.getFullYear());

        $(timeInputId).val((utcDate.getHours() >= 10 ? utcDate.getHours() : ('0' + utcDate.getHours()))
            + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

    }

    $scope.currentInputDataSale = function (originalState, savedState) {

        console.log("current PARENT CONTRL", originalState, savedState);

        var date = new Date();

        var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours(), date.getUTCMinutes(), date.getUTCSeconds());

        if (originalState == STATE.saleOrdered) {

            if (savedState == STATE.saleObtained) {
                $scope.fillDate(utcDate, "#saleObtained-date", "#saleObtained-time");

            } else if (savedState == STATE.saleLeaved) {
                $scope.fillDate(utcDate, "#saleObtained-date", "#saleObtained-time");
                utcDate.setUTCMilliseconds(utcDate.getUTCMilliseconds() + 10);
                $scope.fillDate(utcDate, "#saleLeaved-date", "#saleLeaved-time");
            }
        }

        if (originalState == STATE.saleObtained) {

            if (savedState == STATE.saleLeaved) {
                $scope.fillDate(utcDate, "#saleLeaved-date", "#saleLeaved-time");
            }
        }
        
    }

    $scope.currentInputData = function (originalState, savedState) {

        console.log("current PARENT CONTRL", originalState, savedState);

        var date = new Date();

        var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours(), date.getUTCMinutes(), date.getUTCSeconds());

        if (originalState == STATE.arrived) {

            if (savedState == STATE.working) {
                $scope.fillDate(utcDate, "#start-date", "#start-time");

            } else if (savedState == STATE.done) {
                $scope.fillDate(utcDate, "#start-date", "#start-time");
                utcDate.setUTCMilliseconds(utcDate.getUTCMilliseconds() + 10);
                $scope.fillDate(utcDate, "#end-date", "#end-time");

            } else if (savedState == STATE.pickUp) {
                $scope.fillDate(utcDate, "#start-date", "#start-time");
                utcDate.setUTCMilliseconds(utcDate.getUTCMilliseconds() + 10);
                $scope.fillDate(utcDate, "#end-date", "#end-time");
                utcDate.setUTCMilliseconds(utcDate.getUTCMilliseconds() + 10);
                $scope.fillDate(utcDate, "#pickup-date", "#pickup-time");
            }
        }

        if (originalState == STATE.working) {

            if (savedState == STATE.done) {
                $scope.fillDate(utcDate, "#end-date", "#end-time");

            } else if (savedState == STATE.pickUp) {
                $scope.fillDate(utcDate, "#end-date", "#end-time");
                utcDate.setUTCMilliseconds(utcDate.getUTCMilliseconds() + 10);
                $scope.fillDate(utcDate, "#pickup-date", "#pickup-time");
            }
        }

        if (originalState == STATE.done) {

            if (savedState == STATE.pickUp) {
                $scope.fillDate(utcDate, "#pickup-date", "#pickup-time");
            }
        }
    }

    $scope.stateSelectChange = function () {

        if ($scope.stateSelect.value === $scope.stateSelect.choices[1]) {
            $scope.saveState = STATE.arrived;

            $('#start-date-div').addClass('hide');
            $('#end-date-div').addClass('hide');
            $('#pickup-date-div').addClass('hide');

            $('#arrived-date-div').addClass('date-row-active');
            $('#start-date-div').removeClass('date-row-active');
            $('#end-date-div').removeClass('date-row-active');
            $('#pickup-date-div').removeClass('date-row-active');

        } else if ($scope.stateSelect.value === $scope.stateSelect.choices[2]) {
            $scope.saveState = STATE.working;

            $('#start-date-div').removeClass('hide');
            $('#end-date-div').addClass('hide');
            $('#pickup-date-div').addClass('hide');

            $('#arrived-date-div').removeClass('date-row-active');
            $('#start-date-div').addClass('date-row-active');
            $('#end-date-div').removeClass('date-row-active');
            $('#pickup-date-div').removeClass('date-row-active');

        } else if ($scope.stateSelect.value === $scope.stateSelect.choices[3]) {
            $scope.saveState = STATE.done;

            $('#start-date-div').removeClass('hide');
            $('#end-date-div').removeClass('hide');
            $('#pickup-date-div').addClass('hide');

            $('#arrived-date-div').removeClass('date-row-active');
            $('#start-date-div').removeClass('date-row-active');
            $('#end-date-div').addClass('date-row-active');
            $('#pickup-date-div').removeClass('date-row-active');

        } else if ($scope.stateSelect.value === $scope.stateSelect.choices[4]) {
            $scope.saveState = STATE.pickUp;

            $('#start-date-div').removeClass('hide');
            $('#end-date-div').removeClass('hide');
            $('#pickup-date-div').removeClass('hide');

            $('#arrived-date-div').removeClass('date-row-active');
            $('#start-date-div').removeClass('date-row-active');
            $('#end-date-div').removeClass('date-row-active');
            $('#pickup-date-div').addClass('date-row-active');
        }

        $scope.currentInputData($scope.originState, $scope.saveState);
    }

    $scope.saleStateSelectChange = function () {
        console.log("saleStateSelectChange", $scope.saleSelect.value);
        if ($scope.saleSelect.value === $scope.saleSelect.choices[1]) {
            $scope.saleSaveState = STATE.saleOrdered;

            $('#saleObtained-date-div').addClass('hide');
            $('#saleLeaved-date-div').addClass('hide');

            $('#saleOrdered-date-div').addClass('date-row-active');
            $('#saleObtained-date-div').removeClass('date-row-active');
            $('#saleLeaved-date-div').removeClass('date-row-active');

        } else if ($scope.saleSelect.value === $scope.saleSelect.choices[2]) {
            $scope.saleSaveState = STATE.saleObtained;

            $('#saleObtained-date-div').removeClass('hide');
            $('#saleLeaved-date-div').addClass('hide');

            $('#saleOrdered-date-div').removeClass('date-row-active');
            $('#saleObtained-date-div').addClass('date-row-active');
            $('#saleLeaved-date-div').removeClass('date-row-active');

        } else if ($scope.saleSelect.value === $scope.saleSelect.choices[3]) {
            $scope.saleSaveState = STATE.saleLeaved;

            $('#saleObtained-date-div').removeClass('hide');
            $('#saleLeaved-date-div').removeClass('hide');

            $('#saleOrdered-date-div').removeClass('date-row-active');
            $('#saleObtained-date-div').removeClass('date-row-active');
            $('#saleLeaved-date-div').addClass('date-row-active');
        }
        $scope.currentInputDataSale($scope.saleOriginState, $scope.saleSaveState);
    }

    $scope.pickCustomer = function (event) {
        var id = event.target.id;
        console.log("customer id", id);
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
    $scope.facilityInput = function () {
        if ($scope.newFacility === true) {
            createFacility();
        } else {
            $scope.newFacility = true;
        }
    }

    var createWorkType = function () {

        preloader.open('Vytvára sa typ práce ...');

        $http.post('/worktype', {
            name: $scope.newWorkName
        }).success(function (response) {
            $scope.newWork = false;
            selectedWork = response;
            $("#work").val(response.name);
            $("#work-label").addClass('active');
            preloader.close();
        }).error(function (error) {
            console.log(error);
            preloader.close();
        })
    }

    var createOrderType = function () {

        preloader.open('Vytvára sa typ zákazky ...');

        $http.post('/ordertype', {
            name: $scope.newOrderName
        }).success(function (response) {
            $scope.newType = false;
            selectedOrder = response;
            $("#order").val(response.name);
            $("#order-label").addClass('active');
            preloader.close();
        }).error(function (error) {
            console.log(error);
            preloader.close();
        })
    }

    var createFacility = function () {

        preloader.open('Vytvára sa príslušenstvo ...');

        $http.post('/facility', {
            name: $scope.newFacilityName
        }).success(function (response) {

            $scope.newFacility = false;

            var instance = M.Chips.getInstance($("#facility-chips"));
            instance.addChip({ tag: response.name });
            selectedFacilities.push(response);
            preloader.close();

        }).error(function (error) {
            console.log(error);
            preloader.close();
        })
    }

    var fillCustomerData = function () {

        $(".customer-input").val("");

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

        $("#price").focus(function () {
            $(this).val('');
        })

        $("#price").focusout(function () {
            if (!$(this).val() || $(this).val().length < 1) {
                console.log("no value for price");
                $(this).val(0);
            }
        })

        preloader.open('Pripravujú sa dáta ...');

        $('#date-label').addClass('active');
        $('#time-label').addClass('active');

        if (edit) {

            $("#input-time").addClass('hide');
            $("#input-date").addClass('hide');

            $("#create-tab").addClass('disabled');

            if (customer) {
                var doneLabel = $("#done-customer");
                doneLabel.text(customer.fullName);
                doneLabel.removeClass('orange');
                doneLabel.addClass('green');
            }
            if (workType) {
                $("#work").val(workType.name);
                $("#work-label").addClass('active');
            }
            if (orderType) {
                $("#order").val(orderType.name);
                $("#order-label").addClass('active');
            }
            if (order) {

                if (order.description) {
                    $("#description").val(order.description);
                    $("#description-label").addClass('active');
                }
                if (order.contact) {
                    if (order.contact.email) {
                        $("#email").val(order.contact.email);
                        $("#email-label").addClass('active');
                    }
                    if (order.contact.phone) {
                        $("#phone").val(order.contact.phone);
                        $("#phone-label").addClass('active');
                    }
                }
                if (order.address) {
                    if (order.address.street) {
                        $("#street").val(order.address.street);
                        $("#street-label").addClass('active');
                    }
                    if (order.address.streetNumber) {
                        $("#num").val(order.address.streetNumber);
                        $("#num-label").addClass('active');
                    }
                    if (order.address.city) {
                        $("#city").val(order.address.city);
                        $("#city-label").addClass('active');
                    }
                    if (order.address.zipCode) {
                        $("#zip").val(order.address.zipCode);
                        $("#zip-label").addClass('active');
                    }
                }
                if (order.billData) {
                    if (order.billData.ICO) {
                        $("#ico").val(order.billData.ICO);
                        $("#ico-label").addClass('active');
                    }
                    if (order.billData.ICDPH) {
                        $("#icdph").val(order.billData.ICDPH);
                        $("#icdph-label").addClass('active');
                    }
                    if (order.billData.DIC) {
                        $("#dic").val(order.billData.DIC);
                        $("#dic-label").addClass('active');
                    }
                }
                if (order.price) {
                    $("#price").val(order.price);
                    $("#price-label").addClass('active');
                }
                if (order.notes) {
                    $("#notes").val(order.notes);
                    $("#notes-label").addClass('active');
                }
                if (order.facilities) {
                    $("#facilities").val(order.facilities);
                    $("#facilities-label").addClass('active');
                }
            }

            $('#date').attr('disabled', true);
            $('#time').attr('disabled', true);
            $('#check-sale').attr('disabled', 'disabled');
            $('#check-sale').removeClass('checkbox-blue');

            if ($scope.sale) {
                $("#state-div").addClass('hide');
                $("#state-div").removeClass('show');
                $("#sale-div").addClass('show');
                $("#sale-div").removeClass('hide');
            } else {
                $("#state-div").addClass('show');
                $("#state-div").removeClass('hide');
                $("#sale-div").addClass('hide');
                $("#sale-div").removeClass('show');
            }
        }

        /*var date1 = new Date();
        var utcDate = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate(),
        date1.getUTCHours(), date1.getUTCMinutes(), date1.getUTCSeconds());*/
        //tcDate = new Date(utcDate);
        var utcDate = new Date();


        $.datepicker.regional['sk'] = calendar.calendarSettings;
        $.datepicker.setDefaults($.datepicker.regional['sk']);

        $("#date").datepicker({
            onSelect: function (dateText) {
                console.log('to selected ', dateText);

                var dateParts = dateText.split('.');

                var date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1] - 1), parseInt(dateParts[0]));

                utcDate.setFullYear(date.getFullYear());
                utcDate.setMonth(date.getMonth());
                utcDate.setDate(date.getDate());

                console.log('from selected ', utcDate);
            }
        });

        $("#date").datepicker($.datepicker.regional["sk"]);

        $('#time').timepicker({
            timeFormat: 'HH:mm',
            defaultTime: 'now',
            interval: 15,
            change: function (time) {

                console.log('check', $scope.sale);

                if (utcDate) {
                    time.setUTCHours(time.getUTCHours() + 1);
                    utcDate.setHours(time.getHours());
                    utcDate.setMinutes(time.getMinutes());
                }
            }
        });

        $scope.state = STATE.arrived;

        var date = new Date();

        if (edit) {
            if ($scope.sale) {
                date = new Date(order.orderedDate);
            } else {
                date = new Date(order.arriveDate);
            }
            $scope.state = order.state;
        }
        utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours(), date.getUTCMinutes(), date.getUTCSeconds());

        $("#date").val((utcDate.getDate() >= 10 ? utcDate.getDate() : ('0' + (utcDate.getDate())))
            + '/' + (utcDate.getMonth() + 1 >= 10 ? utcDate.getMonth() + 1 : ('0' + (utcDate.getMonth() + 1)))
            + '/' + utcDate.getFullYear());

        // $("#time").val((utcDate.getHours() >= 10 ? utcDate.getHours() + 1 : ('0' + utcDate.getHours()))
        //     + ':' + (utcDate.getMinutes() >= 10 ? utcDate.getMinutes() : ('0' + utcDate.getMinutes())));

        var names = {};
        var workNames = {};
        var orderNames = {};
        var facilityNames = {};
        var initialFacilityNames = [];

        customers.forEach(function (customer) {
            names[customer.fullName] = null;
        })

        workTypes.forEach(function (worktype) {
            workNames[worktype.name] = null;
        })

        orderTypes.forEach(function (ordertype) {
            orderNames[ordertype.name] = null;
        })

        facilities.forEach(function (facility) {
            facilityNames[facility.name] = null;
        })

        selectedFacilities.forEach(function (facility) {
            initialFacilityNames.push({ tag: facility.name });
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
            },
            minLength: 0
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
            },
            minLength: 0
        })

        $('#customer-search').autocomplete({
            data: names,
            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function (val) {

                for (var i = 0; i < customers.length; i++) {
                    console.log("val", val, customers[i].fullName, val.length, customers[i].fullName.length);
                    if (val === customers[i].fullName) {
                        selectedCustomer = customers[i];
                        console.log("auto found", selectedCustomer);
                        break;
                    }
                }

                $("#customer-search").val(null);
                fillCustomerData();
            },
            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            sortFunction: function (a, b, inputString) {

                //return a.indexOf(inputString) - b.indexOf(inputString);

                if (a.indexOf(inputString) > b.indexOf(inputString)) {
                    return -1;
                } else if (a.indexOf(inputString) < b.indexOf(inputString)) {
                    return 1;
                }
                return 0;
            }
        });

        console.log("facilities", facilities);

        $('#photo-chips').chips({
            onChipSelect: function (chips, elem, selected) {

                var chipsData = chips[0].M_Chips.chipsData;

                var chipText = $(elem).clone().children().remove().end().text();

                chipsData.forEach(function (chip) {
                    if (chip.tag === chipText) {

                        $('#photo-pic').attr('src', chip.url);

                        var instance = M.Modal.getInstance($('#photo-modal'));
                        instance.open();
                    }
                })
            },
            data: selectedPhotoUrls
        })

        $('#facility-chips').chips({
            placeholder: 'Príslušenstvo',
            autocompleteOptions: {
                data: facilityNames,
                limit: Infinity,
                minLength: 1,
                onAutocomplete: function (val) {
                    console.log("find facility", val);
                }
            },
            onChipAdd: function (chips, elem) {
                console.log("Chips was added", chips[0].M_Chips.chipsData);

                var chipsData = chips[0].M_Chips.chipsData;

                selectedFacilities = [];

                chipsData.forEach(function (chip) {
                    facilities.forEach(function (facility) {
                        if (chip.tag == facility.name) {
                            selectedFacilities.push(facility);
                        }
                    })
                })
            },
            onChipDelete: function (chips, elem) {

                console.log("Chips was deleted", chips[0].M_Chips.chipsData);

                var chipsData = chips[0].M_Chips.chipsData;

                selectedFacilities = [];

                chipsData.forEach(function (chip) {
                    facilities.forEach(function (facility) {
                        if (chip.tag == facility.name) {
                            selectedFacilities.push(facility);
                        }
                    })
                })
            },
            data: initialFacilityNames
        });

        $('#load-photo').click(function () {

            if (gapi && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().isSignedIn.get()) {

                picker.setGoogleApi(gapi, gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token);
                picker.loadPicker(function (photos) {

                    console.log("client callback", photos);

                    var instance = M.Chips.getInstance($("#photo-chips"));
                    photos.forEach(function (photo) {
                        instance.addChip({ tag: photo.name, url: photo.url });
                    })
                });

            } else {
                console.log("not logged in");
            }
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

            var email = $("#email").val();
            var phone = $("#phone").val();
            var price = $("#price").val();
            var notes = $("#notes").val();
            var facilities = $("#facilities").val();

            if (notes) {
                var temp = notes.replace(/[\\]/g, '\\\\').replace(/[\"]/g, '\\\"').replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
                order.notes = temp;
            }
            if (facilities) {
                var temp = facilities.replace(/[\\]/g, '\\\\').replace(/[\"]/g, '\\\"').replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
                order.facilities = temp;
            }

            if (price) {

                price = price.replace(/,/g, '.');
                order.price = Number(price);

                if (!order.price && order.price > 0) {
                    $("#price").addClass('invalid');
                    $('#price-label').addClass('active');
                }
            } else {
                $("#price").addClass('invalid');
                $('#price-label').addClass('active');
            }

            if (!order.description || !selectedCustomer || (!order.price && order.price > 0)) {
                return;
            }

            order.contact = {};
            order.contact.customerName = selectedCustomer.fullName;

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

            order.facilitiesArray = [];

            selectedFacilities.forEach(function (selectedFacility) {
                order.facilitiesArray.push(selectedFacility._id);
            })

            if (edit && !$scope.sale && $scope.saveState != $scope.state) {
                order.state = $scope.saveState;
            } else if (edit && $scope.sale && $scope.saleSaveState != $scope.state) {
                order.state = $scope.saleSaveState;
            } else {
                order.state = $scope.state;
            }
            var help = new Date();

            date = new Date(Date.UTC(help.getUTCFullYear(), help.getUTCMonth(), help.getUTCDate(), help.getUTCHours() + 1, help.getUTCMinutes(), help.getUTCSeconds()));

            console.log("state to save", order.state, edit);

            if (edit) {

                if (!$scope.sale) {

                    var timezoneOffset = $scope.stateChild.arrivedDate.getTimezoneOffset() * 60000;
                    order.arriveDate = new Date($scope.stateChild.arrivedDate.getTime() - timezoneOffset);

                    if (order.state === STATE.working ||
                        order.state === STATE.done ||
                        order.state === STATE.pickUp) {

                        var timezoneOffset = $scope.stateChild.startDate.getTimezoneOffset() * 60000;
                        order.startDate = new Date($scope.stateChild.startDate.getTime() - timezoneOffset);
                    }
                    if (order.state === STATE.done ||
                        order.state === STATE.pickUp) {

                        var timezoneOffset = $scope.stateChild.endDate.getTimezoneOffset() * 60000;
                        order.endDate = new Date($scope.stateChild.endDate.getTime() - timezoneOffset);
                    }
                    if (order.state === STATE.pickUp) {

                        var timezoneOffset = $scope.stateChild.pickupDate.getTimezoneOffset() * 60000;
                        order.pickDate = new Date($scope.stateChild.pickupDate.getTime() - timezoneOffset);
                    }

                    var isDateCorrect = $scope.stateChild.checkDates(order);

                    if (!isDateCorrect.check) {
                        console.log("Incorrect dates", isDateCorrect);
                        $("#state-selector-span").removeClass('hide');
                        $("#state-selector-span").text(isDateCorrect.text);
                        return;
                    }

                } else {
                    var timezoneOffset = $scope.saleChild.orderedDate.getTimezoneOffset() * 60000;
                    order.orderedDate = new Date($scope.saleChild.orderedDate.getTime() - timezoneOffset);

                    if (order.state === STATE.saleObtained ||
                        order.state === STATE.saleLeaved) {

                        var timezoneOffset = $scope.saleChild.obtainedDate.getTimezoneOffset() * 60000;
                        order.obtainedDate = new Date($scope.saleChild.obtainedDate.getTime() - timezoneOffset);
                    }
                    if (order.state === STATE.saleLeaved) {

                        var timezoneOffset = $scope.saleChild.leavedDate.getTimezoneOffset() * 60000;
                        order.leavedDate = new Date($scope.saleChild.leavedDate.getTime() - timezoneOffset);
                    }

                    var isDateCorrect = $scope.saleChild.checkDates(order);

                    if (!isDateCorrect.check) {
                        console.log("Incorrect dates", isDateCorrect);
                        $("#sale-selector-span").removeClass('hide');
                        $("#sale-selector-span").text(isDateCorrect.text);
                        return;
                    }
                }
            }

            var instance = M.Chips.getInstance($("#photo-chips"));

            order.photoUrls = instance.chipsData;

            var options = {
                url: '/order',
                data: {
                    order
                }
            }
            if (e.target.id === 'create') {

                var userTimezoneOffset = date.getTimezoneOffset() * 60000;
                var createDate = new Date(utcDate.getTime() - userTimezoneOffset);

                if ($scope.sale) {

                    if (options.data.order.orderType) delete options.data.order.orderType;
                    if (options.data.order.workType) delete options.data.order.workType;

                    options.data.order.sale = true;
                    options.data.order.state = STATE.saleOrdered;
                    options.data.order.orderedDate = createDate;
                } else {
                    //options.data.order.arriveDate = utcDate;
                    options.data.order.arriveDate = createDate;
                }

                options.method = 'post';

                preloader.open('Vytvára sa zákazka ...');
            }
            else {
                var pathname = window.location.pathname.split("/");
                var id = pathname[pathname.length - 1];
                options.method = 'put';
                options.url = '/order/' + id;
                preloader.open('Edituje sa zákazka ...');
            }

            console.log("options", options);

            http.request(options, (err, response) => {
                preloader.close();
                if (err) console.log("error", err);
                else if (response) {
                    if (response.data.id && e.target.id === 'create') {
                        if (gapi && gapi.auth2.getAuthInstance() && gapi.auth2.getAuthInstance().isSignedIn.get()) {
                            calendar.setGoogleApi(gapi);
                            calendar.insertEvent(order, response.data.id, selectedCustomer);
                        }
                    } 
                    location.href = "/order/all";
                }
            })
        })

        preloader.close();

        $('input[type=radio][name=legal-form]').change(function () {
            if (this.value == 'person') {
                $("#person-form").show();
                $("#company-form").hide();
            }
            else if (this.value == 'company') {
                $("#person-form").hide();
                $("#company-form").show();
            }
        });
        $('#show-company').prop('checked', true);
        $("#person-form").hide();
        $("#company-form").show();

        $("#create-customer-btn").click(function (e) {

            var data = {};
            var form = $('input[name=legal-form]:checked', '#customer-form').val();

            if (form === 'company') {

                var company = {};
                company.name = $("#name").val();

                if (!company.name) {
                    $('#name').addClass('invalid');
                    $('#name-label').addClass('active');
                    return;
                }
                var firstName = $("#contact-first").val();
                var lastName = $("#contact-last").val();
                var email = $("#contact-email").val();
                var phone = $("#contact-phone").val();

                if (firstName || lastName || email || phone) {
                    company.contactPerson = {};
                }
                if (firstName) company.contactPerson.firstName = firstName;
                if (lastName) company.contactPerson.lastName = lastName;
                if (email) company.contactPerson.email = email;
                if (phone) company.contactPerson.phone = phone;

                data.company = company;
                data.fullName = company.name;
                data.search = company.name;

            } else if (form === 'person') {

                var person = {};

                person.firstName = $("#first").val();
                person.lastName = $("#last").val();

                if (!person.lastName) {
                    $('#last').addClass('invalid');
                    $('#last-label').addClass('active');
                    return;
                }
                var email = $("#customer-email").val();
                var phone = $("#customer-phone").val();

                if (email) person.email = email;
                if (phone) person.phone = phone;

                data.person = person;

                if (person.firstName && person.firstName.length > 0 && person.lastName && person.lastName) {
                    data.fullName = person.firstName + " " + person.lastName;
                } else if ((person.firstName && person.firstName.length > 0) && !(person.lastName && person.lastName)) {
                    data.fullName = person.firstName;
                } else if (!(person.firstName && person.firstName.length > 0) && (person.lastName && person.lastName)) {
                    data.fullName = person.lastName;
                }
                data.search = person.lastName;
            }

            var options = { data: { customer: data } };

            options.url = '/customer';
            options.method = 'post';

            http.request(options, (err, response) => {
                if (err) console.log(err);
                else if (response) {
                    console.log("created", response);
                    //location.href = '/customer/' + response.data.id;
                    data._id = response.data.id;
                    selectedCustomer = data;
                    fillCustomerData();
                    $('#order-tab-container').tabs('select', 'assign-customer');
                }
            })
        })
    })
})
