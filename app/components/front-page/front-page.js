angular.module('app')
    .component('frontContent', {
        templateUrl: "components/front-page/front-page.html",
        controller: ['Product', 'Cart', function(Product, Cart) {
            var self = this;
            this.getCart = function () {
                console.log(Cart.getFromCart())
            };
            this.$onInit = function () {
                self.products = Product.getList();
            };
            angular.element(document).ready(function () {
                console.log('ready')
            });
        }]
    });