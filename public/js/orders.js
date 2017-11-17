$(document).ready(function () {

    $('select').material_select();

    $('.caret').each(function (caret) {
        $(this).text(' ');
    })

    $.datepicker.regional['sk'] = {
        closeText: 'Zavrieť',
        prevText: '&lt; Predchádzajúci',
        nextText: 'Nasledujúci &gt;',
        currentText: 'Dnes',
        monthNames: [
            'Január',
            'Február',
            'Marec',
            'Apríl',
            'Máj',
            'Jún',
            'Júl',
            'August',
            'September',
            'Október',
            'November',
            'December'
        ],
        monthNamesShort: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Máj',
            'Jún',
            'Júl',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dec'
        ],
        dayNames: [
            'Nedeľa',
            'Pondelok',
            'Utorok',
            'Streda',
            'Štvrtok',
            'Piatok',
            'Sobota'
        ],
        dayNamesShort: [
            'Ned',
            'Pon',
            'Uto',
            'Str',
            'Štv',
            'Pia',
            'Sob'
        ],
        dayNamesMin: [
            'Ne',
            'Po',
            'Ut',
            'St',
            'Št',
            'Pia',
            'So'
        ],
        dateFormat: 'd.m.yy',
        firstDay: 0,
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['sk']);

    $("#from-date").datepicker($.datepicker.regional["sk"]);

    $("#to-date").datepicker($.datepicker.regional["sk"]);

})