angular.module('app')
    .service('Httpquery', ['$resource', function ($resource) {
        return $resource('/api/:params1/:params2', {});
    }])
    .service('Category', ['Httpquery', function (Httpquery) {
        var category = null;
        this.getList = function () {
            if (category == null) {
                return Httpquery.query({params1: 'categories'}, function (res) {
                    return category = res;
                })
            }
            return category;
        }
    }])
    .service('Product', ['Httpquery', function (Httpquery) {
        var products = null;
        this.getList = function () {
            if (products == null) {
                return Httpquery.query({params1: 'products'}, function (res) {
                    return products = res;
                })
            }
            return products;
        }
    }]);