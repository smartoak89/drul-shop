
var app = angular.module('app');

app.component('index', {
    templateUrl: "components/index.html",
    controller: function() {
        this.test = 'Hello'
    }
});