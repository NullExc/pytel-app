$(document).ready(function () {

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