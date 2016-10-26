angular.module('admin')
    .component('goods', {
        templateUrl: "admin/components/goods/goods.html",
        controller: ['Goods',function(Goods) {
            this.$onInit = function () {

            }
            this.products = Goods.list();
        }]
    });
