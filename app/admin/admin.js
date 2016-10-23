"use strict";

angular.module('admin', ['treeGrid'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('indexAdmin', {
            url: "/admin",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@indexAdmin': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('categoriesAdmin', {
            url: "/admin/categories",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@categoriesAdmin': {template: "<categories></categories>"}
            }
        });
        $stateProvider.state('goodsAdmin', {
            url: "/admin/goods",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@goodsAdmin': {template: "<goods></goods>"}
            }
        });
        $stateProvider.state('usersAdmin', {
            url: "/admin/users",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@usersAdmin': {template: "<users></users>"}
            }
        });
        $stateProvider.state('requestsAdmin', {
            url: "/admin/requests",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@requestsAdmin': {template: "<requests></requests>"}
            }
        });
        $stateProvider.state('stocksAdmin', {
            url: "/admin/stocks",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@stocksAdmin': {template: "<stocks></stocks>"}
            }
        });
        $stateProvider.state('currencyAdmin', {
            url: "/admin/currency",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@currencyAdmin': {template: "<currency></currency>"}
            }
        });
        $stateProvider.state('deliveryAdmin', {
            url: "/admin/delivery",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@deliveryAdmin': {template: "<delivery></delivery>"}
            }
        });
        $stateProvider.state('commentsAdmin', {
            url: "/admin/comments",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content@commentsAdmin': {template: "<comments></comments>"}
            }
        });

    }]);