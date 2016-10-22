angular.module('app')
    .component('slider', {
        templateUrl: "components/front-page/slider.html",
        controller: [function() {
            var self = this;
            self.myInterval = 5000;
            self.noWrapSlides = false;
            self.active = 0;
            var slides = self.slides = [{id: 0},{id: 1},{id: 2}];
            var currIndex = 0;
            $(window).scroll(function () {
                var scrollh = $(this).scrollTop();
                if (scrollh > 60) {
                    $("#sm_slider").addClass('compact');
                } else {
                    $("#sm_slider").removeClass('compact');
                }
            });
        }]
    });