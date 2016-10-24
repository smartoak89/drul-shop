angular.module('app')
    .service('Cart', ['Httpquery', '$cookies', '$q', function (Httpquery, $cookies, $q) {
        return {
            addToCart: function (product) {
                var storOrders = $cookies.get('order');
                if (!storOrders) {
                    storOrders = ''
                }
                storOrders += '%S' + product.uuid;
                $cookies.put('order', storOrders);
            },
            getFromCart: function (callback) {
                var products = $cookies.get('order');
                var arrRes = [];
                if (products){
                    products = parseOrderStor(products);
                    _.each(getAllProducts(products), function(i) {
                        arrRes.push(i);
                    });
                    return arrRes;
                }
            }
        };
        function getAllProducts (uuidArr) {
            var promises = [];
            _.each(uuidArr, function (i) {
                promises.push(Httpquery.get({params1: 'product', params2: i}, function (res) {
                    return res;
                }));
            });
            return promises;
        }
        function parseOrderStor (arr) {
            return arr.split('%S').slice(1)
        }
    }]);