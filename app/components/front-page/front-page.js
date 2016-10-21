angular.module('app')
    .component('frontContent', {
        templateUrl: "components/front-page/front-page.html",
        controller: [function() {
            console.log('Index content loaded!')
        }]
    });