"use strict";

angular.module('admin', [
    'treeGrid',
    'ngResource'
])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('admin', {
            url: "/admin",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<main-admin-content></main-admin-content>"}
            }
        });
        $stateProvider.state('admin.categoriesAdmin', {
            url: "/categories",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<categories></categories>"}
            }
        });
        $stateProvider.state('admin.goodsAdmin', {
            url: "/goods",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<goods></goods>"}
            }
        });
        $stateProvider.state('admin.usersAdmin', {
            url: "/users",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<users></users>"}
            }
        });
        $stateProvider.state('admin.requestsAdmin', {
            url: "/requests",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<requests></requests>"}
            }
        });
        $stateProvider.state('admin.stocksAdmin', {
            url: "/stocks",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<stocks></stocks>"}
            }
        });
        $stateProvider.state('admin.currencyAdmin', {
            url: "/currency",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<currency></currency>"}
            }
        });
        $stateProvider.state('admin.deliveryAdmin', {
            url: "/delivery",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<delivery></delivery>"}
            }
        });
        $stateProvider.state('admin.commentsAdmin', {
            url: "/comments",
            views: {
                '': {template: "<template-admin></template-admin>"},
                'content': {template: "<comments></comments>"}
            }
        });

    }]);