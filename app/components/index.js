
var app = angular.module('app');

app.component('index', {
    templateUrl: "components/index.html",
    controller: ['myf', function(myf) {
        this.test = myf.blabla
    }]
});