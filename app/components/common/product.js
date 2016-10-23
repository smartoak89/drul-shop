angular.module('app')
    .component('product', {
        // templateUrl: "components/common/product.html",
        template: '<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">' +
                            '<div class="goodsBlock">' +
                                '<div class="marker red">sale</div>' +
                                    '<img ng-src="{{\'/api/file/\' + $ctrl.product.photo}}" class="img-responsive cover"/>' +
                                    '<div class="namePrice">' +
                                    '<div>{{$ctrl.product.article}}</div>' +
                                    '<p>{{$ctrl.product.name}}</p>' +
                                    '<hr class="line"/><span>{{$ctrl.product.price + " " + $ctrl.product.currency}}</span>' +
                                '<strike ng-show="$ctrl.product.old_price">{{$ctrl.product.old_price + " " + $ctrl.product.currency}}</strike>' +
                                '</div>' +
                            '</div>' +
                    '</div>',
        bindings: {
            product: '='
        },
        controller: ['$cookies', function($cookies) {
            this.product.currency = $cookies.get('currency');
        }]
    });