angular.module('app')
    .factory('Currency', ['$http', function ($http) {
        return {
            getCurrentCourse: function () {
                var url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
                return $http.get(url).then(function (res) {
                    return res;
                });
            }
        }
    }]);