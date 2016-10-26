angular.module('app')
    .component('templateCommon', {
        templateUrl: "components/common/template-common.html",
        controller: [function() {
            $(window).scroll(function () {
                var scrollh = $(this).scrollTop();
                if (scrollh > 60) {
                    $("#content").addClass('padScroll');
                } else {
                    $("#content").removeClass('padScroll');
                }
            });
        }]
    });