angular.module('app')
    .component('topNav', {
        templateUrl: "components/common/top-nav.html",
        controller: [function() {
            console.log('Top navbar loaded!')
        }]
    });