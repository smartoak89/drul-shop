angular.module('admin')
    .component('settings', {
        templateUrl: "admin/components/settings/settings.html",
        controller: ['Currency', function(Currency) {
            var self = this;
            self.cur = Currency.getCurrentCourse();
            console.log(self.cur)
        }]
    });