/*global angular*/
"use strict";

var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('/', {
        url: "/",
        template: "<index></index>"
    });

}]);