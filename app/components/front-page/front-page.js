angular.module('app')
    .component('frontContent', {
        templateUrl: "components/front-page/front-page.html",
        controller: ['Product', function(Product) {
            var self = this;

            this.$onInit = function () {
                self.products = Product.getList();
                console.log('self.products', self.products)
            }
        }]
    });