angular.module('app')
    .service('test', function () {
        this.test = null;
        this.change = function () {
            this.test = 'Masha'
        }
    });