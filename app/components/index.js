angular.module('app')
    .component('index', {
        templateUrl: "components/index.html",
        controller: ['test', function(test) {
            this.testS = test;
        }]
    });