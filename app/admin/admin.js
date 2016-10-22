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
        $stateProvider.state('categsAdmin', {
            url: "/admin/categs",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@categsAdmin': {template: "<categs></categs>"}
            }
        });
        $stateProvider.state('tovsAdmin', {
            url: "/admin/tovs",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('usersAdmin', {
            url: "/admin/users",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('reqsAdmin', {
            url: "/admin/reqs",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('stocksAdmin', {
            url: "/admin/stocks",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('currAdmin', {
            url: "/admin/curr",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('delivAdmin', {
            url: "/admin/deliv",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('comAdmin', {
            url: "/admin/com",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });

    }]);