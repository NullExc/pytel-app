import $ from 'jquery';

export default {
    open: function (info) {
        $('.preloader-info').text(info);
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
        $('.header-row').css('margin-bottom', 0);
        $('.loader-wrapper').show();
    },
    close: function () {
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
        $('.header-row').css('margin-bottom', 20);
        $('.loader-wrapper').hide();
    }
}