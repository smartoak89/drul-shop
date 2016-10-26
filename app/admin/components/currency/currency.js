angular.module('admin')
    .component('currency', {
        templateUrl: "admin/components/currency/currency.html",
        controller: ['Currency', function(Currency) {
            var self = this;
            self.cur = Currency.getCurrentCourse();
            console.log(self.cur)
        }]
    });