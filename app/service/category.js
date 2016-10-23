angular.module('app')
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
    }]);