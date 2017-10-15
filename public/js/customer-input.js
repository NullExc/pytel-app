import http from '../lib/http.js';

$(document).ready(function () {

    $("#create, #update").click(function (e) {

        var customer = {};

        customer.firstName = $("#first").val();
        customer.lastName = $("#last").val();

        var email = $("#email").val();
        var phone = $("#phone").val();

        if (email || phone) {
            customer.contact = {};
        }
        if (email) customer.contact.email = email;
        if (phone) customer.contact.phone = phone;

        var street = $("#street").val();
        var streetNumber = $("#num").val();
        var city = $("#city").val();
        var zipCode = $("#zip").val();

        if (street || streetNumber || city || zipCode) {
            customer.address = {};
        }
        if (street) customer.address.street = street;
        if (streetNumber) customer.address.streetNumber = streetNumber;
        if (city) customer.address.city = city;
        if (zipCode) customer.address.zipCode = zipCode;

        var ico = $("#ico").val();
        var icdph = $("#icdph").val();
        var dic = $("#dic").val();

        if (ico || icdph || dic) {
            customer.billData = {};
        }
        if (ico) customer.billData.ICO = ico;
        if (icdph) customer.billData.ICDPH = icdph;
        if (dic) customer.billData.DIC = dic;

        var options = {data: customer};

        if (e.target.id === 'create') {

            options.url = '/customer';
            options.method = 'post';

            http.request(options, (err, response) => {
                if (err) console.log(err);
                else if (response) {
                    location.href = '/customer/' + response.data.id;
                }
            })

        } else if (e.target.id === 'update') {

            var id = localStorage.getItem('updateId');
            options.url = '/customer/' + id;
            options.method = 'put';

            http.request(options, (err, response) => {

                localStorage.removeItem('updateId');

                if (err) {
                    console.error(err);
                } else if (response) {
                    location.href = '/customer/' + id;
                }
            })
        }
    })
})