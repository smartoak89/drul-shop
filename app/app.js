/*global angular*/
"use strict";

var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('indexCommon', {
        url: "/",
        views: {
            '': {template: "<index-common></index-common>"},
            'content@indexCommon': {template: "<main-content></main-content>"}
        }
    });

}]);