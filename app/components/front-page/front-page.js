angular.module('app')
    .component('frontContent', {
        templateUrl: "components/front-page/front-page.html",
        controller: ['Product', function(Product) {
            var self = this;

            this.$onInit = function () {
                self.products = Product.getList();
            };
            angular.element(document).ready(function () {
                console.log('ready')
            });
        }]
    });