$(document).ready(function () {

    
    var orders = document.getElementsByClassName('collapsible-body');
    var allInfo = document.getElementById('all-info');

    for (var i = 0; i < orders.length; i++) {
        orders[i].style.maxHeight = $("#all-info").height() - (4 * ($(".collapsible-header").height()));
    }

    $("#deleteCustomer").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        console.log(id);
        $.ajax({
            url: '/customer/' + id,
            type: 'DELETE',
            success: function (result) {
                location.href = '/customer/all';
            }
        })
    });

    $("#edit").click(function () {
        var pathname = window.location.pathname.split("/");
        var id = pathname[pathname.length - 1];
        location.href = '/customer-edit/' + id;
    });

    $('.modal').modal();

    $.ajax({
        url: '/customer/names',
        type: 'GET',
        success: function (result) {
            console.log(result);

            $('input.autocomplete').autocomplete({
                data: result,
                limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function (val) {
                    console.log(val);
                },
                minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            });
        }
    });
})