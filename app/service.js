angular.module('app')
    .service('Httpquery', ['$resource', function ($resource) {
        return $resource('/api/:path', {});
    }]);