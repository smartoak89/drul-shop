angular.module('app')
    .component('slider', {
        templateUrl: "components/partial/slider.html",
        controller: [function() {
            console.log('Slider loaded!')
        }]
    });