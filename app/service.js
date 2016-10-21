angular.module('app')
    .service('Httpquery', ['$resource', function ($resource) {
        return $resource('/api/:path', {});
    }])
    .service('category', ['Httpquery', function (Httpquery) {
        var category = null;
        this.getList = function () {
            if (category == null) {
                return Httpquery.query({path: 'categories'}, function (res) {
                    return category = res;
                })
            }
            return category;
        }
    }]);