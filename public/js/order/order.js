$(document).ready(function () {
    
    var names = {};
    var selectedCustomer = {};

    for (var i = 0; i < customers.length; i++) {
        names[customers[i].name] = null;
    }

    console.log(names);

    $('.selected').click(function(event) {
        var id = event.target.id;
        for (var i = 0; i < customers.length; i++) {
            if (id === customers[i]._id) {
                selectedCustomer = customers[i];
                break;
            }
        }
        var doneLabel = document.getElementById('done-customer');
        doneLabel.innerText = selectedCustomer.name;
        doneLabel.classList.remove('orange');
        doneLabel.classList.remove('lighten-3');
        doneLabel.classList.add('green');
        doneLabel.classList.add('lighten-3');
        console.log(JSON.stringify(selectedCustomer));
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
            var doneLabel = document.getElementById('done-customer');
            doneLabel.innerText = selectedCustomer.name;
            console.log(JSON.stringify(selectedCustomer));
        },
        minLength: 3, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
})