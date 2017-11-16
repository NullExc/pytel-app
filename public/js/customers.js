import ejs from '../lib/ejs';

$(document).ready(function () {

    $('select').material_select();

    $('.caret').each(function (caret) {
        $(this).text(' ');
    })

    $("#add").click(function () {
        location.href = '/customer-new';
    });

    $('#sort-select').change(function () {

        if ($(this).val() === '1') {

            location.href = "/customer/all?sort=ascending";

        } else if ($(this).val() === '2') {

            location.href = "/customer/all?sort=descending";
        }
    })

    $('#order-select').change(function () {

        if ($(this).val() === '1') {
            location.href = "/customer/all?sort=ascending&order=all";
        } else if ($(this).val() === '2') {
            location.href = "/customer/all?sort=descending&order=arrived";
        } else if ($(this).val() === '3') {
            location.href = "/customer/all?sort=descending&order=working";
        } else if ($(this).val() === '4') {
            location.href = "/customer/all?sort=descending&order=done";
        } 
    })
})