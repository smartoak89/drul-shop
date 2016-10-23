angular.module('app')
    .service('User', ['Httpquery', '$cookies', function (Httpquery, $cookies) {
        var currency = $cookies.get('currency');
    }]);