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


        if (e.target.id === 'create') {
            console.log(JSON.stringify(customer));
            $.ajax({
                url: '/customer',
                type: 'POST',
                dataType: 'json',
                data: customer,
                success: function (result) {
                    location.href = '/customer/' + result.id;
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