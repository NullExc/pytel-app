import ejs from '../lib/ejs';

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

        var ejsTest;

        if ($(this).val() === '1') {

            ejsTest = ejs.compile('<% var temp = customers; \
            customers =[]; \
            customers = temp.sort(function(a,b) {return (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0);} ); %>');
        } else if ($(this).val() === '2') {
            ejsTest = ejs.compile('<% var temp = customers; \
            customers =[]; \
            customers = temp.sort(function(a,b) {return (a.lastName > b.lastName) ? -1 : ((b.lastName > a.lastName) ? 1 : 0);} ); %>');
        }

        ejsTest({});

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