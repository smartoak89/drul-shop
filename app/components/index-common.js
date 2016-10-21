angular.module('app')
    .component('indexCommon', {
        templateUrl: "components/index-common.html",
        controller: ['test', function(test) {
            this.testS = test;
        }]
    });