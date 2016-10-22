"use strict";

angular.module('admin', [])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('indexAdmin', {
            url: "/admin",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });

    }]);