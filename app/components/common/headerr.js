angular.module('app')
    .component('headerr', {
        templateUrl: "components/common/headerr.html",
        controller: [function() {
            console.log('Header loaded!')
        }]
    });