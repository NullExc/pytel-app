

$(document).ready(function () {

    $('select').material_select();

    $('.caret').each(function (caret) {
        $(this).text(' ');
    })

    $("#add").click(function () {
        location.href = '/customer-new';
    });

    $('#order-name').change(function () {

        var div = document.getElementById('list-container');

        if ($(this).val() === '1') {

            var ejsTest = ejs.compile('<% var temp = customers; \
            customers =[]; \
            customers = temp.sort(function(a,b) {return (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0);} ); %>');

            ejsTest({});
        } else if ($(this).val() === '2') {
            var ejsTest = ejs.compile('<% var temp = customers; \
            customers =[]; \
            customers = temp.sort(function(a,b) {return (a.lastName > b.lastName) ? -1 : ((b.lastName > a.lastName) ? 1 : 0);} ); %>');

            ejsTest({});
        }

        var output = ejs.compile('<ul id="list" class="collection" style="margin-top: 0px;"> \
                                    <% customers.forEach(function(customer) { %> \
                                        <a href="/customer/<%= customer._id %>" class="customer-item collection-item avatar black-text"> \
                                            <p class="title"><%= customer.firstName + " " + customer.lastName %></p> \
                                            <span><%= customer.contact.email %></span> \
                                            <br><span><%= customer.address %></span> \
                                        </a><% }); %> \
                                </ul>');
        div.innerHTML = output();
    })
})