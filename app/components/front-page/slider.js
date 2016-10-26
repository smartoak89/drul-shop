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

        }]
    });