$(document).ready(function () {

    $("#create, #update").click(function (e) {

        var customer = {};

        customer.name = $("#name").val();

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


        if (e.target.id === 'create') {
            $.ajax({
                url: '/customer',
                type: 'POST',
                dataType: 'json',
                data: customer,
                success: function (result) {
                    console.log(JSON.stringify(result));
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            })
        } else if (e.target.id === 'update') {

            $.ajax({
                url: '/customer/' + localStorage.getItem('updateId'),
                type: 'PUT',
                dataType: 'json',
                data: customer,
                success: function (result) {
                    console.log(JSON.stringify(result));
                    var id = localStorage.getItem('updateId');
                    localStorage.removeItem('updateId');
                    location.href = '/customer/' + id;
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                    localStorage.removeItem('updateId');
                }
            })
        }
    })
})