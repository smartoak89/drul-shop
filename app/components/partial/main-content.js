angular.module('app')
    .component('mainContent', {
        templateUrl: "components/partial/main-content.html",
        controller: [function() {
            console.log('Index content loaded!')
        }]
    });