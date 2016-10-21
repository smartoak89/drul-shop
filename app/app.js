"use strict";

var app = angular.module('app', [
    'ui.router',
    'admin',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'ngResource']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('indexCommon', {
        url: "/",
        views: {
            '': {template: "<template-common></template-common>"},
            'content@indexCommon': {template: "<front-content></front-content>"}
        }
    });

    $stateProvider.state('filterPage', {
        url: "/category/:name",
        views: {
            '': {template: "<template-common></template-common>"},
            'content@filterPage': {template: "<filter-page></filter-page>"}
        }
    });

}]);