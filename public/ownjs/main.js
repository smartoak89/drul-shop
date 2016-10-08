(function() {
    'use strict';
    $(document).ready(function() {
        $('.sel').niceSelect();
        $('#sm_slider').smSlider();
        $(".accordion").accordion({
            firstChildExpand: true,
            multiExpand: false,
            slideSpeed: 500,
            dropDownIcon: "&#xf107"
        });
        $('.paginat').pagination({
            items: 93,
            cssStyle: 'light-theme',
            edges: 2,
            displayedPages: 3
        });
        $(".scroll").mCustomScrollbar({
            theme: 'rounded-dark'
        });
        $('.sp-wrap').smoothproducts();
    });
    var slider = $('#slider'),
        tooltip = $('.tooltip');

    tooltip.hide();

    slider.slider({
        range: "min",
        min: 1,
        value: 35,

        start: function(event,ui) {
            tooltip.fadeIn('fast');
        },

        slide: function(event, ui) {

            var value = slider.slider('value'),
                volume = $('.volume');

            tooltip.css('left', value).text(ui.value);

            //if(value <= 5) {
            //    $('.volume').removeClass('bi_volume-low-a').removeClass('bi_volume-high-a').removeClass('bi_volume-medium-a').addClass('bi_volume-mute-a');
            //}
            //else if (value <= 35 && value > 6) {
            //    $('.volume').removeClass('bi_volume-mute-a').removeClass('bi_volume-high-a').removeClass('bi_volume-medium-a').addClass('bi_volume-low-a');
            //}
            //else if (value <= 75 && value > 36) {
            //    $('.volume').removeClass('bi_volume-mute-a').removeClass('bi_volume-high-a').removeClass('bi_volume-low-a').addClass('bi_volume-medium-a');
            //}
            //else{
            //    $('.volume').removeClass('bi_volume-mute-a').removeClass('bi_volume-medium-a').removeClass('bi_volume-low-a').addClass('bi_volume-high-a');
            //};
            if(value <= 5) {
                $('.volume').removeClass('s-7').addClass('s-6');
            }else{
                $('.volume').removeClass('s-6').addClass('s-7');
            };
        },

        stop: function(event,ui) {
            tooltip.fadeOut('fast');
        },
    });

})();