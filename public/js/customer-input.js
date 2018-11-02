import http from '../lib/http.js';

$(document).ready(function () {

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

    $("#create, #update").click(function (e) {

        var data = {};

        var form = $('input[name=legal-form]:checked', '#customer-form').val();

        if (form === 'company' || (window.customer && window.customer.company)) {

            var company = {};

            company.name = $("#name").val();

            if (!company.name) {

                $('#name').addClass('invalid');

                $('#name-label').addClass('active');

                return;
            }

            var street = $("#company-street").val();
            var streetNumber = $("#company-num").val();
            var city = $("#company-city").val();
            var zipCode = $("#company-zip").val();

            if (street || streetNumber || city || zipCode) {
                company.address = {};
            }
            if (street) company.address.street = street;
            if (streetNumber) company.address.streetNumber = streetNumber;
            if (city) company.address.city = city;
            if (zipCode) company.address.zipCode = zipCode;

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

            var ico = $("#ico").val();
            var icdph = $("#icdph").val();
            var dic = $("#dic").val();

            if (ico || icdph || dic) {
                company.billData = {};
            }
            if (ico) company.billData.ICO = ico;
            if (icdph) company.billData.ICDPH = icdph;
            if (dic) company.billData.DIC = dic;

            console.log(JSON.stringify(company, 2, 2));

            data.company = company;
            data.fullName = company.name;
            data.search = company.name;

        } else if (form === 'person' || (customer && customer.person)) {

            var person = {};

            person.firstName = $("#first").val();
            person.lastName = $("#last").val();

            if (!person.lastName) {

                $('#last').addClass('invalid');

                $('#last-label').addClass('active');

                return;
            }

            var street = $("#person-street").val();
            var streetNumber = $("#person-num").val();
            var city = $("#person-city").val();
            var zipCode = $("#person-zip").val();

            if (street || streetNumber || city || zipCode) {
                person.address = {};
            }
            if (street) person.address.street = street;
            if (streetNumber) person.address.streetNumber = streetNumber;
            if (city) person.address.city = city;
            if (zipCode) person.address.zipCode = zipCode;

            var email = $("#email").val();
            var phone = $("#phone").val();

            if (email) person.email = email;
            if (phone) person.phone = phone;

            console.log(JSON.stringify(person, 2, 2));

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

        var options = { data: {customer: data} };

        if (e.target.id === 'create') {

            options.url = '/customer';
            options.method = 'post';

            http.request(options, (err, response) => {
                if (err) console.log(err);
                else if (response) {
                    //console.log(response);
                    location.href = '/customer/' + response.data.id;
                }
            })

        } else if (e.target.id === 'update') {

            var pathname = window.location.pathname.split("/");
            var id = pathname[pathname.length - 1];
            options.url = '/customer/' + id;
            options.method = 'put';

            //console.log(JSON.stringify(options, 2, 2));

            http.request(options, (err, response) => {

                //localStorage.removeItem('updateId');

                if (err) {
                    console.error(err);
                } else if (response) {
                    console.log(response);
                    location.href = '/customer/' + id;
                }
            })
        }
    })
})