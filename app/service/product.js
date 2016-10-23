angular.module('app')
    .factory('Product', ['Httpquery', '$http', '$cookies', function (Httpquery, $http, $cookies) {
        function getCurrentCourse () {
            var url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
            return $http.get(url).then(function (res) {
                return res;
            });
        }
        return {
            products: null,
            getList: function () {
                var self = this;
                if (this.products == null) {
                    return Httpquery.query({params1: 'products'}, function (res) {
                        var currency = $cookies.get('currency');
                        if (currency != 'UAH') {
                            self.changeCurrency(currency);
                        }
                        return self.products = res;
                    })
                }
                return self.products;
            },
            changeCurrency: function (newC) {
                var self = this;
                var prod;
                Httpquery.query({params1: 'products'}, function (res) {
                    prod = res;
                    getCurrentCourse().then(function (res) {
                        changePrice (_.find(res.data, {ccy: newC}));
                    });
                });

                function changePrice (curr) {
                    if (curr == undefined) {
                        return _.each(self.products, function (el, i) {
                            el.price = prod[i].price;
                            el.currency = 'UAH';
                        })
                    }
                    var currentPrice = curr.sale;

                    _.each(self.products, function (el, i) {
                        if (el.old_price) {
                            el.old_price =  (prod[i].old_price / currentPrice).toFixed(2);
                        }
                        el.price = (prod[i].price / currentPrice).toFixed(2);
                        el.currency = curr.ccy;
                    })
                }
            }
        }
    }]);